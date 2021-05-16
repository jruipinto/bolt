import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { concatMap, map } from 'rxjs/operators';

import { AssistenciasService } from 'src/app/shared/state';
import { AssistenciaPageService } from './assistencia-page.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencia-page',
  templateUrl: './assistencia-page.component.html',
  styleUrls: ['./assistencia-page.component.scss'],
})
export class AssistenciaPageComponent implements AfterViewInit, OnDestroy {
  assistencia$ = this.pageSvc.state
    .observe()
    .pipe(map((state) => state.assistenciaDraft));
  isLoading$ = this.pageSvc.state
    .observe()
    .pipe(map((state) => state.isLoading));

  constructor(
    private pageSvc: AssistenciaPageService,
    private assistencias: AssistenciasService,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.route.paramMap
      .pipe(
        concatMap((routeParams) => {
          return this.assistencias
            .get(+routeParams.get('id'))
            .pipe(map(([assistencia]) => assistencia));
        })
      )
      .subscribe((assistencia) => {
        this.pageSvc.state.patch((draftState) => {
          if (!draftState.assistenciaDraft) {
            draftState.assistenciaDraft = assistencia;
          }
          draftState.assistenciaOriginal = assistencia;
          draftState.isLoading = false;
        });
      });
  }

  ngOnDestroy(): void {}
}
