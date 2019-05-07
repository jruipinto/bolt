import { BehaviorSubject } from 'rxjs';

export abstract class UIStateAbstraction {
  public source = new BehaviorSubject<any>(this.defaultState);
  public state$ = this.source.asObservable();

  constructor(private defaultState) { }

}
