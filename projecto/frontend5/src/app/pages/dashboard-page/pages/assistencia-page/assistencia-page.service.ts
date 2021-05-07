import { AfterViewInit, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { clone } from 'ramda';
import { BehaviorSubject, Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { Artigo, Assistencia, Encomenda } from 'src/app/shared';
import { AssistenciasService } from 'src/app/shared/state';

interface AssistenciaPageState {
  assistenciaDraft: Assistencia;
  assistenciaOriginal: Assistencia;
  newEncomendasCounter: number;
  isLoading: boolean;
}

@AutoUnsubscribe()
@Injectable({
  providedIn: 'root',
})
export class AssistenciaPageService implements AfterViewInit, OnDestroy {
  stateSource = new BehaviorSubject<AssistenciaPageState>({
    assistenciaDraft: null,
    assistenciaOriginal: null,
    newEncomendasCounter: 0,
    isLoading: true,
  });

  constructor(
    private assistencias: AssistenciasService,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.route.paramMap
      .pipe(
        concatMap((routeParams) => {
          return this.assistencias
            .get(+routeParams.get('id'))
            .pipe(map(([assistencia]) => assistencia));
        }),
        concatMap((assistencia) => {
          return this.getState().pipe(
            map((state) => {
              let newState: AssistenciaPageState;
              if (!state.assistenciaDraft) {
                newState.assistenciaDraft = clone(assistencia);
              }
              newState.assistenciaOriginal = clone(assistencia);
              newState.isLoading = false;
              return newState;
            })
          );
        })
      )
      .subscribe(this.patchState);
  }

  ngOnDestroy(): void {}

  getState(): Observable<AssistenciaPageState> {
    return this.stateSource.asObservable().pipe(
      take(1),
      map((state) => clone(state))
    );
  }
  observeState(): Observable<AssistenciaPageState> {
    return this.stateSource.asObservable().pipe(map((state) => clone(state)));
  }
  patchState(patch: Partial<AssistenciaPageState>): void {
    this.getState().subscribe((state) => {
      this.stateSource.next({ ...clone(state), ...patch });
    });
  }

  updateEncomendas(encomenda: Encomenda) {
    this.getState()
      .pipe(
        map((state) => {
          let newState: AssistenciaPageState;
          if (encomenda.qty < 1) {
            newState.assistenciaDraft.encomendas = state.assistenciaDraft.encomendas
              .filter(({ estado }) => estado === 'nova') // only let to clean 'nova' encomendas
              .filter(({ id }) => id !== encomenda.id);
          }
          newState.newEncomendasCounter = state.assistenciaDraft.encomendas.filter(
            ({ estado }) => estado === 'nova'
          ).length;

          return newState;
        })
      )
      .subscribe(this.patchState);
  }

  updateMaterial(artigo: Artigo): void {
    this.getState()
      .pipe(
        map((state) => {
          let newState: AssistenciaPageState;
          if (artigo.qty < 1) {
            newState.assistenciaDraft.material = state.assistenciaDraft.material.filter(
              ({ id }) => id !== artigo.id
            );
          }

          return newState;
        })
      )
      .subscribe(this.patchState);
  }
}
