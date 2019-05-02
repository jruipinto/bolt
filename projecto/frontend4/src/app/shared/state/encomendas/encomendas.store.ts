import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Encomenda } from 'src/app/shared/models/encomenda.model';

export interface EncomendasStateModel extends EntityState<Encomenda> {
}

const initialState = null;

@Injectable({providedIn: 'root'})
@StoreConfig({ name: 'encomendas' })
export class EncomendasStore extends EntityStore<EncomendasStateModel, Encomenda> {

  constructor() {
    super(initialState);
  }

}
