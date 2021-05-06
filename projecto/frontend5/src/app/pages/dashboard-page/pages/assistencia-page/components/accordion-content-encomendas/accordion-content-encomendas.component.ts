import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
} from '@angular/core';
import { Assistencia, Artigo, Encomenda } from 'src/app/shared';
import { AssistenciaPageService } from '../../assistencia-page.service';
import { EncomendaWizardComponent } from '../encomenda-wizard/encomenda-wizard.component';

@Component({
  selector: 'app-accordion-content-encomendas',
  templateUrl: './accordion-content-encomendas.component.html',
  styleUrls: ['./accordion-content-encomendas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionContentEncomendasComponent {
  @ViewChild(EncomendaWizardComponent)
  encomendaWizard: EncomendaWizardComponent;

  @Input() assistencia: Assistencia = null;

  constructor(private pageSvc: AssistenciaPageService) {}

  updateEncomendas(encomenda: Encomenda): void {
    this.pageSvc.updateEncomendas(encomenda);
  }
}
