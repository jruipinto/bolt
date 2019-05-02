import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ArtigosStore, ArtigosStateModel } from './artigos.store';
import { Artigo } from 'src/app/shared/models';

@Injectable({providedIn: 'root'})
export class ArtigosQuery extends QueryEntity<ArtigosStateModel, Artigo> {

  constructor(protected store: ArtigosStore) {
    super(store);
  }

}
