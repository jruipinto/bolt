import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AssistenciasPageState, AssistenciasPageStateModel, AssistenciasPageFindAssistencias } from './assistencias-page.state';
import { AssistenciaModalGetAssistencia } from '../assistencia-modal';

@Component({
  selector: 'app-assistencias-page',
  templateUrl: './assistencias-page.component.html',
  styleUrls: ['./assistencias-page.component.scss']
})
export class AssistenciasPageComponent implements OnInit {
  @Select(AssistenciasPageState)
  public assistenciasPageState$: Observable<AssistenciasPageStateModel>;

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(new AssistenciasPageFindAssistencias());
  }

  openModal(id: number): void {
    this.store.dispatch(new AssistenciaModalGetAssistencia(id));
  }

}
