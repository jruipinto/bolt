import { BehaviorSubject } from 'rxjs';
import { first, map, tap, concatMap } from 'rxjs/operators';

export abstract class UIStateAbstraction {
  public state$ = new BehaviorSubject<any>(this.defaults);
  public patchState = (patch) => this.state$.pipe(
    first(),
    map(state => {
      console.log('UI state - old:', state);
      console.log('UI state - mutation:', patch);
      this.state$.next({ ...state, ...patch });
    }),
    concatMap(() =>
      this.state$
        .pipe(
          first(),
          tap(newState => console.log('UI state - new:', newState))
        )
    )
  )

  constructor(private defaults) { }

}
