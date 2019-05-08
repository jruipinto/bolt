import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AssistenciaModalGetAssistencia } from '../../modals/assistencia-modal';
import { AssistenciasService } from 'src/app/shared/rstate/assistencias.service';

@Component({
  selector: 'app-assistencias-page',
  templateUrl: './assistencias-page.component.html',
  styleUrls: ['./assistencias-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistenciasPageComponent implements OnInit {

  constructor(private store: Store, private assistencias: AssistenciasService) {
  }

  public assistencias$ = this.assistencias.state$
    .pipe(
      map(state =>
        state
          ? state.filter(assistencia =>
            assistencia.estado === 'em análise' || assistencia.estado === 'recebido')
          : null
      )
    );

  ngOnInit() {
    // this.store.dispatch(new AssistenciasPageFindAssistencias());
    this.assistencias
      .findAndWatch({ query: { $limit: 200, estado: { $ne: 'entregue' } } })
      .subscribe();
  }

  openModal(id: number): void {
    this.store.dispatch(new AssistenciaModalGetAssistencia(id));
  }

}
