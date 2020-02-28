import { from, Observable, fromEvent } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { FeathersService } from 'src/app/shared/services/feathers.service';


export abstract class EntityApiAbstration {
  private entityAPI = this.feathersService.service(this.entity);
  public entityName = this.entity;

  constructor(
    protected feathersService: FeathersService,
    private entity: string) {
  }

  private handleError = (entityName: String, data: any) => (error) => {
    console.error(`${entityName}Api -> handleError -> error`, error);
    console.log(`${entityName}Api -> handleError -> debugData:`, data);
    switch (error.code) {
      case 401:
        alert('Não está autorizado! (Pode verificar o seu login)');
        break;
      case 404:
        alert(`\"${data}\" não encontrado. (Verifique se escreveu correctamente)`);
        break;

      default:
        alert('Erro desconhecido. Chame o Admin ou CTRL + SHIFT + I');
        break;
    }
    // if (error.code === 401) {
    //   alert('Não está autorizado!');
    // } else {
    //   alert('Algo correu mal! Chame o Admin ou CTRL + SHIFT + I');
    // }
    throw error;
  }

  public find(query?: object) {
    console.log(`[${this.entityName}Api] find query:`, query);
    const apiResponse$ = from(
      this.entityAPI.find(query)
        .then(apiResponse => apiResponse.data)
        .catch(this.handleError(this.entityName, query))
    );
    return apiResponse$ as Observable<any[]>;
  }

  public get(id: number) {
    console.log(`[${this.entityName}Api] get id:`, id);
    const apiResponse$ = from(this.entityAPI.get(id)
      .then(apiResponse => [apiResponse])
      .catch(this.handleError(this.entityName, id))
    );
    return apiResponse$ as Observable<any[]>;
  }

  public create(data: object, actionType?: string) {
    console.log(`[${this.entityName}Api] create data:`, data);
    const apiResponse$ = from(this.entityAPI.create(data)
      .then(apiResponse => [apiResponse])
      .catch(this.handleError(this.entityName, data))
    );
    return apiResponse$ as Observable<any[]>;
  }

  public patch(id: number, data: object, actionType?: string) {
    console.log(`[${this.entityName}Api] patch id: ${id}, data:`, data);
    const apiResponse$ = from(this.entityAPI.patch(id, data)
      .then(apiResponse => [apiResponse])
      .catch(this.handleError(this.entityName, { id, data }))
    );
    return apiResponse$ as Observable<any[]>;
  }

  public onCreated() {
    const apiResponse$ = fromEvent(this.entityAPI, 'created');
    return apiResponse$
      .pipe(
        map(apiResponse => [apiResponse as any]),
        tap(receivedData => console.log(`[${this.entityName}Api] onCreated receivedData:`, receivedData))
      );
  }

  public onPatched() {
    const apiResponse$ = fromEvent(this.entityAPI, 'patched');
    return apiResponse$
      .pipe(
        map(apiResponse => [apiResponse as any]),
        tap(receivedData => console.log(`[${this.entityName}Api] onPatched receivedData:`, receivedData))
      );
  }

  /*
  public on(event: string | symbol, listener: (...args: any[]) => void) {
    return this.entityAPI.on(event, listener);
  }
  */

}
