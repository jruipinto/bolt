import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { clone } from 'ramda';
import { PrintService } from 'src/app/pages/dashboard-page/prints';
import { Assistencia } from 'src/app/shared';
import { UIService } from 'src/app/shared/state';

@Component({
  selector: 'app-buttons-panel',
  templateUrl: './buttons-panel.component.html',
  styleUrls: ['./buttons-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonsPanelComponent {
  @Input() assistencia: Assistencia;
  newEncomendasCounter = 0;

  constructor(
    private printService: PrintService,
    private router: Router,
    private uiService: UIService
  ) {}

  createAssistenciaWithThisData(assistencia: Assistencia): void {
    this.uiService
      .patchState({
        // modals
        // pages
        assistenciasCriarNovaPageContactoClienteForm: {
          contacto: assistencia.cliente_user_contacto,
        },
        assistenciasCriarNovaPageCriarNovaForm: {
          ...assistencia,
          problema: `(Ficha anterior: ${assistencia.id}) `,
          orcamento: null,
        },
        // prints
      })
      .subscribe(() => {
        this.router.navigate(['/dashboard/assistencias-criar-nova']);
      });
  }

  saveAssistencia(newEstado: Assistencia['estado'], arg: Assistencia): void {}

  print(arg: Assistencia) {
    const assistencia = clone(arg);
    if (assistencia.estado === 'entregue') {
      return this.printService.printAssistenciaSaida(assistencia);
    }
    return this.printService.printAssistenciaEntrada(assistencia);
  }
}
