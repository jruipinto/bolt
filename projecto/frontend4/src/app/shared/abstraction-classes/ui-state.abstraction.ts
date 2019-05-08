import { BehaviorSubject } from 'rxjs';

export abstract class UIStateAbstraction {
  private default = null;
  public source = new BehaviorSubject<any>(this.default);
  public state$ = this.source.asObservable();

  constructor() { }

}
