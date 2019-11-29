import { of, BehaviorSubject, merge } from 'rxjs';
import { map, concatMap, first } from 'rxjs/operators';
import { EntityApiAbstration } from './entity-api-abstration';
import { sort, clone, uniqBy, pipe } from 'ramda';

export abstract class EntityStateAbstraction {
  private defaults = [];
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

  public find(query?: any) {
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

  public onCreated() {
    return this.xAPIservice.onCreated()
      .pipe(
        concatMap(this.patchState)
      );
  }
  public onPatched(id?: number) {
    return this.xAPIservice.onPatched()
      .pipe(
        concatMap(this.patchState),
        map(res => res.filter(e => e.id === id))
      );
  }

  public watch() {
    return merge(
      this.onCreated(),
      this.onPatched()
    );
  }

}
