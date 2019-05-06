import { of, concat, BehaviorSubject } from 'rxjs';
import { map, tap, concatMap, switchMap } from 'rxjs/operators';
import { unionBy } from 'lodash';
import { EntityStore, QueryEntity } from '@datorama/akita';
import { EntitiesApiAbstrationService } from './entities-api-abstration.service';

export abstract class EntityStateAbstraction {
  private default = null;
  private source = new BehaviorSubject<any[]>(this.default);
  private state$ = this.source.asObservable();

  constructor(
    private xAPIservice: EntitiesApiAbstrationService,
    private xStore: EntityStore<any, any, any>,
    private xQuery: QueryEntity<any, any>) { }

  public find(query?: object) {
    return this.state$
      .pipe(
        concatMap(state =>
          this.xAPIservice.find(query)
            .pipe(
              map(response => {
                // const newState = [...new Set([...state, ...response])]; in ES6 syntax
                const newState = unionBy(state, response, 'id');
                this.source.next(newState);
                return newState;
              })
            )
        ));
  }
  public get(id: number) {
    const dbGetAndSave$ = state => this.xAPIservice.get(id)
    .pipe(tap( e => this.source.next([...state, e])));

    return this.state$.pipe(
      map( state => [...state.filter(item  => item.id === id)]),
      switchMap( state => (state[0] ? of(state) : dbGetAndSave$(state)) )
    );
  }
  public create(data: object) {
    // get state => create new item in api => set state + newItem
    return this.state$.pipe(
      concatMap(state => this.xAPIservice.create(data).pipe(
        tap(newItem => this.source.next([...state, newItem]))
      ))
    );
  }
  // public update() {}
  public patch(id: number, data: object) {
    // get state => set state + data => send patch data to api
    return this.state$.pipe(
      tap( state  => this.source.next(unionBy([data], state))),
      concatMap( () => this.xAPIservice.patch(id, data))
    );
  }
  // public delete() { }
  public onCreated() {
    // receive item from api => get state => set state + receivedItem
    return this.xAPIservice.onCreated().pipe(
      concatMap( receivedItem => this.state$.pipe(
        tap( state => this.source.next([...state, receivedItem]))
      ))
    );
  }
  public onPatched() {
    // receive item from api => get state => set state + receivedItem
    return this.xAPIservice.onCreated().pipe(
      concatMap( receivedItem => this.state$.pipe(
        tap( state => this.source.next(unionBy(receivedItem, state)))
      ))
    );
  }

  public findAndWatch(query?: object) {
    return concat(
      this.find(query),
      this.onCreated(),
      this.onPatched()
    );
  }

}
