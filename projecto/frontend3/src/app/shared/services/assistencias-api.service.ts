import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, concatMap } from 'rxjs/operators';

import { EntitiesApiAbstrationService } from 'src/app/shared/abstraction-classes';
import { FeathersService } from './feathers.service';
import { Assistencia } from 'src/app/shared/models';
import { UsersApiService } from './users-api.service';

@Injectable({
  providedIn: 'root'
})
export class AssistenciasApiService extends EntitiesApiAbstrationService {
  private usersAPI = this.usersApiService;
  private insertUserNomes = (assistencias) => {
    assistencias.map(assistencia => this.usersAPI.get(assistencia.cliente_user_id)
      .pipe(
        map(apiUser => {
          const modAssistencia = {
            ...assistencia,
            ...{ cliente_user_name: apiUser[0].nome, cliente_user_contacto: apiUser[0].contacto }
          };
          return modAssistencia;
        }
        )
      )
    );
    return assistencias as Assistencia[];
  }

  constructor(protected feathersService: FeathersService, private usersApiService: UsersApiService) {
    super(feathersService, 'assistencias');
  }

  find(query?: object) {
    const assistencias$ = super.find(query);
    return assistencias$.pipe(
      concatMap(
        apiResponse => this.insertUserNomes(apiResponse)
      )
    );
  }

  get(id: number) {
    const assistencia$ = super.get(id);
    return assistencia$.pipe(
      map(
        apiResponse => this.insertUserNomes(apiResponse)
      )
    );
  }

  onCreated() {
    const assistencia$ = super.onCreated();
    return assistencia$.pipe(
      map(
        apiResponse => this.insertUserNomes(apiResponse)
      )
    );
  }

  onPatched() {
    const assistencia$ = super.onPatched();
    return assistencia$.pipe(
      map(
        apiResponse => this.insertUserNomes(apiResponse)
      )
    );
  }

}
