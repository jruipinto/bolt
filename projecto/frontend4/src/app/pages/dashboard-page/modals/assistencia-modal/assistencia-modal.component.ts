import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, concatMap, tap, first } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { Assistencia } from 'src/app/shared/models';
import { PrintService } from 'src/app/pages/dashboard-page/prints/print.service';
import { UIService, UI } from 'src/app/shared/state/ui.service';
import { AssistenciasService } from 'src/app/shared/state';


@AutoUnsubscribe()
@Component({
  selector: 'app-assistencia-modal',
  templateUrl: './assistencia-modal.component.html',
  styleUrls: ['./assistencia-modal.component.scss']
})
export class AssistenciaModalComponent implements OnInit, OnDestroy {

  constructor(
    private printService: PrintService,
    private uiService: UIService,
    private assistencias: AssistenciasService) {
  }

  public assistencia$ = this.uiService.state$
    .pipe(
      concatMap((uiState: UI) => this.assistencias.state$
        .pipe(
          map((assistencias: Assistencia[]) =>
            assistencias.filter((assistencia: Assistencia) =>
              assistencia.id === uiState.assistenciaModalID)
          ),
          map((assistencias: Assistencia[]) => assistencias[0])
        ))
    );

  ngOnInit() {
    this.uiService.state$
      .pipe(
        concatMap((uiState: UI) => this.assistencias.get(uiState.assistenciaModalID))
      )
      .subscribe();
  }

  ngOnDestroy() { }

  closeModal(modalIsOpen: boolean) {
    if (modalIsOpen) {
      this.uiService.state$
        .pipe(
          first(),
          tap((uiState: UI) =>
            this.uiService.source.next({ ...uiState, assistenciaModalVisible: false })
          )
        )
        .subscribe();
    }
  }

  saveModal(newEstado: string, assistencia: Assistencia) {
    if (newEstado === 'entregue' && assistencia.estado !== 'concluído') {
      return alert('Primeiro tens de concluir a assistencia!');
    } else {
      return this.assistencias.patch(assistencia.id, { ...assistencia, estado: newEstado })
        .pipe(
          concatMap(() =>
            this.uiService.state$
              .pipe(
                first(),
                tap((uiState: UI) => this.uiService.source.next({ ...uiState, assistenciaModalVisible: false }))
              )
          ),
          tap(() => {
            if (newEstado === 'entregue') { this.printService.printAssistenciaSaida(assistencia); }
          })
        )
        .subscribe();
    }
  }

}
