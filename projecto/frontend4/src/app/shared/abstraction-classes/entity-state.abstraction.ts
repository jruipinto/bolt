import { of, BehaviorSubject, merge } from 'rxjs';
import { map, concatMap, first } from 'rxjs/operators';
import { EntityApiAbstration } from './entity-api-abstration';
import uniqBy from 'ramda/es/uniqBy';
import pipe from 'ramda/es/pipe';
import { sort, clone } from 'ramda';

export abstract class EntityStateAbstraction {
  private defaults = [];
  private queryHistory = [];
  public state$ = new BehaviorSubject<any[]>(this.defaults);

  constructor(
    private xAPIservice: EntityApiAbstration) {
  }

  private patchState = (value: any[]) => {
    return this.state$
      .pipe(
        first(),
        map(state => {
          const mutation = clone(value);
          const oldState = clone(state);
          const objID = obj => obj.id;
          const diff = (objA, objB) => objA.id - objB.id;
          const patch = pipe(
            uniqBy(objID),
            sort(diff)
          );
          const newState = patch([...mutation, ...oldState]);
          this.state$.next(newState);
          console.log(`${this.xAPIservice.entityName} State - old:`, oldState);
          console.log(`${this.xAPIservice.entityName} State - mutation:`, mutation);
          console.log(`${this.xAPIservice.entityName} State - new:`, newState);
          return value;
        })
      );
  }

  public find(query?: object) {
    const stringyfiedQuery = JSON.stringify(query);
    const previousQuery = this.queryHistory
      .filter(q => JSON.stringify(q) === stringyfiedQuery);
    if (previousQuery.length > 0) {
      return;
    }
    this.queryHistory = [...clone(this.queryHistory), query];
    return this.xAPIservice.find(query)
      .pipe(
        concatMap(this.patchState)
      );
  }

  public get(id: number) {
    return this.state$
      .pipe(
        first(),
        concatMap(state => {
          const item = state.find(i => i.id === id);
          if (item) {
            return of([item]);
          }
          return this.xAPIservice.get(id)
            .pipe(
              concatMap(this.patchState)
            );
        })
      );
  }

  public create(data: object) {
    return this.xAPIservice.create(data)
      .pipe(
        concatMap(this.patchState)
      );
  }

  // public update() {}

  public patch(id: number, data: object) {
    return this.xAPIservice.patch(id, data)
      .pipe(
        concatMap(this.patchState)
      );
  }

  // public delete() { }

  public onCreated(id?: number) {
    return this.xAPIservice.onCreated()
      .pipe(
        concatMap(this.patchState),
        map(res => res.filter(e => e.id === id))
      );
  }
  public onPatched(id?: number) {
    return this.xAPIservice.onPatched()
      .pipe(
        concatMap(this.patchState),
        map(res => res.filter(e => e.id === id))
      );
  }

  public findAndWatch(query?: object) {
    // needs to be fixed later
    return merge(
      this.find(query),
      // this.onCreated(),
      // this.onPatched()
    );
  }

  public getAndWatch(id: number) {
    return merge(
      this.get(id),
      this.onPatched(id)
    );

  }

}
