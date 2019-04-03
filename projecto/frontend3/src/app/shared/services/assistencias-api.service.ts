import { EntitiesApiAbstrationService } from '../abstraction-classes';
import { Injectable } from '@angular/core';
import { FeathersService } from '../services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssistenciasApiService extends EntitiesApiAbstrationService {
  // protected entity = 'assistencias'; // the entity to call from API

  private usersAPI = this.feathersService.service('users');
  private insertUserNome = (apiResponse) => {
    apiResponse.data.map(
      assistencia => this.usersAPI.get(assistencia.cliente_user_id)
        .then(apiUser => {
          Object.assign(assistencia, { cliente_user_name: apiUser.nome });
        },
          err => console.log('error:', err)
        )
    );
    return apiResponse.data;
  }

  constructor(protected feathersService: FeathersService) {
    super(feathersService, 'assistencias');
  }

  find(query?: object): Observable<any> {
    const assistencias$ = super.find(query);
    return assistencias$.pipe(
      map(
        apiResponse => this.insertUserNome(apiResponse),
        err => console.log(err)
      )
    );
  }

  get(id: number): Observable<any> {
    const assistencia$ = super.get(id);
    return assistencia$.pipe(
      map(
        apiResponse => this.insertUserNome(apiResponse),
        err => console.log(err)
      )
    );
  }

}
