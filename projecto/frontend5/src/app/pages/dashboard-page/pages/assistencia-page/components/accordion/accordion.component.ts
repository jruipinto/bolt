import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Artigo, Assistencia, Encomenda } from 'src/app/shared';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
  @Input() assistencia: Assistencia;

  @ViewChild('artigoSearchModalInput')
  artigoSearchModalInputEl: ElementRef<HTMLElement>;

  isArtigoSearchModalOpened = false;

  isEncomendaWizardOpened = false;

  artigoSearchResults: Artigo[];

  encomendaWizardInputEl: ElementRef<HTMLElement>;

  newEncomendasCounter = 0;

  constructor(private focusMonitor: FocusMonitor, private fb: FormBuilder) {}

  encomendasChanged(arg: Encomenda) {
    if (arg.qty < 1) {
      this.assistencia.encomendas = this.assistencia.encomendas
        .filter(({ estado }) => estado === 'nova') // only let to clean 'nova' encomendas
        .filter(({ id }) => id !== arg.id);
    }
    this.newEncomendasCounter = this.assistencia.encomendas.filter(
      ({ estado }) => estado === 'nova'
    ).length;
    this.artigoSearchResults = null; // reset this variable to enforce new search if needed
  }

  materialChanged(arg: Artigo) {
    if (arg.qty < 1) {
      this.assistencia.material = this.assistencia.material.filter(
        ({ id }) => id !== arg.id
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
