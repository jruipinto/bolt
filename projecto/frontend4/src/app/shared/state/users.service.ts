import { Injectable } from '@angular/core';
import { UsersApiService } from 'src/app/shared/services';
import { EntityStateAbstraction } from 'src/app/shared/abstraction-classes';

@Injectable({ providedIn: 'root' })
export class UsersService extends EntityStateAbstraction {

  constructor(protected usersAPI: UsersApiService) {
      super(usersAPI);
    }

}
