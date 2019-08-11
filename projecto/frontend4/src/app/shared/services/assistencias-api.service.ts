import { Injectable } from '@angular/core';
import { Observable, concat, of } from 'rxjs';
import { map, concatMap, toArray, mergeMap, tap } from 'rxjs/operators';

import { EntityApiAbstration } from 'src/app/shared/abstraction-classes';
import { FeathersService } from './feathers.service';
import { UsersService } from '../state/users.service';
import { Assistencia, EventoCronologico, User } from 'src/app/shared/models';
import { lensProp, view, set, clone } from 'ramda';

@Injectable({
  providedIn: 'root'
})
export class AssistenciasApiService extends EntityApiAbstration {
  private usersAPI = this.usersService;

  private sanitize(arr: any[] | null): any[] | null {
    if (!arr) { return arr; }
    return arr.map(item => ({ id: item.id, qty: item.qty }));
  }

  private deserialize<T>(obj: T, objPropName: string) {
    const lens = lensProp(objPropName);
    if (typeof view(lens, obj) === 'string') {
      return set(lens, JSON.parse(view(lens, obj)), obj);
    }
    return obj;
  }

  private fullyDetailedAssistencia$ = (assistenciaFromApi: Assistencia) =>
    this.usersAPI.get(assistenciaFromApi.cliente_user_id)
      .pipe(
        map((res: User[]) => res[0]),
        map(cliente => (
          {
            ...assistenciaFromApi,
            cliente_user_name: cliente.nome,
            cliente_user_contacto: cliente.contacto
          } as Assistencia)
        ),

        map(assistencia => this.deserialize(assistencia, 'registo_cronologico')),
        map(assistencia => this.deserialize(assistencia, 'material')),
        map(assistencia => this.deserialize(assistencia, 'encomendas')),

        concatMap(assistencia =>
          concat(
            ...assistencia.registo_cronologico
              .map(evento =>
                this.usersAPI.get(evento.tecnico_user_id)
                  .pipe(
                    map((user: User[]) => ({ ...evento, tecnico: user[0].nome }) as EventoCronologico)
                  ))
          )),
        toArray(),

        map(detailedRegistoCronologico =>
          ({ ...assistenciaFromApi, registo_cronologico: detailedRegistoCronologico }) as Assistencia),

        map(assistencia => {
          const registo = clone(assistencia.registo_cronologico);
          const registoFiltered = registo.filter(
            evento =>
              evento.estado === 'em análise' ||
              evento.estado === 'contacto pendente' ||
              evento.estado === 'orçamento pendente' ||
              evento.estado === 'aguarda material' ||
              evento.estado === 'concluído'
          );
          const lastEvento = registoFiltered ? registoFiltered[registoFiltered.length - 1] : null;
          const tecnico = lastEvento ? lastEvento.tecnico : null;
          return ({ ...assistencia, tecnico } as Assistencia);
        })
      )

  constructor(
    protected feathersService: FeathersService,
    private usersService: UsersService) {
    super(feathersService, 'assistencias');
  }


  find(query?: object) {
    const assistencias$ = super.find(query)
      .pipe(
        concatMap(assistencias =>
          concat(...assistencias.map(this.fullyDetailedAssistencia$))),
        toArray()
      );
    return assistencias$;
  }

  get(id: number) {
    const assistencia$ = super.get(id)
      .pipe(
        map(assistencias => assistencias[0]),
        mergeMap(this.fullyDetailedAssistencia$),
        map(assistencia => [assistencia])
      );
    return assistencia$;
  }

  create(data: Assistencia, actionType?: string) {
    const assistencia$ = super.create({
      ...data,
      material: this.sanitize(data.material),
      encomendas: this.sanitize(data.encomendas)
    })
      .pipe(
        map(assistencias => assistencias[0]),
        mergeMap(this.fullyDetailedAssistencia$),
        map(assistencia => [assistencia])
      );
    return assistencia$;
  }

  patch(id: number, data: Assistencia, actionType?: string) {
    const assistencia$ = super.patch(id, {
      ...data,
      material: this.sanitize(data.material),
      encomendas: this.sanitize(data.encomendas)
    })
      .pipe(
        map(assistencias => assistencias[0]),
        mergeMap(this.fullyDetailedAssistencia$),
        map(assistencia => [assistencia])
      );
    return assistencia$;
  }

  onCreated() {
    const assistencia$ = super.onCreated()
      .pipe(
        map(assistencias => assistencias[0]),
        mergeMap(this.fullyDetailedAssistencia$),
        map(assistencia => [assistencia])
      );
    return assistencia$;
  }

  onPatched() {
    const assistencia$ = super.onPatched()
      .pipe(
        map(assistencias => assistencias[0]),
        mergeMap(this.fullyDetailedAssistencia$),
        map(assistencia => [assistencia])
      );
    return assistencia$;
  }
}
