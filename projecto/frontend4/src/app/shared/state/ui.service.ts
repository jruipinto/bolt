import { Injectable } from '@angular/core';
import { UIStateAbstraction } from 'src/app/shared/abstraction-classes';

export interface UI {
  // modals
  assistenciaModalVisible: boolean;
  assistenciaModalID: number;
  artigoModalVisible: boolean;
  artigoModalID: number;
  encomendaPromptModalVisible: boolean;
  // pages
  assistenciasCriarNovaPageContactoClienteForm: {};
  assistenciasCriarNovaPageClienteForm: {};
  assistenciasCriarNovaPageCriarNovaForm: {};
  encomendaPageContactoClienteForm: {};
  encomendaPageClienteForm: {};
  encomendaPageArtigoForm: {};
  encomendaPageEncomendaForm: {};

  // prints
}

const defaults: UI = {
  // modals
  assistenciaModalVisible: false,
  assistenciaModalID: null,
  artigoModalVisible: false,
  artigoModalID: null,
  encomendaPromptModalVisible: false,
  // pages
  assistenciasCriarNovaPageContactoClienteForm: {},
  assistenciasCriarNovaPageClienteForm: {},
  assistenciasCriarNovaPageCriarNovaForm: {},
  encomendaPageContactoClienteForm: {},
  encomendaPageClienteForm: {},
  encomendaPageArtigoForm: {},
  encomendaPageEncomendaForm: {},
  // prints
};

@Injectable({ providedIn: 'root' })
export class UIService extends UIStateAbstraction {

  constructor() {
      super(defaults);
  }

}
