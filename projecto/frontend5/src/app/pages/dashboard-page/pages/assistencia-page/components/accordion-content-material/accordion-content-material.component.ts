import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
} from '@angular/core';
import { Assistencia, Artigo } from 'src/app/shared';
import { AssistenciaPageService } from '../../assistencia-page.service';
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

  constructor(private pageSvc: AssistenciaPageService) {}

  updateMaterial(artigo: Artigo) {
    this.pageSvc.updateMaterial(artigo);
  }
}
