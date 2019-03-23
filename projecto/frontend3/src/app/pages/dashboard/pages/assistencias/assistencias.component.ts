import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Emitter, Emittable } from '@ngxs-labs/emitter';
import { Observable } from 'rxjs';
import { AssistenciasState, AssistenciaStateModel } from './assistencias.state';
import { AssistenciaModalState, PullAssistencia} from '../assistencia-modal';

@Component({
  selector: 'app-assistencias',
  templateUrl: './assistencias.component.html',
  styleUrls: ['./assistencias.component.scss']
})
export class AssistenciasComponent implements OnInit {
/*
  public modalContext = {};
  public modalExists = false;
  public modalOpen = false; */

  @Select(AssistenciasState)
  public assistenciasState$: Observable<AssistenciaStateModel>;


  /*
  @Emitter(AssistenciasState.setValue)
  public assistenciasValue: Emittable<AssistenciaStateModel[]>;

  @Emitter(AssistenciasState.toogleModal)
  public toogleModal: Emittable<number>;

  @Emitter(AssistenciasState.saveModal)
  public saveModal: Emittable<any>;*/
  // #######

  @Emitter(AssistenciaModalState.getValue)
  public openModal: Emittable<number>;


  constructor(private store: Store) {
  }

  ngOnInit() {
  }
  /*
    openModal(id: number): void {
      this.store.dispatch(new PullAssistencia(id));
    }
    /*

    closeModal (): void {
      this.modalExists = false;
    }
  */
/*
  openModal(payload: {}): void {
    this.modalOpen = true;
    Object.assign(this.modalContext, { assistencia: payload });
    console.log('TCL: AssistenciasComponent -> this.modalContext', this.modalContext);
  }*/


}
