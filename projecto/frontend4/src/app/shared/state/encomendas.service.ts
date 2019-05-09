import { Injectable } from '@angular/core';
import { EncomendasApiService } from 'src/app/shared/services';
import { EntityStateAbstraction } from 'src/app/shared/abstraction-classes';

@Injectable({ providedIn: 'root' })
export class EncomendasService extends EntityStateAbstraction {

  constructor(protected encomendasAPI: EncomendasApiService) {
      super(encomendasAPI);
    }

}
