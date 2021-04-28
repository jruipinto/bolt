import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { clone } from 'ramda';
import { Assistencia } from 'src/app/shared';

@Component({
  selector: 'app-technical-report',
  templateUrl: './technical-report.component.html',
  styleUrls: ['./technical-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicalReportComponent {
  @Input() assistencia: Assistencia;

  constructor() {}

  cloneRelatorioInterno() {
    this.assistencia.relatorio_cliente = clone(
      this.assistencia.relatorio_interno
    );
  }
}
