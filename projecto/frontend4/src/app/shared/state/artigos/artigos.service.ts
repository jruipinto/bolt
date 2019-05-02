import { Injectable } from '@angular/core';
import { ArtigosApiService } from 'src/app/shared/services';
import { AkitaServiceAbstraction } from 'src/app/shared/abstraction-classes';
import { ArtigosStore } from './artigos.store';
import { ArtigosQuery } from './artigos.query';

@Injectable({ providedIn: 'root' })
export class ArtigosService extends AkitaServiceAbstraction {

  constructor(
    private artigosAPI: ArtigosApiService,
    private artigosStore: ArtigosStore,
    private artigosQuery: ArtigosQuery) {
      super(artigosAPI, artigosStore, artigosQuery);
    }

}
