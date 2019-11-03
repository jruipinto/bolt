import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UIStateAbstraction } from 'src/app/shared/abstraction-classes';
import { Artigo } from '../models';

export interface UI {
  // modals
  assistenciaModalVisible: boolean;
  assistenciaModalID: number;
  artigoModalVisible: boolean;
  artigoModalID: number;
  encomendaPromptModalVisible: boolean;
  encomendaPromptModalArtigo: Artigo | {};
  // pages
  assistenciasCriarNovaPageContactoClienteForm: {};
  assistenciasCriarNovaPageClienteForm: {};
  assistenciasCriarNovaPageCriarNovaForm: {};
  assistenciasPesquisarPageAssistenciasSearchForm: {};
  encomendaPageContactoClienteForm: {};
  encomendaPageClienteForm: {};
  encomendaPageArtigoForm: {};
  encomendaPageEncomendaForm: {};
  encomendasPesquisarPageEncomendasSearchForm: {};
  stockPageArtigoSearchForm: {};
  stockPageArtigoSearch$: Observable<Artigo[]>;

  // prints
}

const defaults: UI = {
  // modals
  assistenciaModalVisible: false,
  assistenciaModalID: null,
  artigoModalVisible: false,
  artigoModalID: null,
  encomendaPromptModalVisible: false,
  encomendaPromptModalArtigo: {},
  // pages
  assistenciasCriarNovaPageContactoClienteForm: {},
  assistenciasCriarNovaPageClienteForm: {},
  assistenciasCriarNovaPageCriarNovaForm: {},
  assistenciasPesquisarPageAssistenciasSearchForm: {},
  encomendaPageContactoClienteForm: {},
  encomendaPageClienteForm: {},
  encomendaPageArtigoForm: {},
  encomendaPageEncomendaForm: {},
  encomendasPesquisarPageEncomendasSearchForm: {},
  stockPageArtigoSearchForm: {},
  stockPageArtigoSearch$: null
  // prints
};

@Injectable({ providedIn: 'root' })
export class UIService extends UIStateAbstraction {

  constructor() {
      super(defaults);
  }

}
