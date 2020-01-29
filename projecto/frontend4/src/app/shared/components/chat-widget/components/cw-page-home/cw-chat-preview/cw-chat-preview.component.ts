import { Component, Input } from '@angular/core';
import { Message } from '../../../models/message.model';

@Component({
  selector: 'app-cw-chat-preview',
  templateUrl: './cw-chat-preview.component.html',
  styleUrls: ['./cw-chat-preview.component.scss']
})
export class CwChatPreviewComponent {
  @Input() chatPreview: Message;
}
