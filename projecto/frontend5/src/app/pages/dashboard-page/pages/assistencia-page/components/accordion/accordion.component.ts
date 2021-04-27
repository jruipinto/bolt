import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Assistencia } from 'src/app/shared';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
  @Input() assistencia: Assistencia;

  constructor() {}
}
