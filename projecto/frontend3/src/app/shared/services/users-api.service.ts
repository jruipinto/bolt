import { Injectable } from '@angular/core';

import { EntitiesApiAbstrationService } from 'src/app/shared/abstraction-classes';
import { FeathersService } from './feathers.service';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService extends EntitiesApiAbstrationService {

  constructor(protected feathersService: FeathersService) {
    super(feathersService, 'users');
  }

}
