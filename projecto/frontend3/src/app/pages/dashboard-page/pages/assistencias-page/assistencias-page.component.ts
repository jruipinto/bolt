import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import {
  AssistenciasPageState, AssistenciasPageStateModel,
  AssistenciasPageFindAssistencias, AssistenciasPageCreateAssistencia,
  AssistenciasPagePatchAssistencia
} from './assistencias-page.state';
import { AssistenciaModalGetAssistencia } from '../../modals/assistencia-modal';
import { AssistenciasApiService } from 'src/app/shared';

@Component({
  selector: 'app-assistencias-page',
  templateUrl: './assistencias-page.component.html',
  styleUrls: ['./assistencias-page.component.scss']
})
export class AssistenciasPageComponent implements OnInit {
  @Select(AssistenciasPageState)
  public assistenciasPageState$: Observable<AssistenciasPageStateModel>;


  constructor(private store: Store, private assistenciasApiService: AssistenciasApiService) {
  }

  ngOnInit() {
    this.store.dispatch(new AssistenciasPageFindAssistencias());
  }

  openModal(id: number): void {
    this.store.dispatch(new AssistenciaModalGetAssistencia(id));
  }

}
