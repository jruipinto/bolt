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
    const dbGetAndStore$ = state => this.xAPIservice.get(id)
    .pipe(tap( e => this.source.next([...state, e])));

    return this.state$.pipe(
      map( state => [...state.filter(item  => item.id === id)]),
      switchMap( state => (state[0] ? of(state) : dbGetAndStore$(state)) )
    );
  }
  public create(data: object) {
    // este nao é recomendado usar porque
    // convem criar a assistencia na db mesmo
    // para a db lhe atribuir uma ID
    this.xStore.add(data);
    return this.xAPIservice.create(data);
  }
  // public update() {}
  public patch(id: number, data: object) {
    this.xStore.upsert(id, data);
    return this.xAPIservice.patch(id, data);
  }
  // public delete() { }
  public onCreated() {
    return this.xAPIservice.onCreated().pipe(
      tap(res => this.xStore.upsertMany(res))
    );
  }
  public onPatched() {
    return this.xAPIservice.onCreated().pipe(
      tap(res => this.xStore.upsertMany(res))
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
