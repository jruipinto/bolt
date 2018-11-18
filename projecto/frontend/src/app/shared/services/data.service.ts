import { Injectable } from '@angular/core';
import { FeathersService } from './feathers.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private feathersService: FeathersService) { }

  find$ (serviceName: string, query?: object) {
    return (<any>this.feathersService
      .service(serviceName)
      .watch()
      .find(query)
      );
  }

  get$ (serviceName: string, id: number) {
    return (<any>this.feathersService
      .service(serviceName)
      .watch()
      .get(id)
      );
  }

  create$ (serviceName: string, data: object) {
    return (<any>this.feathersService
      .service(serviceName))
      .create(data)
      .then(() => console.log('created sucessfully.'))
      .catch(err => console.log('Could not create!'));
  }

  update$ (serviceName: string, data: object, id: number) {
    return (<any>this.feathersService
      .service(serviceName))
      .update(id, data)
      .then(() => console.log('updated sucessfully.'))
      .catch(err => console.log('Could not update!'));
  }

  patch$ (serviceName: string, data: object, id?: number) {
    return (<any>this.feathersService
      .service(serviceName))
      .update(id, data)
      .then(() => console.log('patched sucessfully.'))
      .catch(err => console.log('Could not patch!'));
  }

  remove$ (serviceName: string, query: object, id?: number) {
    return (<any>this.feathersService
      .service(serviceName))
      .remove(id, query)
      .then(() => console.log('removed sucessfully.'))
      .catch(err => console.log('Could not remove!'));
  }

}
