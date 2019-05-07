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

const defaultUI: UI = {
    modals: {
        assistenciaModal: {
            visible: false,
            assistenciaID: null,
        },
        artigosCriarNovo: {
            visible: false
        }
    },
    pages: {},
    prints: {
        assistenciaEntradaPrint: {
            visible: false
        },
        assistenciaSaidaPrint: {
            visible: false
        }
    }

}

@Injectable({ providedIn: 'root' })
export class UIService extends UIStateAbstraction {

  constructor() {
      super(defaultUI);
  }

}
