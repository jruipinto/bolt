import { Injectable } from '@angular/core';
import { EntityStateAbstraction } from 'src/app/shared/abstraction-classes';
import { UsersApiService } from 'src/app/shared/services/users-api.service';

@Injectable({ providedIn: 'root' })
export class UsersService extends EntityStateAbstraction {

  constructor(protected usersAPI: UsersApiService) {
    super(usersAPI);
  }

}
