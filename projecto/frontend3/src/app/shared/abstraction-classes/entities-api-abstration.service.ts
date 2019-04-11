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

  public find(query?: object) {
    const apiResponse$ = from(
      this.entityAPI.find(query)
        .then(apiResponse => apiResponse.data,
          err => console.log('error:', err)
        ));
    // console.log(`[${this.entity} API] find ${this.entity}`);
    return apiResponse$ as Observable<any[]>;
  }

  public get(id: number) {
    const apiResponse$ = from(this.entityAPI.get(id)
      .then(apiResponse => [apiResponse],
        err => console.log('error:', err)
      ));
    // console.log(`[${this.entity} API] get ${this.entity} (id:${id})`);
    return apiResponse$ as Observable<any[]>;
  }

  public create(data: object, actionType?: string) {
    const apiResponse$ = from(this.entityAPI.create(data)
      .then(apiResponse => [apiResponse],
        err => console.log('error:', err)
      ));
    // console.log(actionType);
    return apiResponse$;
  }

  public patch(id: number, data: object, actionType?: string) {
    const apiResponse$ = from(this.entityAPI.patch(id, data)
      .then(apiResponse => [apiResponse],
        err => console.log('error:', err)
      ));
    // console.log(actionType);
    return apiResponse$;
  }

  public onCreated() {
    const apiResponse$ = new Observable(
      observer => {
        this.entityAPI.on('created', createdObject => observer.next([createdObject]));
      }
    );
    return apiResponse$ as Observable<any[]>;
  }

  public onPatched() {
    const apiResponse$ = new Observable(
      observer => {
        this.entityAPI.on('patched', createdObject => observer.next([createdObject]));
      }
    );
    return apiResponse$ as Observable<any[]>;
  }

  /*
  public on(event: string | symbol, listener: (...args: any[]) => void) {
    return this.entityAPI.on(event, listener);
  }
  */

}
