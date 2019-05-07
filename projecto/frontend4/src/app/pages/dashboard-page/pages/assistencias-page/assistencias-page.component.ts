import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { map, tap } from 'rxjs/operators';
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
    this.uiService.state$
      .pipe(
        tap((uiState: UI) =>
          this.uiService.source.next(
            {
              ...uiState,
              ...{
                ...uiState.modals,
                ...{
                  ...uiState.modals.assistenciaModal,
                  ...{
                    visible: true,
                    assistenciaID: id
                  }
                }
              }
            }
          )
        )
      )
      .subscribe();

  }

}
