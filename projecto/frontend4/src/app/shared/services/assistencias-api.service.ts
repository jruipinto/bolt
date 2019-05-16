import { Injectable } from '@angular/core';
import { Observable, concat } from 'rxjs';
import { map, concatMap, toArray, mergeMap } from 'rxjs/operators';

import { EntitiesApiAbstrationService } from 'src/app/shared/abstraction-classes';
import { FeathersService } from './feathers.service';
import { Assistencia } from 'src/app/shared/models';
import { UsersService } from '../state/users.service';

@Injectable({
  providedIn: 'root'
})
export class AssistenciasApiService extends EntitiesApiAbstrationService {
  private usersAPI = this.usersService;
  /*private insertUserNome = assistencia => this.usersAPI.get(assistencia.cliente_user_id)
    .pipe(
      map(apiUser => {
        if (typeof assistencia.registo_cronologico === 'string') {
          return assistencia = {
            ...assistencia,
            cliente_user_name: apiUser[0].nome,
            cliente_user_contacto: apiUser[0].contacto,
            registo_cronologico: JSON.parse(assistencia.registo_cronologico)
          } as any;
        } else {
          return assistencia = {
            ...assistencia,
            cliente_user_name: apiUser[0].nome,
            cliente_user_contacto: apiUser[0].contacto
          } as any;
        }
      })
    )*/
  private insertUserNome = assistencia => this.usersAPI.get(assistencia.cliente_user_id)
    .pipe(
      map(apiUser => assistencia = {
        ...assistencia,
        cliente_user_name: apiUser[0].nome,
        cliente_user_contacto: apiUser[0].contacto
      }),
      map( assistenciaMapped => typeof assistenciaMapped.registo_cronologico === 'string'
      ? {...assistenciaMapped, registo_cronologico: JSON.parse(assistenciaMapped.registo_cronologico)}
      : assistenciaMapped)
    )
  private transform = (assistencias$: Observable<Assistencia[]>) => assistencias$
    .pipe(
      concatMap((assistencias: Assistencia[]) => concat(...assistencias.map(this.insertUserNome))),
      toArray()
    ) as Observable<Assistencia[]>

  constructor(protected feathersService: FeathersService, private usersService: UsersService) {
    super(feathersService, 'assistencias');
  }

  find(query?: object) {
    const assistencias$ = super.find(query);
    return this.transform(assistencias$);
  }

  get(id: number) {
    const assistencia$ = super.get(id);
    return this.transform(assistencia$);
  }

  create(data: object, actionType?: string) {
    const assistencia$ = super.create(data);
    return this.transform(assistencia$);
  }

  patch(id: number, data: object, actionType?: string) {
    const assistencia$ = super.patch(id, data);
    return this.transform(assistencia$);
  }

  onCreated() {
    const assistencia$ = super.onCreated().pipe(
      map(assistencias => assistencias[0]),
      mergeMap(this.insertUserNome),
      map(assistencia => [assistencia]))
      ;
    return assistencia$;
  }

  onPatched() {
    const assistencia$ = super.onPatched().pipe(
      map(assistencias => assistencias[0]),
      mergeMap(this.insertUserNome),
      map(assistencia => [assistencia])
    );
    return assistencia$;
  }

}
