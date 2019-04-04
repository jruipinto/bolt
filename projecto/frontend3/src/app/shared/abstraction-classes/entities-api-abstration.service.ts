import { Injectable } from '@angular/core';
import { FeathersService } from '../services';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntitiesApiAbstrationService {
  protected entity: string | null = null;
  private entityAPI = this.feathersService.service(this.entity);

  constructor(protected feathersService: FeathersService) { }

  find(query?: object): Observable<any> {
    console.log(`[${this.entity} API] find ${this.entity}`);
    return from(this.entityAPI.find(query)
      .then(apiResponse => { return apiResponse },
        err => console.log('error:', err)
      ));
  }
  protected get(id: number): Observable<any> {
    console.log(`[${this.entity} API] get ${this.entity}`);
    return from(this.entityAPI.get(id)
      .then(apiResponse => { return apiResponse },
        err => console.log('error:', err)
      ));
  }
  protected create(data: object, actionType?: string) {
    console.log(actionType);
  }
  protected patch(id: number, data: object, actionType?: string) {
    console.log(actionType);
  }
}
