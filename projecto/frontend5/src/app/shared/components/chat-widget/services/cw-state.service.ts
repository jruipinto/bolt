import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first, map, tap, concatMap } from 'rxjs/operators';
import { Message } from '../models/message.model';

export interface CwState {
  activeRoute: 'icon' | 'home' | 'chat';
  activeChat: Message[] | null;
  chatsPreview: Message[] | null;
  selectedChatPreview: Message | null;
  newMessage: string | null; /** Message created on cw-editor that is to be sent */
}

@Injectable({
  providedIn: 'root'
})
export class CwStateService {
  initialState: CwState = {
    activeRoute: 'icon',
    activeChat: null,
    chatsPreview: null,
    selectedChatPreview: null,
    newMessage: null
  };
  /**
   * state$ observable publishes full Chat-widget's
   * state every time it changes
   */
  state$: BehaviorSubject<CwState> = new BehaviorSubject(this.initialState);

  /**
   * stateMutation$ observable publishes ONLY the
   * mutation to Chat-widget's state every time
   * it changes
   */
  stateMutation$: BehaviorSubject<Partial<CwState>> = new BehaviorSubject(null);

  public patchState$ = (patch: Partial<CwState>) => this.state$.pipe(
    first(),
    map(state => {
      console.log('Chat widget state - old:', state);
      console.log('Chat widget state - mutation:', patch);
      this.state$.next({ ...state, ...patch });
      this.stateMutation$.next(patch);
    }),
    concatMap(() => this.state$.pipe(
      first(),
      tap(newState => console.log('Chat widget state - new:', newState))
    ))
  )

  public patchState(patch: Partial<CwState>) {
    return this.patchState$(patch).subscribe();
  }

  constructor() { }
}
