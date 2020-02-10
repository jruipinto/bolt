import { Injectable } from '@angular/core';
import { concat, of, Observable } from 'rxjs';
import { map, concatMap, toArray } from 'rxjs/operators';

import { EntityApiAbstration } from 'src/app/shared/abstraction-classes';
import { FeathersService } from './feathers.service';
import { UsersService } from '../state/users.service';
import { Assistencia, EventoCronologico, User } from 'src/app/shared/models';
import { clone } from 'ramda';
import { deserialize } from 'src/app/shared/utilities';

@Injectable({
  providedIn: 'root'
})
export class AssistenciasApiService extends EntityApiAbstration {
  private usersAPI = this.usersService;

  /**
   * Returns an array containg only "id" and "qty" props in its objects
   *
   * [{id, qty}, {id, qty}, ...]
   */
  private simplify(arr: any[] | null): any[] | null {
    if (!arr) { return arr; }
    return arr.map(item => (item.qty ? { id: item.id, qty: item.qty } : { id: item.id }));
  }

  /**
   * Observable that mutates the assistenciasApi's stream
   * deserializing its JSON props and fecthing the props
   * from the their respective entities on API
   */
  private fullyDetailedAssistencias$ = (assistenciasFromApi$: Observable<Assistencia[]>) =>
    assistenciasFromApi$.pipe(
      concatMap((assistenciasFromApi: Assistencia[]) => (
        concat(...assistenciasFromApi.map(
          (assistenciaFromApi) => (this.usersAPI.get(assistenciaFromApi.cliente_user_id).pipe(

            // retrieve client data
            map((res: User[]) => res[0]),
            map((cliente): Assistencia => ({
              ...assistenciaFromApi,
              cliente_user_name: cliente.nome,
              cliente_user_contacto: cliente.contacto
            })),

            // deserialize JSON props
            map(assistencia => deserialize(assistencia, 'registo_cronologico')),
            map(assistencia => deserialize(assistencia, 'material')),
            map(assistencia => deserialize(assistencia, 'encomendas')),
            map(assistencia => deserialize(assistencia, 'messages')),

            // retrieve tecnico data for all eventos of registo_cronologico
            concatMap(assistencia => (
              concat(...assistencia.registo_cronologico.map(evento => {
                if (evento.tecnico_user_id) {
                  return this.usersAPI.get(evento.tecnico_user_id).pipe(
                    map((user: User[]): EventoCronologico => ({ ...evento, tecnico: user[0].nome }))
                  );
                }
                return of(evento);

              })).pipe(
                toArray(),
                map((registo_cronologico): Assistencia => ({ ...assistencia, registo_cronologico }))
              )
            )),

            // retrieve editor data for all eventos of registo_cronologico
            concatMap(assistencia => (
              concat(...assistencia.registo_cronologico.map(evento => {
                if (evento.editor_user_id) { // check because of backwards compatibility
                  return this.usersAPI.get(evento.editor_user_id).pipe(
                    map((user: User[]): EventoCronologico => ({ ...evento, editor: user[0].nome }))
                  );
                }
                return of(evento);

              })).pipe(
                toArray(),
                map((registo_cronologico): Assistencia => ({ ...assistencia, registo_cronologico }))
              )
            )),

            // get assistencia.tecnico from api or from the last evento on assistencia.registo_cronologico (backwards compatibility)
            concatMap((assistencia): Observable<Assistencia> => {
              if (assistencia.tecnico_user_id) {
                return this.usersAPI.get(assistencia.tecnico_user_id).pipe(
                  map((res: User[]) => ({ ...assistencia, tecnico: res[0].nome }))
                );
              }

              const registoCronologico = clone(assistencia.registo_cronologico);
              const registoFiltered = registoCronologico
                .filter(evento => (
                  evento.estado === 'em análise' ||
                  evento.estado === 'contacto pendente' ||
                  evento.estado === 'orçamento pendente' ||
                  evento.estado === 'aguarda material' ||
                  evento.estado === 'concluído' ||
                  evento.estado === 'concluído s/ rep.'
                ))
                .filter(evento => evento.tecnico);
              const lastEvento = registoFiltered ? registoFiltered[registoFiltered.length - 1] : null;
              const tecnico = lastEvento ? lastEvento.tecnico : null;

              return of({ ...assistencia, tecnico });
            })
          ))
        )).pipe(toArray())
      ))
    )
  constructor(
    protected feathersService: FeathersService,
    private usersService: UsersService) {
    super(feathersService, 'assistencias');
  }


  find(query?: object) {
    return this.fullyDetailedAssistencias$(
      super.find(query)
    );
  }

  get(id: number) {
    return this.fullyDetailedAssistencias$(
      super.get(id)
    );
  }

  create(data: Assistencia, actionType?: string) {
    return this.fullyDetailedAssistencias$(
      super.create({
        ...data,
        material: this.simplify(data.material),
        encomendas: this.simplify(data.encomendas),
        messages: this.simplify(data.messages)
      })
    );
  }

  patch(id: number, data: Assistencia, actionType?: string) {
    return this.fullyDetailedAssistencias$(
      super.patch(
        id,
        {
          ...data,
          material: this.simplify(data.material),
          encomendas: this.simplify(data.encomendas),
          messages: this.simplify(data.messages)
        }
      )
    );
  }

  onCreated() {
    return this.fullyDetailedAssistencias$(
      super.onCreated()
    );
  }

  onPatched() {
    return this.fullyDetailedAssistencias$(
      super.onCreated()
    );
  }
}
