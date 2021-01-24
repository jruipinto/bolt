import { Component } from '@angular/core';
import { CwStateService } from '../../services/cw-state.service';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-cw-page-home',
  template: `
  <app-cw-header></app-cw-header>
  <div class="chat-body" *ngIf="state$ | async as state">
    <div *ngFor="let chatPreview of state.chatsPreview">
      <app-cw-chat-preview [chatPreview]="chatPreview" (click)="open(chatPreview)">
      </app-cw-chat-preview>
    </div>
  </div>
  `,
  styleUrls: ['./cw-page-home.component.scss']
})
export class CwPageHomeComponent {
  state$ = this.cws.state$;

  constructor(private cws: CwStateService) { }

  open(selectedChatPreview: Message) {
    this.cws.patchState({ selectedChatPreview, activeRoute: 'chat' });
  }

}
