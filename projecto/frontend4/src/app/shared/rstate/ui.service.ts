import { Injectable } from '@angular/core';
import { UIStateAbstraction } from 'src/app/shared/abstraction-classes';

export interface UI {
    modals: {
        assistenciaModal: {
            visible: boolean;
            assistenciaID: number;
        }
        artigosCriarNovo: {
            visible: boolean;
        }
    };
    pages: {};
    prints: {
        assistenciaEntradaPrint: {
            visible: boolean;
        }
        assistenciaSaidaPrint: {
            visible: boolean;
        }
    };

}

@Injectable({ providedIn: 'root' })
export class UIService extends UIStateAbstraction {

  constructor() {
      super();
  }

}
