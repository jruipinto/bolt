import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Observable } from 'rxjs';
import { AssistenciasState, AssistenciaStateModel } from '../../store/assistencias.state';

@Component({
  selector: 'app-assistencias',
  templateUrl: './assistencias.component.html',
  styleUrls: ['./assistencias.component.scss']
})
export class AssistenciasComponent implements OnInit {

  public modalContext = {};
  public modalExists: boolean;

  @Select(AssistenciasState)
  public assistencias$: Observable<AssistenciaStateModel[]>;

  @Emitter(AssistenciasState.setValue)
  public assistenciasValue: Emittable<AssistenciaStateModel[]>;

  @Emitter(AssistenciasState.toogleModal)
  public toogleModal: Emittable<number>;

  @Emitter(AssistenciasState.saveModal)
  public saveModal: Emittable<any>;


  constructor() {
  }

  ngOnInit() {
  }

  openModal(payload: {}): void {
    this.modalExists = true;
    Object.assign(this.modalContext, { assistencia: payload });
  }

  closeModal (): void {
    this.modalExists = false;
  }
}
