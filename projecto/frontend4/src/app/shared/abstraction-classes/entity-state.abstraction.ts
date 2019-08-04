import { of, BehaviorSubject, merge, fromEvent } from 'rxjs';
import { map, tap, concatMap, switchMap, first } from 'rxjs/operators';
import { unionBy } from 'lodash';
import { EntitiesApiAbstrationService } from './entities-api-abstration.service';
import { sortByID } from '../utilities';
import uniqBy from 'ramda/es/uniqBy';
import { sort, clone } from 'ramda';
import pipe from 'ramda/es/pipe';

export abstract class EntityStateAbstraction {
  private defaults = [];
  private source = new BehaviorSubject<any[]>(this.defaults);
  public state$ = this.source;

  constructor(
    private xAPIservice: EntitiesApiAbstrationService) {
  }
  private setState(value: any) {
    this.source.next(value);
    console.log('state mutation:', value);
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
          this.source.next(newState);
          console.log(`${this.xAPIservice.entityName} State - old:`, oldState);
          console.log(`${this.xAPIservice.entityName} State - mutation:`, mutation);
          console.log(`${this.xAPIservice.entityName} State - new:`, newState);
          return value;
        })
      );
  }

  public find(query?: object) {
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
    /*
  return this.xAPIservice.get(id)
    .pipe(
      concatMap(this.patchState)
    );*/
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
