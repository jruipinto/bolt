import { Injectable } from '@angular/core';
import { FeathersService } from './feathers.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private feathersService: FeathersService) { }

  find$ (serviceName: string, query?: object): any {
    return this.feathersService
      .service(serviceName)
      .watch()
      .find(query)
      ;
  }

  get$ (serviceName: string, id: number): any {
    return this.feathersService
      .service(serviceName)
      .watch()
      .get(id)
      ;
  }

  create$ (serviceName: string, data: object): any {
    return this.feathersService
      .service(serviceName)
      .create(data)
      .then(() => {
        console.log('created sucessfully.');
        alert('Sucesso!');
      })
      .catch(err => {
        console.log('Could not create!', err);
        alert('Erro! Não mexas em nada! Chama o Admin!');
      });
  }

  update$ (serviceName: string, data: object, id: number): any {
    return this.feathersService
      .service(serviceName)
      .update(id, data)
      .then(() => {
        console.log('updated sucessfully.');
        alert('Sucesso!');
      })
      .catch(err => {
        console.log('Could not update!', err);
        alert('Erro! Não mexas em nada! Chama o Admin!');
      });
  }

  patch$ (serviceName: string, data: object, id?: number): any {
    return this.feathersService
      .service(serviceName)
      .patch(id, data)
      .then(() => {
        console.log('patched sucessfully.');
        alert('Sucesso!');
      })
      .catch(err => {
        console.log('Could not patch!', err);
        alert('Erro! Não mexas em nada! Chama o Admin!');
      });
  }

  remove$ (serviceName: string, query: object, id?: number): any {
    return this.feathersService
      .service(serviceName)
      .remove(id, query)
      .then(() => {
        console.log('removed sucessfully.');
        alert('Sucesso!');
      })
      .catch(err => {
        console.log('Could not remove!', err);
        alert('Erro! Não mexas em nada! Chama o Admin!');
      });
  }

}
