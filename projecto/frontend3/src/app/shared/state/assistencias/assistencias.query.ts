import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AssistenciasStore, AssistenciasStateModel } from './assistencias.store';
import { Assistencia } from 'src/app/shared/models';

@Injectable({providedIn: 'root'})
export class AssistenciasQuery extends QueryEntity<AssistenciasStateModel, Assistencia> {

  constructor(protected store: AssistenciasStore) {
    super(store);
  }

}
