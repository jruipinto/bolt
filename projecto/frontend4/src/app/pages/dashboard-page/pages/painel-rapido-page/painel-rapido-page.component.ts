import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Encomenda, Assistencia } from 'src/app/shared/models';
import { AssistenciasService, EncomendasService } from 'src/app/shared/state';


@AutoUnsubscribe()
@Component({
  selector: 'app-painel-rapido-page',
  templateUrl: './painel-rapido-page.component.html',
  styleUrls: ['./painel-rapido-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PainelRapidoPageComponent implements OnInit, OnDestroy {
  public loadingEncomendas = true;
  public loadingAssistencias = true;

  constructor(
    private assistencias: AssistenciasService,
    private encomendas: EncomendasService,
    private router: Router) { }

  public encomendas$: Observable<Encomenda[]> = this.encomendas.state$
    .pipe(
      map(
        (encomendas: Encomenda[]) =>
          encomendas
            ? encomendas.filter(encomenda =>
              encomenda.estado === 'registada'
              || encomenda.estado === 'esgotada'
              || encomenda.estado === 'detectado defeito'
              || encomenda.estado === 'aguarda resposta de fornecedor')
            : null
      )
    );
  public orcamentos$: Observable<Partial<Assistencia[]>> = this.assistencias.state$
    .pipe(
      map(state =>
        state
          ? state.filter(assistencia =>
            assistencia.estado === 'orçamento pendente'
            || assistencia.estado === 'não atendeu p/ orç.'
            || assistencia.estado === 'cliente adiou orç.')
          : null
      )
    );
  public pedidosContactoCliente$: Observable<Partial<Assistencia[]>> = this.assistencias.state$
    .pipe(
      map(state =>
        state
          ? state.filter(assistencia =>
            assistencia.estado === 'contacto pendente'
            || assistencia.estado === 'não atendeu p/ cont.'
            || assistencia.estado === 'cliente adiou resp.')
          : null
      )
    );

  ngOnInit() {
    this.assistencias
      .find({
        query: {
          $limit: 200, estado: {
            $in: [
              'orçamento pendente',
              'não atendeu p/ orç.',
              'cliente adiou orç.',
              'contacto pendente',
              'não atendeu p/ cont.',
              'cliente adiou resp.'
            ]
          }
        }
      })
      .subscribe(() => this.loadingAssistencias = false);
    this.encomendas
      .find({
        query: {
          $limit: 200, estado: {
            $in: [
              'registada',
              'esgotada',
              'detectado defeito',
              'aguarda resposta de fornecedor'
            ]
          }
        }
      })
      .subscribe(() => this.loadingEncomendas = false);
  }

  ngOnDestroy() { }

  openAssistencia(id: number) {
    return this.router.navigate(['/dashboard/assistencia', id]);
  }

  saveAssist(newEstado: string, assistencia: Assistencia) {
    return this.assistencias.patch(assistencia.id, { ...assistencia, estado: newEstado })
      .subscribe();
  }

  openEncomenda(id: number) {
    return this.router.navigate(['/dashboard/encomenda', id]);
  }

  saveEncomenda(newEstado: string, encomenda: Encomenda) {
    return this.encomendas.patch(encomenda.id, { ...encomenda, estado: newEstado })
      .subscribe();
  }
}
