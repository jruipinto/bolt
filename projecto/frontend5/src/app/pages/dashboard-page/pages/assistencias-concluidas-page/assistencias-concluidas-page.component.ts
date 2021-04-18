import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AssistenciasService } from 'src/app/shared/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencias-concluidas-page',
  templateUrl: './assistencias-concluidas-page.component.html',
  styleUrls: ['./assistencias-concluidas-page.component.scss'],
})
export class AssistenciasConcluidasPageComponent
  implements AfterViewInit, OnDestroy {
  public isLoading = true;

  constructor(private assistencias: AssistenciasService) {}

  public assistencias$ = this.assistencias.state$.pipe(
    map((state) =>
      state
        ? state.filter(
            (assistencia) =>
              assistencia.estado === 'concluído' ||
              assistencia.estado === 'concluído s/ rep.'
          )
        : null
    )
  );

  ngAfterViewInit() {
    this.assistencias
      .find({
        query: {
          $limit: 200,
          estado: {
            $in: ['concluído', 'concluído s/ rep.'],
          },
        },
      })
      .subscribe(() => (this.isLoading = false));
  }

  ngOnDestroy() {}
}
