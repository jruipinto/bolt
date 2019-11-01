import { Injectable } from '@angular/core';
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
  encomendaPageContactoClienteForm: {};
  encomendaPageClienteForm: {};
  encomendaPageArtigoForm: {};
  encomendaPageEncomendaForm: {};
  stockPageArtigoSearchForm: {};

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
  encomendaPageContactoClienteForm: {},
  encomendaPageClienteForm: {},
  encomendaPageArtigoForm: {},
  encomendaPageEncomendaForm: {},
  stockPageArtigoSearchForm: {}
  // prints
};

@Injectable({ providedIn: 'root' })
export class UIService extends UIStateAbstraction {

  constructor() {
      super(defaults);
  }

}
