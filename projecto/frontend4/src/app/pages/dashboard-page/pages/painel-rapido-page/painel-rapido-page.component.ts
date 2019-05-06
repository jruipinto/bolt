import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store} from '@ngxs/store';
import { AssistenciaModalGetAssistencia } from 'src/app/pages/dashboard-page/modals/assistencia-modal';
import { Encomenda, Assistencia } from 'src/app/shared/models';
import { AssistenciasService } from 'src/app/shared/rstate/assistencias.service';


@Component({
  selector: 'app-painel-rapido-page',
  templateUrl: './painel-rapido-page.component.html',
  styleUrls: ['./painel-rapido-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PainelRapidoPageComponent implements OnInit {

  constructor(private store: Store, private assistencias: AssistenciasService) { }

  public encomendas$: Observable<Encomenda[]>;
  public orcamentos$: Observable<Partial<Assistencia[]>> = this.assistencias.state$
    .pipe(
      map(state =>
        state
          ? state.filter(assistencia => assistencia.estado === 'orçamento pendente')
          : null
      )
    );
  public pedidosContactoCliente$: Observable<Partial<Assistencia[]>> = this.assistencias.state$
    .pipe(
      map(state =>
        state
          ? state.filter(assistencia => assistencia.estado === 'contacto pendente')
          : null
      )
    );

  ngOnInit() {
    this.assistencias
      .findAndWatch()
      .subscribe();
  }

  openAssistencia(id: number): void {
    this.store.dispatch(new AssistenciaModalGetAssistencia(id));
  }

}
