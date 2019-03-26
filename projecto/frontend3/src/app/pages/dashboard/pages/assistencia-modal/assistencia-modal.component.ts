import { Component, OnInit } from '@angular/core';

import { Select, Store } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Observable } from 'rxjs';

import { AssistenciaModalState, AssistenciaModalStateModel, CloseModalAssistencia, PushAssistencia } from './assistencia-modal.state';
import { Assistencia } from 'src/app/shared/models';

@Component({
  selector: 'app-assistencia-modal',
  templateUrl: './assistencia-modal.component.html',
  styleUrls: ['./assistencia-modal.component.scss']
})
export class AssistenciaModalComponent implements OnInit {
  @Select(AssistenciaModalState)
  public modalState$: Observable<AssistenciaModalStateModel>;

 /* @Emitter(AssistenciaModalState.setValue)
  public saveModal: Emittable<Assistencia>;*/

  closeModal() {
    this.store.dispatch( new CloseModalAssistencia())
  }

  saveModal({newEstado, assistencia}) {
    this.store.dispatch(new PushAssistencia(newEstado, assistencia))
  }


  constructor(private store: Store) { }

  ngOnInit() {
  }

}
