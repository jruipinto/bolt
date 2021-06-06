import { Injectable } from '@angular/core';
import { clone } from 'ramda';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Artigo, Assistencia, Encomenda } from 'src/app/shared';
import produce from 'immer';
import { WritableDraft } from 'immer/dist/internal';

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
  private stateSource = new BehaviorSubject<AssistenciaPageState>({
    assistenciaDraft: null,
    assistenciaOriginal: null,
    newEncomendasCounter: 0,
    isLoading: true,
  });

  state = {
    /**
     * Observes state (first emission only)
     */
    observeOne: () => {
      return this.stateSource.asObservable().pipe(
        take(1),
        map((state) => clone(state))
      );
    },
    /**
     * Observes state
     */
    observe: () => {
      return this.stateSource.asObservable().pipe(map((state) => clone(state)));
    },

    /**
     * Patchs state by executing patchCallback on state
     * (the old state isn't changed. Immutability is assured by immerjs)
     */
    patch: (
      patchCallback: (draftState: WritableDraft<AssistenciaPageState>) => void
    ) => {
      this.state.observeOne().subscribe((state) => {
        const nextState = produce(state, patchCallback);
        this.stateSource.next(nextState);
      });
    },
  };

  constructor() {}

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
