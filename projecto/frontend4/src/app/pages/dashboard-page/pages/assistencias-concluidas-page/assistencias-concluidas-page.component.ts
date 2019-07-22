import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
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
export class AssistenciasConcluidasPageComponent implements OnInit, OnDestroy {

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

    ngOnInit() {
      this.assistencias
        .findAndWatch({ query: { $limit: 200, estado: { $in: [
          'concluído'
        ] } } })
        .subscribe();
    }

  ngOnDestroy() { }

  openAssistencia(assistenciaID: number) {
    return this.router.navigate(['/dashboard/assistencia', assistenciaID]);
  }


}
