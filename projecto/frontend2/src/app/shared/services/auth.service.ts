import { Injectable } from '@angular/core';

import { FeathersService } from './feathers.service';
import { DataService } from './data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(dataService: DataService, private feathersService: FeathersService, private router: Router ) { }

  public getUserId (): number {
    const decode = require('jwt-decode');
    // Retrieve the token from wherever you've stored it.
    const jwt = window.localStorage.getItem('feathers-jwt');
    const payload = decode(jwt);
    return payload.userId;
  }

  public getUserName$ (): any {
    const id = this.getUserId();
    return (<any>this.feathersService.service('users').watch().get(id));
  }

  public logIn(credentials?): Promise<any> {
    return this.feathersService.authenticate(credentials);
  }

  public logOut() {
    this.feathersService.logout();
    this.router.navigate(['/login']);
  }
}
