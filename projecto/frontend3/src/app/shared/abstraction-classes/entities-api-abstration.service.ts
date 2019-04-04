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

  protected find(query?: object): Observable<any> {
    console.log(`[${this.entity} API] find ${this.entity}`);
    return from(this.entityAPI.find(query)
      .then(apiResponse => apiResponse,
        err => console.log('error:', err)
      ));
  }
  protected get(id: number): Observable<any> {
    console.log(`[${this.entity} API] get ${this.entity}`);
    return from(this.entityAPI.get(id)
      .then(apiResponse => apiResponse,
        err => console.log('error:', err)
      ));
  }
  protected create(data: object, actionType?: string) {
    console.log(actionType);
  }
  protected patch(id: number, data: object, actionType?: string) {
    console.log(actionType);
  }

  public on(event: string | symbol, listener: (...args: any[]) => void) {
    return this.entityAPI.on(event, listener);
  }

}
