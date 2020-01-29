import { Component } from '@angular/core';
import { CwStateService } from './services/cw-state.service';

@Component({
  selector: 'app-chat-widget',
  template: `
  <div *ngIf="state$ | async as state">
    <app-cw-page-home *ngIf="state.activeRoute === 'home'">
    </app-cw-page-home>

    <app-cw-page-chat *ngIf="state.activeRoute === 'chat'">
    </app-cw-page-chat>

    <app-cw-floating-icon *ngIf="state.activeRoute === 'icon'" (click)="expandCw()">
    </app-cw-floating-icon>
  </div>
  `
})
export class ChatWidgetComponent {
  state$ = this.cws.state$;

  constructor(private cws: CwStateService) { }

  expandCw() {
    this.cws.patchState({ activeRoute: 'home' });
  }
}
