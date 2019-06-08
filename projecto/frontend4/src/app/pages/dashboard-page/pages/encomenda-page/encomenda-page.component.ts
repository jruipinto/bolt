import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { tap, concatMap, map, first } from 'rxjs/operators';
import { Observable, merge } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { User } from 'src/app/shared/models';
import { UsersService, UI, UIService } from 'src/app/shared/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-encomenda-page',
  templateUrl: './encomenda-page.component.html',
  styleUrls: ['./encomenda-page.component.scss']
})
export class EncomendaPageComponent implements OnInit, OnDestroy {
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
  public encomendaForm = this.fb.group({
    id: [null],
    artigo_id: [null],
    assistencia_id: [null],
    cliente_user_id: [null],
    observacao: [null],
    estado: [null],
    previsao_entrega: [null],
    orcamento: [null],
    fornecedor: [null],
    qty: [null]
  });

  private clienteChange$ = this.contactoClienteForm.valueChanges
    .pipe(
      tap(() => {
        this.clienteForm.reset();
      }),
      concatMap(({ contacto }) => this.user$(contacto).pipe(
        map((users: User[]) => users.filter((user: User) => user.contacto === +contacto)),
        map((users: User[]) => users[0]),
        tap((cliente: User) => {
          if (cliente) { this.clienteForm.patchValue(cliente); }
        })
      ))
    );

  private user$ = (contacto: number) => this.usersService.find({ query: { contacto } }) as Observable<User[]>;


  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private uiService: UIService
  ) { }

  ngOnInit() {
    merge(
      this.clienteChange$,
      this.uiService.state$
      .pipe(
        first(),
        tap((state: UI) => {
          this.contactoClienteForm.patchValue(state.encomendaPageContactoClienteForm);
          this.clienteForm.patchValue(state.encomendaPageClienteForm);
          this.encomendaForm.patchValue(state.encomendaPageEncomendaForm);
        })
      ),
      this.contactoClienteForm.valueChanges
      .pipe(
        concatMap(value => this.uiService.patchState({ encomendaPageContactoClienteForm: value }))
      ),
    this.clienteForm.valueChanges
      .pipe(
        concatMap(value => this.uiService.patchState({ encomendaPageClienteForm: value }))
      ),
    this.encomendaForm.valueChanges
      .pipe(
        concatMap(value => this.uiService.patchState({ encomendaPageEncomendaForm: value }))
      ),
    )
      .subscribe();
  }

  ngOnDestroy() {
  }

}
