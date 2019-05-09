import { Injectable } from '@angular/core';
import { UIStateAbstraction } from 'src/app/shared/abstraction-classes';

export interface UI {
  // modals
  assistenciaModalVisible: boolean;
  assistenciaModalID: number;
  // pages
  assistenciasCriarNovaPageContactoClienteForm: {};
  assistenciasCriarNovaPageClienteForm: {};
  assistenciasCriarNovaPageCriarNovaForm: {};

  // prints
}

const defaults: UI = {
  // modals
  assistenciaModalVisible: false,
  assistenciaModalID: null,
  // pages
  assistenciasCriarNovaPageContactoClienteForm: {},
  assistenciasCriarNovaPageClienteForm: {},
  assistenciasCriarNovaPageCriarNovaForm: {},
  // prints
};

@Injectable({ providedIn: 'root' })
export class UIService extends UIStateAbstraction {

  constructor() {
      super(defaults);
  }

}
