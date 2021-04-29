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
  assistencia: Assistencia;

  encomendaWizardOpened = false;
  @ViewChild('artigoSearchModalInput')
  artigoSearchModalInputEl: ElementRef<HTMLElement>;
  @ViewChild('encomendaWizardInput')
  encomendaWizardInputEl: ElementRef<HTMLElement>;
  material: Partial<Artigo>[];
  assistenciaOnInit: Assistencia;

  constructor(
    private assistencias: AssistenciasService,
    private route: ActivatedRoute
  ) {}

  ngAfterContentInit() {
    this.route.paramMap
      .pipe(
        tap(() => (this.isLoading = true)),
        concatMap((params) => this.assistencias.get(+params.get('id'))),
        map((res) => res[0]),
        tap((assistencia) => (this.assistenciaOnInit = clone(assistencia)))
      )
      .subscribe((assistencia) => {
        if (!this.assistencia || this.isLoading) {
          this.assistencia = clone(assistencia);
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy() {}
}
