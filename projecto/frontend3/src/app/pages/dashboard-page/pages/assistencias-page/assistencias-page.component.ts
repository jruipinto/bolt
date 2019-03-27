import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AssistenciasPageState, AssistenciasPageStateModel, PullAssistenciasPageState } from './assistencias-page.state';
import { PullAssistenciaModalState } from '../assistencia-modal';

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
    this.store.dispatch(new PullAssistenciasPageState());
  }

  openModal(id: number): void {
    this.store.dispatch(new PullAssistenciaModalState(id));
  }

}
