import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { map, tap, first } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { UIService, UI, AssistenciasService } from 'src/app/shared/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencias-page',
  templateUrl: './assistencias-page.component.html',
  styleUrls: ['./assistencias-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistenciasPageComponent implements OnInit, OnDestroy {

  constructor(
    private assistencias: AssistenciasService,
    private uiService: UIService) {
  }

  public assistencias$ = this.assistencias.state$
    .pipe(
      map(state =>
        state
          ? state.filter(assistencia =>
            assistencia.estado === 'recebido'
            || assistencia.estado === 'em análise'
            || assistencia.estado === 'contactado'
            || assistencia.estado === 'incontactável'
            || assistencia.estado === 'orçamento aprovado'
            || assistencia.estado === 'orçamento recusado'
            || assistencia.estado === 'material recebido')
          : null
      )
    );

  ngOnInit() {
    this.assistencias
      .findAndWatch({ query: { $limit: 200, estado: { $ne: 'entregue' } } })
      .subscribe();
  }

  ngOnDestroy() { }

  openModal(id: number): void {
    this.uiService.state$
      .pipe(
        first(),
        tap((uiState: UI) =>
          this.uiService.source.next({ ...uiState, ...{ assistenciaModalID: id, assistenciaModalVisible: true } })
        )
      )
      .subscribe();
  }

}
