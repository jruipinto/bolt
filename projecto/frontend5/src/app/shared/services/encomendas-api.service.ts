import { Injectable } from '@angular/core';
import { Observable, concat, of } from 'rxjs';
import { map, concatMap, toArray } from 'rxjs/operators';

import { EntityApiAbstration } from 'src/app/shared/abstraction-classes';
import { FeathersService } from 'src/app/shared/services/feathers.service';
import { EventoCronologico, User, Encomenda, Artigo } from 'src/app/shared/models';
import { UsersService } from 'src/app/shared/state/users.service';
import { ArtigosService } from 'src/app/shared/state/artigos.service';
import { deserialize } from 'src/app/shared/utilities';

@Injectable({
  providedIn: 'root'
})
export class EncomendasApiService extends EntityApiAbstration {
  private usersAPI = this.usersService;


  /**
   * Observable that mutates the encomendasApi's stream
   * deserializing its JSON props and fecthing the props
   * from the their respective entities on API
   */
  private fullyDetailedEncomendas$ = (encomendasFromApi$: Observable<Encomenda[]>) =>
    encomendasFromApi$.pipe(
      concatMap(encomendasFromApi => (
        concat(...encomendasFromApi.map(encomendaFromApi => (
          this.usersAPI.get(encomendaFromApi.cliente_user_id).pipe(

            // retrieve client data
            map((res: User[]) => res[0]),
            map((cliente): Encomenda => ({
              ...encomendaFromApi,
              cliente_user_name: cliente.nome,
              cliente_user_contacto: cliente.contacto
            })),

            // retrieve artigo data
            concatMap((encomenda: Encomenda) => this.artigosService.get(encomenda.artigo_id).pipe(
              map((res: Artigo[]) => res[0]),
              map((artigo: Artigo): Encomenda => ({
                ...encomenda,
                artigo_marca: artigo.marca,
                artigo_modelo: artigo.modelo,
                artigo_descricao: artigo.descricao
              })
              )
            )),

            // deserialize JSON props
            map(encomenda => deserialize(encomenda, 'registo_cronologico')),
            map(encomenda => deserialize(encomenda, 'messages')),

            // retrieve tecnico data for all eventos of registo_cronologico
            concatMap(encomenda => (
              concat(...encomenda.registo_cronologico.map(evento => {
                if (evento.tecnico_user_id) {
                  return this.usersAPI.get(evento.tecnico_user_id).pipe(
                    map((user: User[]): EventoCronologico => ({ ...evento, tecnico: user[0].nome }))
                  );
                }
                return of(evento);

              })).pipe(
                toArray(),
                map((registo_cronologico): Encomenda => ({ ...encomenda, registo_cronologico }))
              )
            )),

            // retrieve editor data for all eventos of registo_cronologico
            concatMap(encomenda => (
              concat(...encomenda.registo_cronologico.map(evento => {
                if (evento.editor_user_id) { // check because of backwards compatibility
                  return this.usersAPI.get(evento.editor_user_id).pipe(
                    map((user: User[]): EventoCronologico => ({ ...evento, editor: user[0].nome }))
                  );
                }
                return of(evento);

              })).pipe(
                toArray(),
                map((registo_cronologico): Encomenda => ({ ...encomenda, registo_cronologico }))
              )
            ))
          )
        )))
      )),
      toArray()
    )

  constructor(
    protected feathersService: FeathersService,
    private usersService: UsersService,
    private artigosService: ArtigosService) {
    super(feathersService, 'encomendas');
  }


  find(query?: object) {
    return this.fullyDetailedEncomendas$(
      super.find(query)
    );
  }

  get(id: number) {
    return this.fullyDetailedEncomendas$(
      super.get(id)
    );
  }

  create(data: object, actionType?: string) {
    return this.fullyDetailedEncomendas$(
      super.create(data)
    );
  }

  patch(id: number, data: object, actionType?: string) {
    return this.fullyDetailedEncomendas$(
      super.patch(id, data)
    );
  }

  onCreated() {
    return this.fullyDetailedEncomendas$(
      super.onCreated()
    );
  }

  onPatched() {
    return this.fullyDetailedEncomendas$(
      super.onPatched()
    );
  }
}
