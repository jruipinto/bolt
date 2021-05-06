import { AfterViewInit, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { clone } from 'ramda';
import { concatMap, map } from 'rxjs/operators';
import { Artigo, Assistencia, Encomenda } from 'src/app/shared';
import { AssistenciasService } from 'src/app/shared/state';

@AutoUnsubscribe()
@Injectable({
  providedIn: 'root',
})
export class AssistenciaPageService implements AfterViewInit, OnDestroy {
  assistenciaDraft: Assistencia = null;
  assistenciaOriginal: Assistencia = null;
  newEncomendasCounter = 0;
  isLoading = true;

  constructor(
    private assistencias: AssistenciasService,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.route.paramMap
      .pipe(
        concatMap((routeParams) =>
          this.assistencias.get(+routeParams.get('id'))
        ),
        map((res) => res[0])
      )
      .subscribe((assistencia: Assistencia) => {
        if (!this.assistenciaDraft) {
          this.assistenciaDraft = clone(assistencia);
        }
        this.assistenciaOriginal = clone(assistencia);
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {}

  updateEncomendas(encomenda: Encomenda) {
    if (encomenda.qty < 1) {
      this.assistenciaDraft.encomendas = this.assistenciaDraft.encomendas
        .filter(({ estado }) => estado === 'nova') // only let to clean 'nova' encomendas
        .filter(({ id }) => id !== encomenda.id);
    }
    this.newEncomendasCounter = this.assistenciaDraft.encomendas.filter(
      ({ estado }) => estado === 'nova'
    ).length;
  }

  updateMaterial(artigo: Artigo): void {
    if (artigo.qty < 1) {
      this.assistenciaDraft.material = this.assistenciaDraft.material.filter(
        ({ id }) => id !== artigo.id
      );
    }
  }
}
