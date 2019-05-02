import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { User } from 'src/app/shared/models/user.model';

export interface UsersStateModel extends EntityState<User> {
}

const initialState = null;

@Injectable({providedIn: 'root'})
@StoreConfig({ name: 'users' })
export class UsersStore extends EntityStore<UsersStateModel, User> {

  constructor() {
    super(initialState);
  }

}
