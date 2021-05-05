import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AssistenciasService } from 'src/app/shared/state';
import { concat, Observable } from 'rxjs';
import { Assistencia, AuthService } from 'src/app/shared';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencias-page',
  templateUrl: './assistencias-page.component.html',
  styleUrls: ['./assistencias-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistenciasPageComponent implements AfterViewInit, OnDestroy {
  LARGE_SCREEN_WIDTH = 992;
  screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  isLoading = true;
  isSmallScreen = this.screenWidth < this.LARGE_SCREEN_WIDTH;
  loggedInUserName: string;
  assistenciasTodas$ = this.assistencias.state$.pipe(
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
  assistenciasAFechar$ = this.assistencias.state$.pipe(
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
  assistenciasMinhas$ = this.assistencias.state$.pipe(
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
  assistencias$: Observable<Assistencia[]> = this.assistenciasMinhas$;

  constructor(
    private assistencias: AssistenciasService,
    private authService: AuthService
  ) {}

  ngAfterViewInit(): void {
    this.isSmallScreen = this.screenWidth < this.LARGE_SCREEN_WIDTH;

    concat(
      this.authService
        .getUserName$()
        .pipe(tap(([user]) => (this.loggedInUserName = user.nome))),
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
    ).subscribe(() => (this.isLoading = false));
  }

  ngOnDestroy(): void {}

  filterAssistencias(arg: 'todas' | 'a fechar' | 'minhas'): void {
    if (arg === 'todas') {
      this.assistencias$ = this.assistenciasTodas$;
      return;
    }
    if (arg === 'a fechar') {
      this.assistencias$ = this.assistenciasAFechar$;
      return;
    }
    if (arg === 'minhas') {
      this.assistencias$ = this.assistenciasMinhas$;
      return;
    }
  }

  onResize(event): void {
    this.isSmallScreen = event.target.innerWidth < this.LARGE_SCREEN_WIDTH;
  }
}
