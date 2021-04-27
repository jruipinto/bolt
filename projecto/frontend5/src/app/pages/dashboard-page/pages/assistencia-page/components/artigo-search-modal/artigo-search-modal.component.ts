import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Assistencia } from 'src/app/shared';

@Component({
  selector: 'app-artigo-search-modal',
  templateUrl: './artigo-search-modal.component.html',
  styleUrls: ['./artigo-search-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtigoSearchModalComponent {
  @Input() assistencia: Assistencia;

  constructor() {}
}
