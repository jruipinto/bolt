import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Assistencia } from 'src/app/shared';

@Component({
  selector: 'app-assistencia-info',
  templateUrl: './assistencia-info.component.html',
  styleUrls: ['./assistencia-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistenciaInfoComponent {
  @Input() assistencia: Assistencia;

  constructor() {}

  openTecnicoSelectionModal(): void {}
}
