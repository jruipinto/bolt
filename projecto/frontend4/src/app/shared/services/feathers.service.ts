import { Injectable } from '@angular/core';

import * as feathersRx from 'feathers-reactive';
import * as io from 'socket.io-client';

import feathers from '@feathersjs/feathers';
import feathersSocketIOClient from '@feathersjs/socketio-client';
import feathersAuthClient from '@feathersjs/authentication-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeathersService {
  private _feathers = feathers();                     // init socket.io
  private _socket = io(environment.apiURL);      // init feathers

  constructor() {
    this._feathers
      .configure(feathersSocketIOClient(this._socket))  // add socket.io plugin
      .configure(feathersAuthClient({                   // add authentication plugin
        storage: window.localStorage
      }))
      .configure(feathersRx({                           // add feathers-reactive plugin
        idField: '_id'
      }));
  }

  // expose services
  public service(name: string) {
    return this._feathers.service(name);
  }

  // expose authentication
  public authenticate(credentials?): Promise<any> {
    this._socket.on('disconnect', (reason) => {
      window.location.reload();
    });
    this._socket.on('reconnect', (reason) => {
      window.location.reload();
    });
    this._socket.on('error', (reason) => {
      window.location.reload();
    });
    return this._feathers.authenticate(credentials);
  }

  // expose logout
  public logout() {
    return this._feathers.logout();
  }
}
