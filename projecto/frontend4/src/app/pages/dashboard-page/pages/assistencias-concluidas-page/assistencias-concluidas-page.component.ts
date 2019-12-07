import { Component, AfterViewInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { UIService, AssistenciasService } from 'src/app/shared/state';
import { Router } from '@angular/router';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencias-concluidas-page',
  templateUrl: './assistencias-concluidas-page.component.html',
  styleUrls: ['./assistencias-concluidas-page.component.scss']
})
export class AssistenciasConcluidasPageComponent implements AfterViewInit, OnDestroy {
  public loading = true;

  constructor(
    private assistencias: AssistenciasService,
    private router: Router
  ) { }

  public assistencias$ = this.assistencias.state$
    .pipe(
      map(state =>
        state
          ? state.filter(assistencia =>
            assistencia.estado === 'concluído')
          : null
      )
    );

  ngAfterViewInit() {
    this.assistencias
      .find({
        query: {
          $limit: 200, estado: {
            $in: [
              'concluído'
            ]
          }
        }
      })
      .subscribe(() => this.loading = false);
  }

  ngOnDestroy() { }

  openAssistencia(assistenciaID: number) {
    return this.router.navigate(['/dashboard/assistencia', assistenciaID]);
  }


}
