import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Select, Store } from '@ngxs/store';

import { AssistenciaModalState, AssistenciaModalStateModel, AssistenciaModalClose,
  AssistenciaModalPostAssistencia } from './assistencia-modal.state';


@Component({
  selector: 'app-assistencia-modal',
  templateUrl: './assistencia-modal.component.html',
  styleUrls: ['./assistencia-modal.component.scss']
})
export class AssistenciaModalComponent implements OnInit {
  @Select(AssistenciaModalState)
  public modalState$: Observable<AssistenciaModalStateModel>;

  constructor(private store: Store) {
  }

  ngOnInit() {
  }

  closeModal() {
    this.store.dispatch(new AssistenciaModalClose());
  }

  saveModal({ newEstado, assistencia }) {
    this.store.dispatch(new AssistenciaModalPostAssistencia(newEstado, assistencia));
  }

}
