import { Injectable } from '@angular/core';
import { AssistenciasApiService } from 'src/app/shared/services';
import { AkitaServiceAbstraction } from 'src/app/shared/abstraction-classes';
import { AssistenciasStore } from './assistencias.store';
import { AssistenciasQuery } from './assistencias.query';

@Injectable({ providedIn: 'root' })
export class AssistenciasService extends AkitaServiceAbstraction {

  constructor(
    private assistenciasAPI: AssistenciasApiService,
    private assistenciasStore: AssistenciasStore,
    private assistenciasQuery: AssistenciasQuery) {
      super(assistenciasAPI, assistenciasStore, assistenciasQuery);
    }

}
