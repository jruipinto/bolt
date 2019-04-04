import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EntitiesApiAbstrationService } from 'src/app/shared/abstraction-classes';
import { FeathersService } from './feathers.service';
import { Assistencia } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class AssistenciasApiService extends EntitiesApiAbstrationService {
  private usersAPI = this.feathersService.service('users');
  private insertUserNome = (apiResponse) => {
    apiResponse.map(assistencia => this.usersAPI.get(assistencia.cliente_user_id)
      .then(apiUser => {
        Object.assign(assistencia, { cliente_user_name: apiUser.nome });
      },
        err => console.log('error:', err)
      )
    );
    return apiResponse;
  }

  constructor(protected feathersService: FeathersService) {
    super(feathersService, 'assistencias');
  }

  find(query?: object) {
    const assistencias$ = super.find(query);
    return assistencias$.pipe(
      map(
        apiResponse => this.insertUserNome(apiResponse),
        err => console.log('error:', err)
      )
    );
  }

  get(id: number) {
    const assistencia$ = super.get(id);
    return assistencia$.pipe(
      map(
        apiResponse => this.insertUserNome(apiResponse),
        err => console.log('error:', err)
      )
    );
  }

}
