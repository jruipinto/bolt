import { produce } from 'immer';
import { WritableDraft } from 'immer/dist/internal';
import { clone } from 'ramda';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export function createComponentState<T>(defaultComponentState: T) {
  const stateSource = new BehaviorSubject<T>(defaultComponentState);

  return {
    /**
     * Observes state (first emission only)
     */
    observeOne() {
      return stateSource.asObservable().pipe(
        take(1),
        map((state) => clone(state))
      );
    },
    /**
     * Observes state
     */
    observe() {
      return stateSource.asObservable().pipe(map((state) => clone(state)));
    },

    /**
     * Patchs state by executing patchCallback on state
     * (the old state isn't changed. Immutability is assured by immerjs)
     */
    patch(patchCallback: (draftState: WritableDraft<T>) => void) {
      (this.observeOne() as Observable<T>).subscribe((state) => {
        const nextState = produce(state, patchCallback);
        stateSource.next(nextState);
      });
    },
  };
}
