import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CwStateService } from '../../services/cw-state.service';
import { map, filter } from 'rxjs/operators';
import { reverse } from 'ramda';

const notNull = <T>(value: T | null): value is T => value !== null;
const notUndefined = <T>(value: T | null): value is T => value !== undefined;

@Component({
  selector: 'app-cw-page-chat',
  templateUrl: './cw-page-chat.component.html',
  styleUrls: ['./cw-page-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CwPageChatComponent {
  activeChat$ = this.cws.state$.pipe(
    filter(notNull),
    filter(notUndefined),
    map(state => state.activeChat),
    map(activeChat => activeChat ? reverse(activeChat) : activeChat)
  );
  constructor(private cws: CwStateService) { }
}
