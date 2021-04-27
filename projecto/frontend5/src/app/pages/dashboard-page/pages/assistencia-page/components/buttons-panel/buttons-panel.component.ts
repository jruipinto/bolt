import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Assistencia } from 'src/app/shared';

@Component({
  selector: 'app-buttons-panel',
  templateUrl: './buttons-panel.component.html',
  styleUrls: ['./buttons-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonsPanelComponent {
  @Input() assistencia: Assistencia;

  constructor() {}
}
