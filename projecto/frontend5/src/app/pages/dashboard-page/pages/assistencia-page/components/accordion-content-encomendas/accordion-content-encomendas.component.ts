import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
} from '@angular/core';
import { Assistencia, Artigo, Encomenda } from 'src/app/shared';
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
  newEncomendasCounter = 0;
  artigoSearchResults: Artigo[] = [];

  constructor() {}

  updateEncomendas(encomenda: Encomenda) {
    if (encomenda.qty < 1) {
      this.assistencia.encomendas = this.assistencia.encomendas
        .filter(({ estado }) => estado === 'nova') // only let to clean 'nova' encomendas
        .filter(({ id }) => id !== encomenda.id);
    }
    this.newEncomendasCounter = this.assistencia.encomendas.filter(
      ({ estado }) => estado === 'nova'
    ).length;
    this.artigoSearchResults = null; // reset this variable to enforce new search if needed
  }
}
