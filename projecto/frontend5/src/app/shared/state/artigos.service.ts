import { Injectable } from '@angular/core';
import { EntityStateAbstraction } from 'src/app/shared/abstraction-classes';
import { ArtigosApiService } from 'src/app/shared/services/artigos-api.service';

@Injectable({ providedIn: 'root' })
export class ArtigosService extends EntityStateAbstraction {

  constructor(protected artigosAPI: ArtigosApiService) {
    super(artigosAPI);
  }

}
