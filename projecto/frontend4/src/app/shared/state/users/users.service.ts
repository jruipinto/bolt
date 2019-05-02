import { Injectable } from '@angular/core';
import { UsersApiService } from 'src/app/shared/services';
import { AkitaServiceAbstraction } from 'src/app/shared/abstraction-classes';
import { UsersStore } from './users.store';
import { UsersQuery } from './users.query';

@Injectable({ providedIn: 'root' })
export class UsersService extends AkitaServiceAbstraction {

  constructor(
    private usersAPI: UsersApiService,
    private usersStore: UsersStore,
    private usersQuery: UsersQuery) {
      super(usersAPI, usersStore, usersQuery);
    }

}
