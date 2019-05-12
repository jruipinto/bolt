import { BehaviorSubject } from 'rxjs';
import { first, map, tap, concatMap } from 'rxjs/operators';

export abstract class UIStateAbstraction {
  public source = new BehaviorSubject<any>(this.defaults);
  public state$ = this.source;
  public patchState = (patch) => this.source.pipe(
    first(),
    map( state => {
      console.log('old ui state:', state);
      console.log('mutation:', patch);
      this.source.next({...state, ...patch});
    }),
    concatMap( () => this.state$.pipe(first(), tap(newState => console.log('new ui state:', newState))))
  )

  constructor(private defaults) { }

}
