import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { map, concatMap, tap } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AssistenciasService } from 'src/app/shared/state';
import { Observable } from 'rxjs';
import { Assistencia, AuthService } from 'src/app/shared';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencias-page',
  templateUrl: './assistencias-page.component.html',
  styleUrls: ['./assistencias-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistenciasPageComponent implements AfterViewInit, OnDestroy {
  public isLoading = true;
  public inOverflow = null;
  public loggedInUserName: string;
  public assistencias$: Observable<Assistencia[]>;
  public assistenciasTodas$ = this.assistencias.state$.pipe(
    map((state) =>
      state
        ? state.filter(
            (assistencia) =>
              assistencia.estado === 'recebido' ||
              assistencia.estado === 'em análise' ||
              assistencia.estado === 'contactado' ||
              assistencia.estado === 'incontactável' ||
              assistencia.estado === 'orçamento aprovado' ||
              assistencia.estado === 'orçamento recusado' ||
              assistencia.estado === 'material recebido'
          )
        : null
    )
  );
  public assistenciasAFechar$ = this.assistencias.state$.pipe(
    map((state) =>
      state
        ? state.filter(
            (assistencia) =>
              assistencia.estado === 'contactado' ||
              assistencia.estado === 'incontactável' ||
              assistencia.estado === 'orçamento aprovado' ||
              assistencia.estado === 'orçamento recusado' ||
              assistencia.estado === 'material recebido'
          )
        : null
    )
  );
  public assistenciasMinhas$ = this.assistencias.state$.pipe(
    map((state) =>
      state
        ? state.filter(
            (assistencia) =>
              assistencia.tecnico === this.loggedInUserName &&
              (assistencia.estado === 'recebido' ||
                assistencia.estado === 'em análise' ||
                assistencia.estado === 'contactado' ||
                assistencia.estado === 'incontactável' ||
                assistencia.estado === 'orçamento aprovado' ||
                assistencia.estado === 'orçamento recusado' ||
                assistencia.estado === 'material recebido')
          )
        : null
    )
  );

  constructor(
    private assistencias: AssistenciasService,
    private authService: AuthService
  ) {}

  ngAfterViewInit() {
    window.innerWidth < 890
      ? (this.inOverflow = 'inOverflow')
      : (this.inOverflow = null);
    this.authService
      .getUserName$()
      .pipe(
        tap((res) => (this.loggedInUserName = res[0].nome)),
        concatMap(() =>
          this.assistencias.find({
            query: {
              $limit: 200,
              estado: {
                $in: [
                  'recebido',
                  'em análise',
                  'contactado',
                  'incontactável',
                  'orçamento aprovado',
                  'orçamento recusado',
                  'material recebido',
                ],
              },
            },
          })
        )
      )
      .subscribe(() => (this.isLoading = false));
    this.filterAssistencias('minhas');
  }

  ngOnDestroy() {}

  filterAssistencias(arg: 'todas' | 'a fechar' | 'minhas') {
    if (arg === 'todas') {
      return (this.assistencias$ = this.assistenciasTodas$);
    }
    if (arg === 'a fechar') {
      return (this.assistencias$ = this.assistenciasAFechar$);
    }
    if (arg === 'minhas') {
      return (this.assistencias$ = this.assistenciasMinhas$);
    }
  }

  onResize(event) {
    const width = event.target.innerWidth;
    width < 890 ? (this.inOverflow = 'inOverflow') : (this.inOverflow = null);
  }
}
