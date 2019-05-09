import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, first } from 'rxjs/operators';
import { Encomenda, Assistencia } from 'src/app/shared/models';
import { UI, UIService, AssistenciasService } from 'src/app/shared/state';


@Component({
  selector: 'app-painel-rapido-page',
  templateUrl: './painel-rapido-page.component.html',
  styleUrls: ['./painel-rapido-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PainelRapidoPageComponent implements OnInit {

  constructor(
    private assistencias: AssistenciasService,
    private uiService: UIService) { }

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
    this.uiService.state$
      .pipe(
        first(),
        tap((uiState: UI) =>
          this.uiService.source.next({ ...uiState, ...{ assistenciaModalID: id, assistenciaModalVisible: true } })
        )
      )
      .subscribe();
  }

}
