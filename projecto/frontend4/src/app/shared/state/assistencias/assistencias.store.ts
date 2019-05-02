import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Assistencia } from 'src/app/shared/models/assistencia.model';

export interface AssistenciasStateModel extends EntityState<Assistencia> {
}

const initialState = null;

@Injectable({providedIn: 'root'})
@StoreConfig({ name: 'Assistencias' })
export class AssistenciasStore extends EntityStore<AssistenciasStateModel, Assistencia> {

  constructor() {
    super(initialState);
  }

}
