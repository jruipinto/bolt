import { BehaviorSubject } from 'rxjs';

export abstract class UIStateAbstraction {
  public source = new BehaviorSubject<any>(this.defaults);
  public state$ = this.source;

  constructor(private defaults) { }

}
