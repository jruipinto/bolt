import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cw-message-state-icon',
  templateUrl: './cw-message-state-icon.component.html',
  styleUrls: ['./cw-message-state-icon.component.scss']
})
export class CwMessageStateIconComponent {
  @Input() messageState: 'delivered' | 'failed' | 'pending';
}
