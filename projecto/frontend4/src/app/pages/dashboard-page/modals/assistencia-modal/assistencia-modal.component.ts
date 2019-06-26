import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, concatMap, tap } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { Assistencia } from 'src/app/shared/models';
import { PrintService } from 'src/app/pages/dashboard-page/prints/print.service';
import { UIService, UI } from 'src/app/shared/state/ui.service';
import { AssistenciasService } from 'src/app/shared/state';
import { Router } from '@angular/router';
import { List } from 'immutable';


@AutoUnsubscribe()
@Component({
  selector: 'app-assistencia-modal',
  templateUrl: './assistencia-modal.component.html',
  styleUrls: ['./assistencia-modal.component.scss']
})
export class AssistenciaModalComponent implements OnInit, OnDestroy {

  constructor(
    private printService: PrintService,
    private uiService: UIService,
    private assistencias: AssistenciasService,
    private router: Router) {
  }

  public assistencia$ = this.uiService.state$
    .pipe(
      concatMap((uiState: UI) => this.assistencias.state$
        .pipe(
          map((assistencias: List<Assistencia>) =>
            assistencias.filter((assistencia: Assistencia) =>
              assistencia.id === uiState.assistenciaModalID)
          ),
          map((assistencias: List<Assistencia>) => assistencias.get(0))
        ))
    );

  ngOnInit() {
    this.uiService.state$
      .pipe(
        concatMap((uiState: UI) => this.assistencias.get(uiState.assistenciaModalID))
      )
      .subscribe();
  }

  ngOnDestroy() { }

  closeModal(modalIsOpen: boolean) {
    if (modalIsOpen) {
      return this.uiService.patchState({ assistenciaModalVisible: false })
        .subscribe();
    }
  }

  saveModal(newEstado: string, assistencia: Assistencia) {
    if (newEstado !== 'em análise' && !assistencia.relatorio_cliente) {
      return alert('Preenche o relatório para o cliente!');
    }
    return this.assistencias.patch(assistencia.id, { ...assistencia, estado: newEstado })
      .pipe(
        concatMap(() =>
          this.uiService.patchState({ assistenciaModalVisible: false })
        ),
        tap(() => {
          if (newEstado === 'entregue') { this.printService.printAssistenciaSaida(assistencia); }
        })
      )
      .subscribe();
  }

  openNewAssistWithThisData(assistencia: Assistencia) {
    this.uiService.patchState(
      {
        // modals
        assistenciaModalVisible: false,
        // pages
        assistenciasCriarNovaPageContactoClienteForm: {
          contacto: assistencia.cliente_user_contacto
        },
        assistenciasCriarNovaPageCriarNovaForm: {
          ...assistencia,
          problema: `(Ficha anterior: ${assistencia.id}) `,
          orcamento: null
        },
        // prints
      }
    )
      .subscribe(() => this.router.navigate(['/dashboard/assistencias-criar-nova']));
  }

}
