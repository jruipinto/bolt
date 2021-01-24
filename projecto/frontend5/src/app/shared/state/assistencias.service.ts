import { Injectable } from '@angular/core';
import { concat, of } from 'rxjs';
import { map, concatMap, toArray } from 'rxjs/operators';
import { EntityStateAbstraction } from 'src/app/shared/abstraction-classes';
import { AssistenciasApiService, AuthService, MessagesApiService } from 'src/app/shared/services';
import { ArtigosService } from './artigos.service';
import { EncomendasService } from './encomendas.service';
import { Assistencia, EventoCronologico, Artigo, Encomenda } from 'src/app/shared/models';
import { Message } from '../components/chat-widget/models/message.model';

@Injectable({ providedIn: 'root' })
export class AssistenciasService extends EntityStateAbstraction {

  constructor(
    protected assistenciasAPI: AssistenciasApiService,
    private authService: AuthService,
    private artigosService: ArtigosService,
    private encomendasService: EncomendasService,
    private messagesService: MessagesApiService) {
    super(assistenciasAPI);
  }

  public get(id: number) {
    return super.get(id).pipe(
      map((res: Assistencia[]) => res[0]),

      // retrieve assistencia.material data
      concatMap(assistencia => {
        if (assistencia && assistencia.material) {
          return concat(...assistencia.material.map(
            (artigo: Partial<Artigo>) => this.artigosService.get(artigo.id).pipe(
              map((dbArtigo: Artigo[]) => dbArtigo[0]),
              map(dbArtigo => ({ ...dbArtigo, qty: artigo.qty }))
            )
          )).pipe(
            toArray(),
            map((material: Artigo[]) => ({ ...assistencia, material }) as Assistencia)
          );
        }
        return of(assistencia);

      }),

      // retrieve assistencia.encomendas data
      concatMap(assistencia => {
        if (assistencia && assistencia.encomendas) {
          return concat(...assistencia.encomendas.map(
            (encomenda: Partial<Encomenda>) => this.encomendasService.get(encomenda.id).pipe(
              map((dbEncomenda: Encomenda[]) => dbEncomenda[0]),
              map(dbEncomenda => ({ ...dbEncomenda, qty: encomenda.qty }))
            )
          )).pipe(
            toArray(),
            map((encomendas: Encomenda[]) => ({ ...assistencia, encomendas }) as Assistencia)
          );
        }
        return of(assistencia);

      }),

      // retrieve assistencia.messages data
      concatMap(assistencia => {
        if (assistencia && assistencia.messages) {
          return concat(...assistencia.messages.map(
            (message: Partial<Message>) => this.messagesService.get(message.id).pipe(
              map((dbMessage: Message[]) => dbMessage[0])
            )
          )).pipe(
            toArray(),
            map((messages: Message[]) => ({ ...assistencia, messages }) as Assistencia)
          );
        }
        return of(assistencia);

      }),

      map(res => [res])
    );
  }

  public create(assistencia: Partial<Assistencia>) {
    const {
      tecnico_user_id,
      relatorio_interno,
      relatorio_cliente,
      material,
      encomendas,
      messages,
      preco,
      estado
    } = assistencia;
    const registo_cronologico: EventoCronologico[] = [{
      editor_user_id: this.authService.getUserId(),
      editor_action: 'novo estado',
      tecnico_user_id,
      relatorio_interno,
      relatorio_cliente,
      material,
      encomendas,
      messages,
      preco,
      estado,
      updatedAt: new Date().toLocaleString() // dia/mes/ano, hora:minuto:segundo naquele momento
    }];
    return super.create({ ...assistencia, registo_cronologico } as Assistencia);
  }

  public patch(id: number, assistencia: Partial<Assistencia>, editor_action?: 'novo estado' | 'edição') {
    return of(assistencia as Assistencia).pipe(

      // send SMS about the assistencia to the client
      concatMap(patchedAssistencia => {
        if (
          (patchedAssistencia.estado !== 'concluído'
            && patchedAssistencia.estado !== 'concluído s/ rep.'
            && patchedAssistencia.estado !== 'orçamento pendente')
          || editor_action === 'edição'
        ) {
          return of({ ...patchedAssistencia, messages: assistencia.messages });
        }
        if (patchedAssistencia.estado === 'concluído' || patchedAssistencia.estado === 'concluído s/ rep.') {
          return this.messagesService.notificarConclusaoDe(patchedAssistencia).pipe(
            map(e => e[0]),
            map((msg: Message) => ({
              ...patchedAssistencia,
              messages: assistencia.messages ? [...assistencia.messages, { id: msg.id }] : [{ id: msg.id }]
            }))
          );
        }
        if (patchedAssistencia.estado === 'orçamento pendente') {
          return this.messagesService.notificarOrcamentoDe(patchedAssistencia).pipe(
            map(e => e[0]),
            map((msg: Message) => ({
              ...patchedAssistencia,
              messages: assistencia.messages ? [...assistencia.messages, { id: msg.id }] : [{ id: msg.id }]
            }))
          );
        }
      }),

      // patch the assistencia
      map(patchedAssistencia => {
        const {
          tecnico_user_id,
          relatorio_interno,
          relatorio_cliente,
          material,
          encomendas,
          messages,
          preco
        } = patchedAssistencia;
        const novoRegisto: EventoCronologico = {
          editor_user_id: this.authService.getUserId(),
          editor_action,
          tecnico_user_id,
          relatorio_interno,
          relatorio_cliente,
          material,
          encomendas,
          messages,
          preco,
          estado: assistencia.estado,
          updatedAt: new Date().toLocaleString()
        };
        const updatedRegistoCronologico: EventoCronologico[] = [
          ...assistencia.registo_cronologico,
          novoRegisto
        ];
        return ({ ...patchedAssistencia, registo_cronologico: updatedRegistoCronologico } as Assistencia);
      }),
      concatMap(patchedAssistencia => super.patch(id, patchedAssistencia))

    );
  }


}
