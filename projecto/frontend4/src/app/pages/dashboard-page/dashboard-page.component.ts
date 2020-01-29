import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, merge, of, concat } from 'rxjs';
import { map, tap, concatMap, filter, mergeMap, first } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AuthService, MessagesApiService } from 'src/app/shared';
import { UI, UIService, AssistenciasService, ArtigosService, EncomendasService, UsersService, MessagesService } from 'src/app/shared/state';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { uniqBy } from 'ramda';
import { CwStateService, CwState } from 'src/app/shared/components/chat-widget/services/cw-state.service';

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
    private messages: MessagesApiService,
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

    // retrives last chats for chat-widget
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

    // on opening the selected chat retrieves the last messages of the chat
    const notNull = <T>(value: T | null): value is T => value !== null;
    const notUndefined = <T>(value: T | null): value is T => value !== undefined;
    this.cws.stateMutation$.pipe(
      filter(notNull),
      map(stateMutation => stateMutation.selectedChatPreview),
      filter(notNull),
      filter(notUndefined),
      concatMap(selectedChatPreview => (
        this.messages.find({ query: { phoneNumber: selectedChatPreview.phoneNumber } }))
      ),
      concatMap(activeChat => this.cws.patchState$({ activeChat }))
    ).subscribe();

    // on opening the selected chat detects 'unread' messages and patchs them to 'read'
    this.cws.stateMutation$.pipe(
      filter(notNull),
      map(stateMutation => stateMutation.activeChat),
      filter(notNull),
      filter(notUndefined),
      map(activeChat => activeChat.filter(msg => msg.state === 'unread')),
      concatMap(unreadMessages => {
        if (!unreadMessages) {
          return of(null);
        }
        return concat(
          unreadMessages.map(msg => this.messages.patch(msg.id, { state: 'read' }))
        );
      })
    ).subscribe();

    // on created messages
    let patchedMsg;
    this.messages.onPatched().pipe(
      map(a => a[0]),
      tap(msg => patchedMsg = msg),
      concatMap(() => this.cws.state$),
      first(),
      filter(notNull),
      filter(notUndefined),
      map((state): CwState => ({ ...state, activeChat: state.activeChat.map(msg => msg.id === patchedMsg.id ? patchedMsg : msg) })),
      map((state): CwState => ({ ...state, chatsPreview: state.chatsPreview.map(msg => msg.id === patchedMsg.id ? patchedMsg : msg) })),
      tap(a => console.log('state after patch: ', a)),
      concatMap(state => this.cws.patchState$(state))
    ).subscribe();

    // on created messages
    let createdMsg;
    this.messages.onCreated().pipe(
      map(a => a[0]),
      tap(msg => createdMsg = msg),
      concatMap(() => this.cws.state$),
      first(),
      filter(notNull),
      filter(notUndefined),
      map(state => ({
        ...state,
        chatsPreview: { createdMsg, ...state.chatsPreview },
        activeChat: { createdMsg, ...state.activeChat },
      })),
      concatMap(state => this.cws.patchState$(state))
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
