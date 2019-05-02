import { Injectable } from '@angular/core';
import { EncomendasApiService } from 'src/app/shared/services';
import { AkitaServiceAbstraction } from 'src/app/shared/abstraction-classes';
import { EncomendasStore } from './encomendas.store';
import { EncomendasQuery } from './encomendas.query';

@Injectable({ providedIn: 'root' })
export class EncomendasService extends AkitaServiceAbstraction {

  constructor(
    private encomendasAPI: EncomendasApiService,
    private encomendasStore: EncomendasStore,
    private encomendasQuery: EncomendasQuery) {
      super(encomendasAPI, encomendasStore, encomendasQuery);
    }

}
