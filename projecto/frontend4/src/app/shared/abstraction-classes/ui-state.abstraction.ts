import { BehaviorSubject } from 'rxjs';
import { first, map } from 'rxjs/operators';

export abstract class UIStateAbstraction {
  public source = new BehaviorSubject<any>(this.defaults);
  public state$ = this.source;
  public patchState = (patch) => this.source.pipe(
    first(),
    map( state => this.source.next({...state, ...patch}))
  );

  constructor(private defaults) { }

}
