import { Injectable } from '@angular/core';
import { ArtigosApiService } from 'src/app/shared/services';
import { EntityStateAbstraction } from 'src/app/shared/abstraction-classes';

@Injectable({ providedIn: 'root' })
export class ArtigosService extends EntityStateAbstraction {

  constructor(protected artigosAPI: ArtigosApiService) {
      super(artigosAPI);
    }

}
