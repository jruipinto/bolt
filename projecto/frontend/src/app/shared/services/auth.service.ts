import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FeathersService } from './feathers.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private feathersService: FeathersService, private router: Router) { }

  isAuthenticated(): Observable<boolean> | boolean {
    return true;
  }

  public logIn(credentials?): Promise<any> {
    return this.feathersService.authenticate(credentials);
  }

  public logOut() {
    this.feathersService.logout();
    this.router.navigate(['/']);
  }
}
