import { Injectable } from '@angular/core';
import { UIStateAbstraction } from 'src/app/shared/abstraction-classes';

export interface UI {
  // modals
  assistenciaModalVisible: boolean;
  assistenciaModalID: number;
  artigoModalVisible: boolean;
  artigoModalID: number;
  // pages
  assistenciasCriarNovaPageContactoClienteForm: {};
  assistenciasCriarNovaPageClienteForm: {};
  assistenciasCriarNovaPageCriarNovaForm: {};
  encomendaPageContactoClienteForm: {};
  encomendaPageClienteForm: {};
  encomendaPageEncomendaForm: {};

  // prints
}

const defaults: UI = {
  // modals
  assistenciaModalVisible: false,
  assistenciaModalID: null,
  artigoModalVisible: false,
  artigoModalID: null,
  // pages
  assistenciasCriarNovaPageContactoClienteForm: {},
  assistenciasCriarNovaPageClienteForm: {},
  assistenciasCriarNovaPageCriarNovaForm: {},
  encomendaPageContactoClienteForm: {},
  encomendaPageClienteForm: {},
  encomendaPageEncomendaForm: {},
  // prints
};

@Injectable({ providedIn: 'root' })
export class UIService extends UIStateAbstraction {

  constructor() {
      super(defaults);
  }

}
