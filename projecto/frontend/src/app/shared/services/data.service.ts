import { Injectable } from '@angular/core';
import { FeathersService } from './feathers.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private feathersService: FeathersService) { }

  find$ (serviceName: string) {
    return (<any>this.feathersService
      .service(serviceName)
      .watch()
      .find()
      );
  }

  create$ (serviceName: string, serviceProperties: object) {
    return (<any>this.feathersService
      .service(serviceName))
      .create(serviceProperties)
      .then(() => console.log('created sucessfully.'))
      .catch(err => console.log('Could not create!'));
  }

}
