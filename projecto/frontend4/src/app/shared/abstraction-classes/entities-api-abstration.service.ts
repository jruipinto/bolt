import { from, Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

import { FeathersService } from 'src/app/shared/services/feathers.service';


export abstract class EntitiesApiAbstrationService {
  private entityAPI = this.feathersService.service(this.entity);
  public entityName = this.entity;

  constructor(protected feathersService: FeathersService, private entity: string) {
  }

  private handleError(error) {
    console.log(error);
    alert('Algo correu mal! Chama o Admin ou CTRL + SHIFT + I');
    return error;
  }

  public find(query?: object) {
    console.log('TCL: EntitiesApiAbstrationService -> publicfind -> query', query);
    const apiResponse$ = from(
      this.entityAPI.find(query)
        .then(
          apiResponse => apiResponse.data,
          this.handleError
        ));
    // console.log(`[${this.entity} API] find ${this.entity}`);
    return apiResponse$ as Observable<any[]>;
  }

  public get(id: number) {
    console.log('TCL: EntitiesApiAbstrationService -> publicget -> id', id);
    const apiResponse$ = from(this.entityAPI.get(id)
      .then(
        apiResponse => [apiResponse],
        this.handleError
      ));
    // console.log(`[${this.entity} API] get ${this.entity} (id:${id})`);
    return apiResponse$ as Observable<any[]>;
  }

  public create(data: object, actionType?: string) {
    console.log('TCL: EntitiesApiAbstrationService -> publiccreate -> data', data);
    const apiResponse$ = from(this.entityAPI.create(data)
      .then(
        apiResponse => [apiResponse],
        this.handleError
      ));
    // console.log(actionType);
    return apiResponse$ as Observable<any[]>;
  }

  public patch(id: number, data: object, actionType?: string) {
    console.log('TCL: EntitiesApiAbstrationService -> publicpatch -> data', data);
    const apiResponse$ = from(this.entityAPI.patch(id, data)
      .then(
        apiResponse => [apiResponse],
        this.handleError
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
