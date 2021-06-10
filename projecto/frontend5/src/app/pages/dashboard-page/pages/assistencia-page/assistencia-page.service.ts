import { Injectable } from '@angular/core';
import {
  Artigo,
  Assistencia,
  createComponentState,
  Encomenda,
} from 'src/app/shared';

interface AssistenciaPageState {
  assistenciaDraft: Assistencia;
  assistenciaOriginal: Assistencia;
  newEncomendasCounter: number;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AssistenciaPageService {
  /**
   * Object with methods to get and modify the page's state
   */
  state = createComponentState({
    assistenciaDraft: null,
    assistenciaOriginal: null,
    newEncomendasCounter: 0,
    isLoading: true,
  } as AssistenciaPageState);

  constructor() {}

  /**
   * Update `assistenciaDraft.encomendas` and `newEncomendasCounter` accordingly.
   * ___
   * (see AssistenciaPageState model for any doubts)
   */
  updateEncomendas(encomenda: Encomenda) {
    this.state.patch((draftState) => {
      if (encomenda.qty < 1) {
        draftState.assistenciaDraft.encomendas =
          draftState.assistenciaDraft.encomendas
            .filter(({ estado }) => estado === 'nova') // only let to clean 'nova' encomendas
            .filter(({ id }) => id !== encomenda.id);
      }
      const { encomendas } = draftState.assistenciaDraft;
      draftState.newEncomendasCounter = encomendas.filter(
        ({ estado }) => estado === 'nova'
      ).length;
      draftState.assistenciaDraft.encomendas = encomendas.map((i) => {
        return i.artigo_id === encomenda.artigo_id ? encomenda : i;
      });
    });
  }

  /**
   * Update `assistenciaDraft.material`
   * ___
   * (see AssistenciaPageState model for any doubts)
   */
  updateMaterial(artigo: Artigo): void {
    this.state.patch((draftState) => {
      if (artigo.qty < 1) {
        draftState.assistenciaDraft.material =
          draftState.assistenciaDraft.material.filter(
            ({ id }) => id !== artigo.id
          );
        return;
      }
      const { material } = draftState.assistenciaDraft;
      draftState.assistenciaDraft.material = material.map((i) => {
        return i.id === artigo.id ? artigo : i;
      });
    });
  }
}
