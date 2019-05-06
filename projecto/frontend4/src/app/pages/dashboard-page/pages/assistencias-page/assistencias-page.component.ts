import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import {
  AssistenciasPageState, AssistenciasPageStateModel,
  AssistenciasPageFindAssistencias
} from './assistencias-page.state';
import { AssistenciaModalGetAssistencia } from '../../modals/assistencia-modal';
import { AssistenciasService } from 'src/app/shared/rstate/assistencias.service';

@Component({
  selector: 'app-assistencias-page',
  templateUrl: './assistencias-page.component.html',
  styleUrls: ['./assistencias-page.component.scss']
})
export class AssistenciasPageComponent implements OnInit {
  @Select(AssistenciasPageState)
  public assistenciasPageState$: Observable<AssistenciasPageStateModel>;
  public allAssistencias$ = this.assistenciasPageState$.pipe(
    map(state =>
      state ?
      state.assistencias
      : null)
  );
  public allOpenAssistencias$ = this.assistenciasPageState$.pipe(
    map(state =>
      state ?
      state.assistencias.filter(assistencia =>
        assistencia.estado !== 'concluído')
      : null
    )
  );
  public allActiveAssistencias$ = this.assistenciasPageState$.pipe(
    map(state =>
      state ?
      state.assistencias.filter(assistencia =>
        assistencia.estado === 'em análise' || assistencia.estado === 'recebido')
      : null
    )
  );
  public allFreshAssistencias$ = this.assistenciasPageState$.pipe(
    map(state =>
      state ?
      state.assistencias.filter(assistencia =>
        assistencia.estado === 'recebido')
      : null
    )
  );

  constructor(private store: Store, private assistencias: AssistenciasService) {
  }

  public assistencias$ = this.assistencias.state$;

  ngOnInit() {
    this.store.dispatch(new AssistenciasPageFindAssistencias());
    this.assistencias.findAndWatch().subscribe();
  }

  openModal(id: number): void {
    this.store.dispatch(new AssistenciaModalGetAssistencia(id));
  }

}
