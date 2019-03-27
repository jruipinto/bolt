import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AssistenciasState, AssistenciaStateModel, PullAssistencias } from './assistencias.state';
import { PullAssistencia } from '../assistencia-modal';

@Component({
  selector: 'app-assistencias',
  templateUrl: './assistencias.component.html',
  styleUrls: ['./assistencias.component.scss']
})
export class AssistenciasComponent implements OnInit {
  @Select(AssistenciasState)
  public assistenciasState$: Observable<AssistenciaStateModel>;

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(new PullAssistencias());
  }

  openModal(id: number): void {
    this.store.dispatch(new PullAssistencia(id));
  }

}
