import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Artigo } from 'src/app/shared/models/artigo.model';

export interface ArtigosStateModel extends EntityState<Artigo> {
}

const initialState = null;

@Injectable({providedIn: 'root'})
@StoreConfig({ name: 'artigos' })
export class ArtigosStore extends EntityStore<ArtigosStateModel, Artigo> {

  constructor() {
    super(initialState);
  }

}
