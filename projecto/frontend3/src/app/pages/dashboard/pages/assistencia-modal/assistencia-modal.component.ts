import { Component, OnInit } from '@angular/core';

import { Select } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Observable } from 'rxjs';

import { AssistenciaModalState, AssistenciaModalStateModel } from './assistencia-modal.state';
import { Assistencia } from 'src/app/shared/models';

@Component({
  selector: 'app-assistencia-modal',
  templateUrl: './assistencia-modal.component.html',
  styleUrls: ['./assistencia-modal.component.scss']
})
export class AssistenciaModalComponent implements OnInit {
  @Select(AssistenciaModalState)
  public modalState$: Observable<AssistenciaModalStateModel>;

  @Emitter(AssistenciaModalState.setValue)
  public saveModal: Emittable<Assistencia>;

  @Emitter(AssistenciaModalState.unsetModalIsOpen)
  public closeWithoutSaving: Emittable<void>;


  constructor() { }

  ngOnInit() {
  }

}
