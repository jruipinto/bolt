import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { EncomendasStore, EncomendasStateModel } from './encomendas.store';
import { Encomenda } from 'src/app/shared/models';

@Injectable({providedIn: 'root'})
export class EncomendasQuery extends QueryEntity<EncomendasStateModel, Encomenda> {

  constructor(protected store: EncomendasStore) {
    super(store);
  }

}
