import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EntityStore, QueryEntity } from '@datorama/akita';
import { EntitiesApiAbstrationService } from './entities-api-abstration.service';

export abstract class AkitaServiceAbstraction {
constructor(
    private xAPIservice: EntitiesApiAbstrationService,
    private xStore: EntityStore<any, any, any>,
    private xQuery: QueryEntity<any, any>) {}

  public find(query?: object) {
    const request$ = this.xAPIservice.find(query).pipe(
      tap(res => this.xStore.set(res))
    );
    return this.xQuery.getHasCache() ? of() : request$;
  }
  public get(id: number) {
    const request$ = this.xAPIservice.get(id).pipe(
      tap(res => this.xStore.upsert(res[0].id, res[0]))
    );
    return this.xQuery.getHasCache() ? of() : request$;
  }
  public create() { }
  public update() { }
  public patch() { }
  public delete() { }
  public onCreated() { }
  public onPatched() { }

}
