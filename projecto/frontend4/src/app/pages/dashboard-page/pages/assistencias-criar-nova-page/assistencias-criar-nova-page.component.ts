import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, merge, of, iif, defer } from 'rxjs';
import { tap, concatMap, map, first, switchMap, mergeMap } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { AssistenciasService, UsersService, UIService, UI } from 'src/app/shared/state';
import { PrintService } from 'src/app/pages/dashboard-page/prints';
import { User, Assistencia } from 'src/app/shared/models';
import { capitalize } from 'src/app/shared/utilities';
import clone from 'ramda/es/clone';



@AutoUnsubscribe()
@Component({
  selector: 'app-assistencias-criar-nova-page',
  templateUrl: './assistencias-criar-nova-page.component.html',
  styleUrls: ['./assistencias-criar-nova-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistenciasCriarNovaPageComponent implements OnInit, OnDestroy {

  public userSearchModal = false;
  public userSearchResults: User[];
  public oldAssists: Assistencia[] = [];

  /* Declaration of the 3+1 Forms on the UI */
  public userSearchForm = this.fb.group({
    input: [null]
  });
  public contactoClienteForm = this.fb.group({
    contacto: [null, Validators.min(200000000)] // por exemplo, contacto: 255486001
  });
  public clienteForm = this.fb.group({
    nome: [null, [Validators.required, Validators.minLength(3)]],
    email: [''],
    endereço: [''],
    nif: [''],
    id: [null]
  });
  public criarNovaForm = this.fb.group({
    categoria: ['', Validators.required],
    marca: [''],
    modelo: [''],
    cor: ['', Validators.required],
    serial: [''],
    problema: ['', Validators.required],
    orcamento: [null]
  });
  /*########################################### */
  private clienteChange$ = this.contactoClienteForm.valueChanges
    .pipe(
      tap(() => {
        this.clienteForm.reset();
        this.oldAssists = [];
      }),
      concatMap(({ contacto }) => this.user$(contacto).pipe(
        map((users: User[]) => users.filter((user: User) => user.contacto === +contacto)),
        map((users: User[]) => users[0]),
        mergeMap((cliente: User) => {
          if (cliente) {
            return this.assistenciasService.find({ query: { cliente_user_id: cliente.id, estado: 'entregue' } })
              .pipe(
                tap((oldAssists: Assistencia[]) => {
                  this.clienteForm.patchValue(cliente);
                  this.oldAssists = oldAssists;
                })
              );
          } else {
            return of();
          }
        })
      ))
    );

  private user$ = (contacto: number) => this.usersService.find({ query: { contacto } }) as Observable<User[]>;


  constructor(
    private fb: FormBuilder,
    private uiService: UIService,
    private usersService: UsersService,
    private assistenciasService: AssistenciasService,
    private printService: PrintService) { }

  ngOnInit() {
    merge(
      this.clienteChange$,
      this.uiService.state$
        .pipe(
          first(),
          tap((state: UI) => {
            this.contactoClienteForm.patchValue(state.assistenciasCriarNovaPageContactoClienteForm);
            this.clienteForm.patchValue(state.assistenciasCriarNovaPageClienteForm);
            this.criarNovaForm.patchValue(state.assistenciasCriarNovaPageCriarNovaForm);
          })
        ),
      this.contactoClienteForm.valueChanges
        .pipe(
          concatMap(value => this.uiService.patchState({ assistenciasCriarNovaPageContactoClienteForm: value }))
        ),
      this.clienteForm.valueChanges
        .pipe(
          concatMap(value => this.uiService.patchState({ assistenciasCriarNovaPageClienteForm: value }))
        ),
      this.criarNovaForm.valueChanges
        .pipe(
          concatMap(value => this.uiService.patchState({ assistenciasCriarNovaPageCriarNovaForm: value }))
        ),
    )
      .subscribe();
  }

  ngOnDestroy() { }

  onSubmit() {
    const estado = 'recebido';
    const cliente = this.clienteForm.value;
    const contacto = this.contactoClienteForm.value.contacto;
    const assistencia: Assistencia = {
      estado,
      cliente_user_id: cliente.id,
      ...capitalize(this.criarNovaForm.value)
    };
    const assistenciasService = {
      create$: (data: Partial<Assistencia>) =>
        this.assistenciasService.create(data)
          .pipe(tap(() => {
            this.criarNovaForm.reset();
            // you can open print service here!
          }))
    };
    const usersService = {
      create$: (data: Partial<User>) => this.usersService.create(data),
      patch$: (id: number, data: Partial<User>) => this.usersService.patch(id, data)
    };
    const success = (response: Assistencia[]) => this.printService.printAssistenciaEntrada(response[0]);
    const error = err => {
      console.log('Falhou a submissão. Chame o Admin.', err);
      alert('Falhou a submissão. Chame o Admin. (detalhes: CTRL + SHIFT + I)');
    };

    if (this.clienteForm.dirty) {
      if (cliente.id) {
        return usersService.patch$(cliente.id, cliente)
          .pipe(concatMap(() => assistenciasService.create$(assistencia)))
          .subscribe(success, error);
      } else {
        return usersService.create$({ ...cliente, contacto, ...{ tipo: 'cliente' } })
          .pipe(
            // refresh contacto form to fix bug when creating new user
            tap((newUserArr: User[]) => this.contactoClienteForm.patchValue({ contacto: newUserArr[0].contacto })),
            concatMap((newUserArr: User[]) => assistenciasService.create$({ ...assistencia, ...{ cliente_user_id: newUserArr[0].id } })))
          .subscribe(success, error);
      }
    } else {
      return assistenciasService.create$(assistencia)
        .subscribe(success, error);
    }
  }

  copyToCriarNovaForm(assistencia: Assistencia) {
    this.criarNovaForm.patchValue(assistencia);
    this.criarNovaForm.patchValue({
      problema: `(Ficha anterior: ${assistencia.id}) `,
      orcamento: null
    });
  }

  searchUser(userName: string) {
    const condition = JSON.parse('"%' + userName + '%"');
    this.usersService.find({ query: { $limit: 200, nome: { $like: condition } } })
      .subscribe((results: User[]) => this.userSearchResults = clone(results));
  }

  addUser(user: User) {
    this.contactoClienteForm.patchValue({contacto: clone(user.contacto)});
  }
}
