import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { FeathersService } from 'src/app/shared/services/feathers.service';


@Injectable({
  providedIn: 'root'
})
export abstract class EntitiesApiAbstrationService {
  private entityAPI = this.feathersService.service(this.entity);

  constructor(protected feathersService: FeathersService, private entity: string) {
  }

  protected find(query?: object) {
    console.log(`[${this.entity} API] find ${this.entity}`);
    return from(this.entityAPI.find(query)
      .then(apiResponse => apiResponse.data,
        err => console.log('error:', err)
      ));
  }
  protected get(id: number) {
    console.log(`[${this.entity} API] get ${this.entity}`);
    return from(this.entityAPI.get(id)
      .then(apiResponse => [apiResponse],
        err => console.log('error:', err)
      ));
  }
  public create(data: object, actionType?: string) {
    console.log(actionType);
    return from(this.entityAPI.create(data)
      .then(apiResponse => [apiResponse],
        err => console.log('error:', err)
      ));
  }
  public patch(id: number, data: object, actionType?: string) {
    console.log(actionType);
    return from(this.entityAPI.patch(id, data)
      .then(apiResponse => [apiResponse],
        err => console.log('error:', err)
      ));
  }

  public on(event: string | symbol, listener: (...args: any[]) => void) {
    return this.entityAPI.on(event, listener);
  }

}
