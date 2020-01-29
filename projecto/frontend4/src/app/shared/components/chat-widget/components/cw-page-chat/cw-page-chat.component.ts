import { Component } from '@angular/core';
import { CwStateService } from '../../services/cw-state.service';

@Component({
  selector: 'app-cw-page-chat',
  templateUrl: './cw-page-chat.component.html',
  styleUrls: ['./cw-page-chat.component.scss']
})
export class CwPageChatComponent {
  state$ = this.cws.state$;
  constructor(private cws: CwStateService) { }
}
