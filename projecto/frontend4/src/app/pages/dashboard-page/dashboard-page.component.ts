import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, merge } from 'rxjs';
import { map, tap, concatMap, filter, mergeMap } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AuthService } from 'src/app/shared';
import { UI, UIService, AssistenciasService, ArtigosService, EncomendasService, UsersService, MessagesService } from 'src/app/shared/state';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { uniqBy } from 'ramda';
import { CwStateService } from 'src/app/shared/components/chat-widget/services/cw-state.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements AfterViewInit, OnDestroy {
  public userName: string;
  public sidebarVisible = false;
  // public assistenciaID: string;
  public dashboardSearchBarForm = this.fb.group({
    assistenciaID: [null]
  });

  public assistenciaModalVisible$: Observable<boolean> = this.uiService.state$
    .pipe(
      map((uiState: UI) => uiState.assistenciaModalVisible)
    );
  public artigoModalVisible$: Observable<boolean> = this.uiService.state$
    .pipe(
      map((uiState: UI) => uiState.artigoModalVisible)
    );
  public encomendaPromptModalVisible$: Observable<boolean> = this.uiService.state$
    .pipe(
      map((uiState: UI) => uiState.encomendaPromptModalVisible)
    );


  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private assistencias: AssistenciasService,
    private artigos: ArtigosService,
    private encomendas: EncomendasService,
    private users: UsersService,
    private messages: MessagesService,
    private cws: CwStateService,
    private router: Router,
    private fb: FormBuilder) { }

  ngAfterViewInit() {
    this.authService.getUserName$()
      .subscribe(res => {
        const nomeCompleto: string = res[0].nome;
        const nomeArr = nomeCompleto.split(' ');
        this.userName = nomeArr[0];
      });
    merge(
      this.assistencias.watch(),
      this.artigos.watch(),
      this.encomendas.watch(),
      this.users.watch(),
      this.encomendaPromptModalVisible$
    ).subscribe();

    this.messages.find({
      query: {
        $limit: 200,
        $sort: {
          createdAt: -1
        }
      }
    }).pipe(
      map(messages => uniqBy((msg: any) => msg.phoneNumber, messages)),
      concatMap(chatsPreview => this.cws.patchState$({ chatsPreview }))
    ).subscribe();

    const notNull = <T>(value: T | null): value is T => value !== null;
    const notUndefined = <T>(value: T | null): value is T => value !== undefined;
    this.cws.stateMutation$.pipe(
      filter(notNull),
      map(stateMutation => stateMutation.selectedChatPreview),
      filter(notNull),
      filter(notUndefined),
      tap(a => console.log('messages selectChat:', a)),
      concatMap(selectedChatPreview => (
        this.messages.find({ query: { phoneNumber: selectedChatPreview.phoneNumber } }))
      ),
      concatMap(activeChat => this.cws.patchState$({ activeChat }))
    ).subscribe();

  }

  ngOnDestroy() { }

  logOut() {
    return this.authService.logOut();
  }

  toogleSidebar() {
    if (!this.sidebarVisible) {
      this.sidebarVisible = true;
    } else {
      this.sidebarVisible = false;
    }
  }

  openAssistencia(arg: number) {
    const assistenciaID = +arg;
    if (assistenciaID && typeof assistenciaID === 'number' && assistenciaID > 0) {
      this.dashboardSearchBarForm.reset();
      return this.router.navigate(['/dashboard/assistencia', assistenciaID]);
    }
    return alert('valor incorrecto para pesquisa');
  }

}
