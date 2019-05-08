import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Select, Store } from '@ngxs/store';

import {
  AssistenciaModalState, AssistenciaModalStateModel, AssistenciaModalClose,
  AssistenciaModalPostAssistencia
} from './assistencia-modal.state';
import { Assistencia } from 'src/app/shared/models';
import { PrintService } from 'src/app/pages/dashboard-page/prints/print.service';
import { UIService, UI } from 'src/app/shared/rstate/ui.service';
import { map, concatMap, tap, first } from 'rxjs/operators';
import { AssistenciasService } from 'src/app/shared/rstate/assistencias.service';


@Component({
  selector: 'app-assistencia-modal',
  templateUrl: './assistencia-modal.component.html',
  styleUrls: ['./assistencia-modal.component.scss']
})
export class AssistenciaModalComponent implements OnInit {
  @Select(AssistenciaModalState)
  public modalState$: Observable<AssistenciaModalStateModel>;

  constructor(
    private store: Store,
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
              assistencia.id == uiState.assistenciaModalID)
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
      alert('Primeiro tens de concluir a assistencia!');
    } else {
      /*this.store.dispatch(new AssistenciaModalPostAssistencia({ ...assistencia, estado: newEstado }))
        .subscribe(() => {
          if (newEstado === 'entregue') { this.printService.printAssistenciaSaida(assistencia); }
        });*/
      this.assistencias.patch(assistencia.id, { ...assistencia, estado: newEstado })
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
