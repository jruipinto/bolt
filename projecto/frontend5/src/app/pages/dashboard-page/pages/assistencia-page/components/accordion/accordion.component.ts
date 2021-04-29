import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Artigo, Assistencia, Encomenda } from 'src/app/shared';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
  @ViewChild('artigoSearchModalInput')
  artigoSearchModalInputEl: ElementRef<HTMLElement>;
  encomendaWizardInputEl: ElementRef<HTMLElement>;

  @Input() assistencia: Assistencia = null;
  isArtigoSearchModalOpened = false;
  isEncomendaWizardOpened = false;
  artigoSearchResults: Artigo[] = [];
  newEncomendasCounter = 0;

  constructor(private focusMonitor: FocusMonitor) {}

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

  updateMaterial(artigo: Artigo) {
    if (artigo.qty < 1) {
      this.assistencia.material = this.assistencia.material.filter(
        ({ id }) => id !== artigo.id
      );
    }
    this.artigoSearchResults = null; // reset this variable to enforce new search if needed
  }

  openArtigoSearchModal() {
    this.isArtigoSearchModalOpened = true;
    setTimeout(
      () =>
        this.focusMonitor.focusVia(this.artigoSearchModalInputEl, 'program'),
      0.1
    );
  }

  openEncomendaWizard() {
    this.isEncomendaWizardOpened = true;
    setTimeout(
      () => this.focusMonitor.focusVia(this.encomendaWizardInputEl, 'program'),
      0.1
    );
  }
}
