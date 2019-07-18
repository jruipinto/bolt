import { of, BehaviorSubject, merge, fromEvent } from 'rxjs';
import { map, tap, concatMap, switchMap, first } from 'rxjs/operators';
import { unionBy } from 'lodash';
import { EntitiesApiAbstrationService } from './entities-api-abstration.service';
import { sortByID } from '../utilities';

export abstract class EntityStateAbstraction {
  private defaults = [];
  private source = new BehaviorSubject<any[]>(this.defaults);
  public state$ = this.source;
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
    this.source.next(value);
    console.log('state mutation:', value);
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
                const newState = unionBy(state, response, 'id');
                this.setState(sortByID(newState));
                // this.setState(newState);
              })
            )
        ));
  }
  public get(id: number) {
    const dbGetAndSave$ = state => this.xAPIservice.get(id)
      .pipe(
        tap(e => this.setState(sortByID([...state, ...e]))));

    return this.state$.pipe(
      first(),
      map(state => [...state.filter(item => item.id === id)]),
      switchMap(state => {
        if (state[0]) {
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
          tap(newItem => this.setState(sortByID([...state, newItem[0]])))
        ))
    );
  }
  // public update() {}
  public patch(id: number, data: object) {
    // get state => set state + data => send patch data to api
    return this.state$.pipe(
      first(),
      tap(state => this.setState(sortByID(unionBy([data], state, 'id')))),
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
            tap(state => this.setState(sortByID([...state, receivedItem[0]]))),
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
          tap(state => this.setState(sortByID(unionBy(receivedItem[0], state, 'id')))),
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
    ).pipe(
      concatMap(() => this.state$.pipe(
        first(),
        map(state => state.filter(s => s.id === id))
      ))
    );

  }

}
