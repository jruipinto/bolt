import { Component, OnInit } from '@angular/core';
import { map, concatMap, tap } from 'rxjs/operators';

import { Assistencia } from 'src/app/shared/models';
import { PrintService } from 'src/app/pages/dashboard-page/prints/print.service';
import { UIService, UI } from 'src/app/shared/rstate/ui.service';
import { AssistenciasService } from 'src/app/shared/rstate/assistencias.service';


@Component({
  selector: 'app-assistencia-modal',
  templateUrl: './assistencia-modal.component.html',
  styleUrls: ['./assistencia-modal.component.scss']
})
export class AssistenciaModalComponent implements OnInit {

  constructor(
    private printService: PrintService,
    private uiService: UIService,
    private assistencias: AssistenciasService) {
  }

  public assistencia$ = this.uiService.state$
    .pipe(
      concatMap((uiState: UI) => this.assistencias.state$
        .pipe(
          map((assistencias: Assistencia[]) => assistencias[uiState.modals.assistenciaModal.assistenciaID])
        ))
    );

  ngOnInit() {
    this.uiService.state$
      .pipe(
        concatMap((uiState: UI) => this.assistencias.get(uiState.modals.assistenciaModal.assistenciaID))
      )
      .subscribe();
  }

  closeModal(modalIsOpen: boolean) {
    if (modalIsOpen) {
      // this.store.dispatch(new AssistenciaModalClose());
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
                    ...{ visible: false }
                  }
                }
              }
            )
          )
        )
        .subscribe();
    }
  }

  saveModal(newEstado: string, assistencia: Assistencia) {
    if (newEstado === 'entregue' && assistencia.estado !== 'concluído') {
      alert('Primeiro tens de concluir a assistencia!');
    } else {
      this.assistencias.patch(assistencia.id, { ...assistencia, estado: newEstado })
        .subscribe(() => {
          if (newEstado === 'entregue') { this.printService.printAssistenciaSaida(assistencia); }
        });
    }
  }

}
