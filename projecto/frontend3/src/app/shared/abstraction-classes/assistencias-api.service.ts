import { EntitiesApiAbstrationService } from './entities-api-abstration.service';
import { Injectable } from '@angular/core';
import { FeathersService } from '../services';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AssistenciasApiService extends EntitiesApiAbstrationService {
    protected entity = "assistencias";

    private usersAPI = this.feathersService.service('users');
    private insertUserNome = (apiResponse) => {
      apiResponse.data.map(assistencia => this.usersAPI.get(assistencia.cliente_user_id)
        .then(apiUser => {
          Object.assign(assistencia, { cliente_user_name: apiUser.nome });
        },
          err => console.log('error:', err)
        )
      );
      return apiResponse.data;
    }

    constructor(protected feathersService: FeathersService) {
        super(feathersService);
    }

    find(query?): Observable<any>{
        const assistencias$ = super.find(query)
        return 
    }

}