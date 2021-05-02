import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Assistencia } from 'src/app/shared';

@Component({
  selector: 'app-accordion-content-messages',
  templateUrl: './accordion-content-messages.component.html',
  styleUrls: ['./accordion-content-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionContentMessagesComponent {
  @Input() assistencia: Assistencia = null;
  constructor() {}
}
