import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UsersStore, UsersStateModel } from './Users.store';
import { User } from 'src/app/shared/models';

@Injectable({providedIn: 'root'})
export class UsersQuery extends QueryEntity<UsersStateModel, User> {

  constructor(protected store: UsersStore) {
    super(store);
  }

}
