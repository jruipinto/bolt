import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Select, Store } from '@ngxs/store';

import {
  AssistenciaModalState, AssistenciaModalStateModel, AssistenciaModalClose,
  AssistenciaModalPostAssistencia
} from './assistencia-modal.state';
import { Assistencia } from 'src/app/shared/models';
import { PrintService } from 'src/app/pages/dashboard-page/prints/print.service';


@Component({
  selector: 'app-assistencia-modal',
  templateUrl: './assistencia-modal.component.html',
  styleUrls: ['./assistencia-modal.component.scss']
})
export class AssistenciaModalComponent implements OnInit {
  @Select(AssistenciaModalState)
  public modalState$: Observable<AssistenciaModalStateModel>;

  constructor(private store: Store, private printService: PrintService) {
  }

  ngOnInit() {
  }

  closeModal(modalIsOpen: boolean) {
    if (modalIsOpen) { this.store.dispatch(new AssistenciaModalClose()); }
  }

  saveModal(newEstado: string, assistencia: Assistencia) {
    if (newEstado === 'entregue' && assistencia.estado !== 'concluído') {
      alert('Primeiro tens de concluir a assistencia!');
    } else {
      this.store.dispatch(new AssistenciaModalPostAssistencia({ ...assistencia, estado: newEstado }))
        .subscribe(() => {
          if (newEstado === 'entregue') { this.printService.printAssistenciaSaida(assistencia); }
        });
    }
  }

}
