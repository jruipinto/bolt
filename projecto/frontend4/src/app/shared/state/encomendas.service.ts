import { Injectable } from '@angular/core';
import { EntityStateAbstraction } from 'src/app/shared/abstraction-classes';
import { EncomendasApiService, AuthService, MessagesApiService } from 'src/app/shared/services';
import { Encomenda, EventoCronologico } from 'src/app/shared/models';
import { of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Message } from '../components/chat-widget/models/message.model';

@Injectable({ providedIn: 'root' })
export class EncomendasService extends EntityStateAbstraction {

  constructor(
    protected encomendasAPI: EncomendasApiService,
    private authService: AuthService,
    private messagesService: MessagesApiService) {
    super(encomendasAPI);
  }

  public create(encomenda: Partial<Encomenda>) {
    const registo_cronologico: EventoCronologico[] = [{
      editor_user_id: this.authService.getUserId(),
      editor_action: 'novo estado',
      estado: encomenda.estado,
      updatedAt: new Date().toLocaleString() // dia/mes/ano, hora:minuto:segundo naquele momento
    }];
    return super.create({ ...encomenda, registo_cronologico } as Encomenda);
  }

  public patch(id: number, encomenda: Partial<Encomenda>, editor_action?: 'novo estado' | 'edição') {
    // const novoRegisto: EventoCronologico = {
    //   editor_user_id: this.authService.getUserId(),
    //   editor_action,
    //   estado: encomenda.estado,
    //   updatedAt: new Date().toLocaleString()
    // };
    // const updatedRegistoCronologico: EventoCronologico[] = [
    //   ...encomenda.registo_cronologico,
    //   novoRegisto
    // ];
    // return super.patch(
    //   id,
    //   { ...encomenda, registo_cronologico: updatedRegistoCronologico } as Encomenda
    // );

    return of(encomenda as Encomenda).pipe(

      // send SMS about the encomenda to the client
      concatMap(patchedEncomenda => {
        if (
          (
            patchedEncomenda.estado !== 'adquirida'
            && patchedEncomenda.estado !== 'esgotada'
            && patchedEncomenda.estado !== 'sem fornecedor'
            && patchedEncomenda.estado !== 'recebida'
            && patchedEncomenda.estado !== 'detectado defeito'
          )
          || editor_action === 'edição'
        ) {
          return of({ ...patchedEncomenda, messages: encomenda.messages });
        }
        return this.messagesService.notificarDisponibilidadeDe(patchedEncomenda).pipe(
          map(e => e[0]),
          map((msg: Message) => ({
            ...patchedEncomenda,
            messages: encomenda.messages ? [...encomenda.messages, { id: msg.id }] : [{ id: msg.id }]
          }))
        );
      }),

      // patch the encomenda
      map(patchedEncomenda => {
        const novoRegisto: EventoCronologico = {
          editor_user_id: this.authService.getUserId(),
          editor_action,
          messages: patchedEncomenda.messages,
          estado: encomenda.estado,
          updatedAt: new Date().toLocaleString()
        };
        const updatedRegistoCronologico: EventoCronologico[] = [
          ...encomenda.registo_cronologico,
          novoRegisto
        ];
        return ({ ...encomenda, registo_cronologico: updatedRegistoCronologico } as Encomenda);
      }),
      concatMap(patchedEncomenda => super.patch(id, patchedEncomenda))

    );

  }
}
