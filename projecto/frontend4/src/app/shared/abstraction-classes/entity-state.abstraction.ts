import { of, BehaviorSubject, merge, fromEvent } from 'rxjs';
import { map, tap, concatMap, switchMap, first } from 'rxjs/operators';
import { unionBy } from 'lodash';
import { EntitiesApiAbstrationService } from './entities-api-abstration.service';
import { sortByID } from '../utilities';
import { fromJS } from 'immutable';

export abstract class EntityStateAbstraction {
  private defaults = [];
  private source = new BehaviorSubject<any[]>(this.defaults);
  public state$ = this.source.asObservable();
  private lostConnection = false;

  private windowOffline$ = fromEvent(window, 'offline');
  private windowOnline$ = fromEvent(window, 'online');


  constructor(
    private xAPIservice: EntitiesApiAbstrationService) {
    this.windowOffline$
      .subscribe(() => this.lostConnection = true);
    this.windowOnline$
      .subscribe(
        () => {
          // reset state + reset lostConnection flag
          this.setState(this.defaults);
          this.lostConnection = false;
        });
  }
  private setState(value: any) {
    const imutableValue = fromJS(value);
    this.source.next(imutableValue.toJS());
    console.log('state mutation:', imutableValue.toJS());
  }

  public find(query?: object) {
    return this.state$
      .pipe(
        first(),
        concatMap(state =>
          this.xAPIservice.find(query)
            .pipe(
              first(),
              tap(response => {
                // const newState = [...new Set([...state, ...response])]; in ES6 syntax
                const newState = unionBy(state.toJS(), response.toJS(), 'id');
                this.setState(sortByID(newState));
                // this.setState(newState);
              })
            )
        ));
  }
  public get(id: number) {
    const dbGetAndSave$ = (state: List<any>) => this.xAPIservice.get(id)
      .pipe(
        tap(e => this.setState(sortByID([...state.toJS(), ...e.toJS()]))));

    return this.state$.pipe(
      first(),
      map(state => state.filter(item => item.id === id)),
      switchMap(state => {
        if (state.get(0)) {
          return of(state);
        } else {
          return dbGetAndSave$(state);
        }
      })
    );
  }
  public create(data: object) {
    // get state => create new item in api => set state + newItem
    return this.state$.pipe(
      first(),
      concatMap(state => this.xAPIservice.create(data)
        .pipe(
          tap(newItem => this.setState(sortByID([...state.toJS(), newItem.get(0)])))
        ))
    );
  }
  // public update() {}
  public patch(id: number, data: object) {
    // get state => set state + data => send patch data to api
    return this.state$.pipe(
      first(),
      tap(state => this.setState(sortByID(unionBy([data], state.toJS(), 'id')))),
      concatMap(() => this.xAPIservice.patch(id, data))
    );
  }
  // public delete() { }
  public onCreated() {
    // receive item from api => get state => set state + receivedItem
    return this.xAPIservice.onCreated()
      .pipe(
        concatMap(receivedItem => this.state$
          .pipe(
            first(),
            tap(state => this.setState(sortByID([...state.toJS(), receivedItem.get(0)]))),
            map(() => receivedItem)
          ))
      );
  }
  public onPatched() {
    // receive item from api => get state => set state + receivedItem
    return this.xAPIservice.onPatched()
      .pipe(
        concatMap(receivedItem => this.state$.pipe(
          first(),
          tap(state => this.setState(sortByID(unionBy(receivedItem.get(0), state.toJS(), 'id')))),
          map(() => receivedItem)
        ))
      );
  }

  public findAndWatch(query?: object) {
    return merge(
      this.find(query),
      this.onCreated(),
      this.onPatched()
    );
  }

  public getAndWatch(id: number) {
    return merge(
      this.get(id),
      this.onCreated(),
      this.onPatched()
    );

  }

}
