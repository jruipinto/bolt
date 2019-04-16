import { Injectable } from '@angular/core';

import { FeathersService } from './feathers.service';
import { Router } from '@angular/router';
import { UsersApiService } from './users-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private feathersService: FeathersService, private usersApiService: UsersApiService, private router: Router ) { }

  public getUserId (): number {
    const decode = require('jwt-decode');
    // Retrieve the token from wherever you've stored it.
    const jwt = window.localStorage.getItem('feathers-jwt');
    const payload = decode(jwt);
    return payload.userId;
  }

  public getUserName$ () {
    const id = this.getUserId();
    return this.usersApiService.get(id);
  }

  public logIn(credentials?): Promise<any> {
    return this.feathersService.authenticate(credentials);
  }

  public logOut() {
    this.feathersService.logout();
    this.router.navigate(['/login']);
  }
}
