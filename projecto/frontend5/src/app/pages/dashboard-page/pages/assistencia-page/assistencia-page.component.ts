import {
  Component,
  AfterContentInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, concatMap, tap } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { Assistencia, Artigo } from 'src/app/shared/models';
import { AssistenciasService } from 'src/app/shared/state';
import { clone } from 'ramda';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencia-page',
  templateUrl: './assistencia-page.component.html',
  styleUrls: ['./assistencia-page.component.scss'],
})
export class AssistenciaPageComponent implements AfterContentInit, OnDestroy {
  isLoading = true;
  assistencia: Assistencia = null;
  assistenciaOnInit: Assistencia;

  constructor(
    private assistencias: AssistenciasService,
    private route: ActivatedRoute
  ) {}

  ngAfterContentInit() {
    this.route.paramMap
      .pipe(
        concatMap((routeParams) =>
          this.assistencias.get(+routeParams.get('id'))
        ),
        map((res) => res[0])
      )
      .subscribe((assistencia) => {
        if (!this.assistencia) {
          this.assistencia = clone(assistencia);
        }
        this.assistenciaOnInit = clone(assistencia);
        this.isLoading = false;
      });
  }

  ngOnDestroy() {}
}
