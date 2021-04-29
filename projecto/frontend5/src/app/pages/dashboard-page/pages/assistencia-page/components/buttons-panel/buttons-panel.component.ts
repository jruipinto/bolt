import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { clone, uniqBy } from 'ramda';
import { concat, Observable, of } from 'rxjs';
import { concatMap, map, tap, toArray } from 'rxjs/operators';
import { PrintService } from 'src/app/pages/dashboard-page/prints';
import { Artigo, Assistencia, AuthService, Encomenda } from 'src/app/shared';
import {
  ArtigosService,
  AssistenciasService,
  EncomendasService,
  UIService,
} from 'src/app/shared/state';

@Component({
  selector: 'app-buttons-panel',
  templateUrl: './buttons-panel.component.html',
  styleUrls: ['./buttons-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonsPanelComponent {
  @Input() assistencia: Assistencia;
  newEncomendasCounter = 0;
  assistenciaOnInit: Assistencia;

  constructor(
    private assistencias: AssistenciasService,
    private artigos: ArtigosService,
    private encomendas: EncomendasService,
    private authService: AuthService,
    private printService: PrintService,
    private router: Router,
    private uiService: UIService
  ) {}

  createAssistenciaWithThisData(assistencia: Assistencia): void {
    this.uiService
      .patchState({
        // modals
        // pages
        assistenciasCriarNovaPageContactoClienteForm: {
          contacto: assistencia.cliente_user_contacto,
        },
        assistenciasCriarNovaPageCriarNovaForm: {
          ...assistencia,
          problema: `(Ficha anterior: ${assistencia.id}) `,
          orcamento: null,
        },
        // prints
      })
      .subscribe(() => {
        this.router.navigate(['/dashboard/assistencias-criar-nova']);
      });
  }

  saveAssistencia(newEstado: Assistencia['estado'], arg: Assistencia): void {
    const assistencia = clone(arg);
    const assistenciaOnInit = clone(this.assistenciaOnInit);
    const editor_action =
      newEstado === assistenciaOnInit.estado ? 'edição' : 'novo estado';
    if (
      newEstado !== 'em análise' &&
      newEstado !== 'recebido' &&
      !assistencia.relatorio_cliente
    ) {
      return alert('Preencha o relatório para o cliente!');
    }
    if (newEstado === 'orçamento pendente' && !assistencia.preco) {
      return alert('Para orçamentar assistência o preço não pode ser 0€!');
    }
    // If assistencia.estado is subject of change &&
    // is going to be one of these,
    // then assign the authenticated user to assistencia.tecnico_user_id
    if (
      newEstado !== assistenciaOnInit.estado &&
      (newEstado === 'em análise' ||
        newEstado === 'contacto pendente' ||
        newEstado === 'orçamento pendente' ||
        newEstado === 'aguarda material' ||
        newEstado === 'concluído' ||
        newEstado === 'concluído s/ rep.')
    ) {
      assistencia.tecnico_user_id = this.authService.getUserId();
    }

    of(null)
      .pipe(
        // calculates the mutations provoked by assistencia.material  and submits them to artigosApi
        concatMap(() => {
          if (
            (!assistenciaOnInit.material ||
              !assistenciaOnInit.material.length) &&
            (!assistencia.material || !assistencia.material.length)
          ) {
            return of(null);
          }
          const materialMutation = () => {
            if (assistenciaOnInit.material) {
              return uniqBy(({ id }) => id, [
                ...assistenciaOnInit.material.map((artigoOnInit) => {
                  const currentArtigo = assistencia.material.filter(
                    ({ id }) => artigoOnInit.id === id
                  )[0];
                  if (currentArtigo) {
                    return {
                      ...artigoOnInit,
                      qty: artigoOnInit.qty - currentArtigo.qty,
                    };
                  }
                  return artigoOnInit;
                }),
                ...assistencia.material.map((e) => ({ ...e, qty: -e.qty })),
              ]);
            }
            return assistencia.material.map((e) => ({ ...e, qty: -e.qty }));
          };
          return concat(
            ...materialMutation().map((artigoMutation: Artigo) =>
              this.artigos.get(artigoMutation.id).pipe(
                map((res: Artigo[]) => res[0]),
                concatMap((artigoOnDB) =>
                  this.artigos.patch(artigoOnDB.id, {
                    qty: artigoOnDB.qty + artigoMutation.qty,
                  })
                )
              )
            )
          ).pipe(toArray());
        }),

        // create encomendas (wich estado === 'nova') on encomendasApi
        concatMap(
          (): Observable<Partial<Encomenda>[]> => {
            if (!assistencia.encomendas || !assistencia.encomendas.length) {
              return of(null);
            }
            return concat(
              ...assistencia.encomendas
                .filter(({ estado }) => estado === 'nova')
                .map((encomenda) =>
                  this.encomendas
                    .create({ ...encomenda, estado: 'registada' })
                    .pipe(
                      map((encomendaDB: Encomenda[]) => encomendaDB[0]),
                      map((encomendaDB) => {
                        const {
                          cliente_user_name,
                          cliente_user_contacto,
                          artigo_marca,
                          artigo_modelo,
                          artigo_descricao,
                          createdAt,
                          updatedAt,
                          registo_cronologico,
                          ...encomendaMod
                        } = encomendaDB;
                        return encomendaMod;
                      })
                    )
                )
            ).pipe(
              toArray(),
              map((encomendasMod): Partial<Encomenda>[] =>
                uniqBy(({ id }) => id, [
                  ...encomendasMod,
                  ...assistencia.encomendas,
                ])
              ),
              map((encomendas) => encomendas.filter(({ id }) => id))
            );
          }
        ),

        // submit assistencia to assistenciasApi, print paper and return to last page
        concatMap((encomendas) =>
          this.assistencias.patch(
            assistencia.id,
            {
              ...assistencia,
              estado: newEstado,
              material: assistencia.material,
              encomendas,
            },
            editor_action
          )
        ),
        tap(() =>
          newEstado === 'entregue'
            ? this.printService.printAssistenciaSaida(assistencia)
            : null
        ),
        tap(() => window.history.back())
      )
      .subscribe();
  }

  print(arg: Assistencia) {
    const assistencia = clone(arg);
    if (assistencia.estado === 'entregue') {
      return this.printService.printAssistenciaSaida(assistencia);
    }
    return this.printService.printAssistenciaEntrada(assistencia);
  }
}
