import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Assistencia } from 'src/app/shared';

@Component({
  selector: 'app-accordion-content-registo',
  templateUrl: './accordion-content-registo.component.html',
  styleUrls: ['./accordion-content-registo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionContentRegistoComponent {
  @Input() assistencia: Assistencia = null;
  constructor() {}
}
