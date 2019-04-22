import { Injectable } from '@angular/core';
import { Observable, concat } from 'rxjs';
import { map, concatMap, toArray, tap, mergeMap } from 'rxjs/operators';

import { EntitiesApiAbstrationService } from 'src/app/shared/abstraction-classes';
import { FeathersService } from './feathers.service';
import { Assistencia } from 'src/app/shared/models';
import { UsersApiService } from './users-api.service';

@Injectable({
  providedIn: 'root'
})
export class AssistenciasApiService extends EntitiesApiAbstrationService {
  private usersAPI = this.usersApiService;
  private insertUserNome = assistencia => this.usersAPI.get(assistencia.cliente_user_id).pipe(
    map(apiUser =>
      assistencia = {
        ...assistencia,
        ...{ cliente_user_name: apiUser[0].nome, cliente_user_contacto: apiUser[0].contacto }
      } as any
    )
  )
  private insertUserNomes = (assistencias: Assistencia[]) =>
    concat(...assistencias.map(this.insertUserNome))
  private transform = (assistencias$: Observable<Assistencia[]>) => assistencias$.pipe(
    concatMap(this.insertUserNomes),
    toArray()
  ) as Observable<Assistencia[]>

  constructor(protected feathersService: FeathersService, private usersApiService: UsersApiService) {
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

  onCreated() {
    const assistencia$ = super.onCreated();
    return this.transform(assistencia$);
  }

  onPatched() {
    const assistencia$ = super.onPatched();
    return assistencia$.pipe(
      map(assistencias => assistencias[0]),
      mergeMap(this.insertUserNome),
      map(assistencia => [assistencia])
    );
  }

}
