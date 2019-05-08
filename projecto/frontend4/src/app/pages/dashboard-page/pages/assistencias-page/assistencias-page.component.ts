import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { map, tap, first } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AssistenciaModalGetAssistencia } from '../../modals/assistencia-modal';
import { AssistenciasService } from 'src/app/shared/rstate/assistencias.service';
import { UIService, UI } from 'src/app/shared/rstate/ui.service';

@Component({
  selector: 'app-assistencias-page',
  templateUrl: './assistencias-page.component.html',
  styleUrls: ['./assistencias-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistenciasPageComponent implements OnInit {

  constructor(
    private store: Store,
    private assistencias: AssistenciasService,
    private uiService: UIService) {
  }

  public assistencias$ = this.assistencias.state$
    .pipe(
      map(state =>
        state
          ? state.filter(assistencia =>
            assistencia.estado === 'em análise' || assistencia.estado === 'recebido')
          : null
      )
    );

  ngOnInit() {
    // this.store.dispatch(new AssistenciasPageFindAssistencias());
    this.assistencias
      .findAndWatch({ query: { $limit: 200, estado: { $ne: 'entregue' } } })
      .subscribe();
  }

  openModal(id: number): void {
    // this.store.dispatch(new AssistenciaModalGetAssistencia(id));
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
