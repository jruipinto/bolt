import { from, Observable, fromEvent} from 'rxjs';
import {  map } from 'rxjs/operators';

import { FeathersService } from 'src/app/shared/services/feathers.service';
import { reject } from 'q';


export abstract class EntitiesApiAbstrationService {
  private entityAPI = this.feathersService.service(this.entity);

  constructor(protected feathersService: FeathersService, private entity: string) {
  }

  public find(query?: object) {
    console.log('TCL: EntitiesApiAbstrationService -> publicfind -> query', query);
    const apiResponse$ = from(
      this.entityAPI.find(query)
        .then(apiResponse => apiResponse.data,
          err => console.log('error:', err)
        ));
    // console.log(`[${this.entity} API] find ${this.entity}`);
    return apiResponse$ as Observable<any[]>;
  }

  public get(id: number) {
    console.log('TCL: EntitiesApiAbstrationService -> publicget -> id', id);
    const apiResponse$ = from(this.entityAPI.get(id)
      .then(apiResponse => [apiResponse],
        err => console.log('error:', err)
      ));
    // console.log(`[${this.entity} API] get ${this.entity} (id:${id})`);
    return apiResponse$ as Observable<any[]>;
  }

  public create(data: object, actionType?: string) {
    console.log('TCL: EntitiesApiAbstrationService -> publiccreate -> data', data);
    const apiResponse$ = from(this.entityAPI.create(data)
      .then(apiResponse => [apiResponse],
        err => console.log('error:', err)
      ));
    // console.log(actionType);
    return apiResponse$ as Observable<any[]>;
  }

  public patch(id: number, data: object, actionType?: string) {
    console.log('TCL: EntitiesApiAbstrationService -> publicpatch -> data', data);
    const apiResponse$ = from(this.entityAPI.patch(id, data)
      .then(apiResponse => [apiResponse],
        err => console.log('error:', err)
      ));
    // console.log(actionType);
    return apiResponse$ as Observable<any[]>;
  }

  public onCreated() {
    const apiResponse$ = fromEvent(this.entityAPI, 'created');
    return apiResponse$.pipe(
      map(apiResponse => [apiResponse as any])
      );
  }

  public onPatched() {
    const apiResponse$ = fromEvent(this.entityAPI, 'patched');
    return apiResponse$.pipe(
      map(apiResponse => [apiResponse as any])
      );
  }

  /*
  public on(event: string | symbol, listener: (...args: any[]) => void) {
    return this.entityAPI.on(event, listener);
  }
  */

}
