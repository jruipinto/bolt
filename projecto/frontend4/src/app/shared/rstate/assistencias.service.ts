import { Injectable } from '@angular/core';
import { AssistenciasApiService } from 'src/app/shared/services';
import { EntityStateAbstraction } from 'src/app/shared/abstraction-classes';

@Injectable({ providedIn: 'root' })
export class AssistenciasService extends EntityStateAbstraction {

  constructor(
    private assistenciasAPI: AssistenciasApiService) {
      super(assistenciasAPI);
    }

}
