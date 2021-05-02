import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
} from '@angular/core';
import { Assistencia, Artigo } from 'src/app/shared';
import { ArtigoSearchModalComponent } from '../artigo-search-modal/artigo-search-modal.component';

@Component({
  selector: 'app-accordion-content-material',
  templateUrl: './accordion-content-material.component.html',
  styleUrls: ['./accordion-content-material.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionContentMaterialComponent {
  @ViewChild(ArtigoSearchModalComponent)
  artigoSearchModal: ArtigoSearchModalComponent;

  @Input() assistencia: Assistencia = null;
  artigoSearchResults: Artigo[] = [];

  constructor() {}

  updateMaterial(artigo: Artigo) {
    if (artigo.qty < 1) {
      this.assistencia.material = this.assistencia.material.filter(
        ({ id }) => id !== artigo.id
      );
    }
    this.artigoSearchResults = null; // reset this variable to enforce new search if needed
  }
}
