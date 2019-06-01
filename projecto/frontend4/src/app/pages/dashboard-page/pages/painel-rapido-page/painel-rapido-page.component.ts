import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, first } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Encomenda, Assistencia } from 'src/app/shared/models';
import { UI, UIService, AssistenciasService } from 'src/app/shared/state';


@AutoUnsubscribe()
@Component({
  selector: 'app-painel-rapido-page',
  templateUrl: './painel-rapido-page.component.html',
  styleUrls: ['./painel-rapido-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PainelRapidoPageComponent implements OnInit, OnDestroy {

  constructor(
    private assistencias: AssistenciasService,
    private uiService: UIService) { }

  public encomendas$: Observable<Encomenda[]>;
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
            assistencia.estado === 'contacto pendente' ||
            assistencia.estado === 'não atendeu p/ cont.' ||
            assistencia.estado === 'cliente adiou resp.')
          : null
      )
    );

  ngOnInit() {
    this.assistencias
      .findAndWatch()
      .subscribe();
  }

  ngOnDestroy() { }

  openAssistencia(id: number): void {
    this.uiService.state$
      .pipe(
        first(),
        tap((uiState: UI) =>
          this.uiService.source.next({ ...uiState, ...{ assistenciaModalID: id, assistenciaModalVisible: true } })
        )
      )
      .subscribe();
  }

  saveAssist(newEstado: string, assistencia: Assistencia) {
    return this.assistencias.patch(assistencia.id, { ...assistencia, estado: newEstado })
      .subscribe();
  }
}
