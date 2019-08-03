import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { tap, concatMap, map, first } from 'rxjs/operators';
import { Observable, merge } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { User, Encomenda } from 'src/app/shared/models';
import { UsersService, UI, UIService, EncomendasService } from 'src/app/shared/state';
import { ActivatedRoute, ParamMap } from '@angular/router';
import clone from 'ramda/es/clone';

@AutoUnsubscribe()
@Component({
  selector: 'app-encomendas-criar-nova-page',
  templateUrl: './encomendas-criar-nova-page.component.html',
  styleUrls: ['./encomendas-criar-nova-page.component.scss']
})
export class EncomendasCriarNovaPageComponent implements OnInit, OnDestroy {
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
  public artigoForm = this.fb.group({
    id: [null],
    marca: [null],
    modelo: [null],
    descricao: [null],
    localizacao: [null],
    qty: [null],
    preco: [null],
    pvp: [null]
  });
  public encomendaForm = this.fb.group({
    id: [null],
    artigo_id: [null, [Validators.required]],
    assistencia_id: [null],
    cliente_user_id: [null],
    observacao: [null],
    estado: [null],
    previsao_entrega: [null, [Validators.required]],
    orcamento: [null],
    fornecedor: [null],
    qty: [null, [Validators.required]]
  });

  private clienteChange$ = this.contactoClienteForm.valueChanges
    .pipe(
      tap(() => {
        this.clienteForm.reset();
        this.encomendaForm.patchValue({ cliente_user_id: null });
      }),
      concatMap(({ contacto }) => this.user$(contacto).pipe(
        map((users: User[]) => users.filter((user: User) => user.contacto === +contacto)),
        map((users: User[]) => users[0]),
        tap((cliente: User) => {
          if (cliente) {
            this.clienteForm.patchValue(cliente);
            this.encomendaForm.patchValue({ cliente_user_id: cliente.id });
          }
        })
      ))
    );

  private user$ = (contacto: number) => this.users.find({ query: { contacto } }) as Observable<User[]>;


  constructor(
    private fb: FormBuilder,
    private users: UsersService,
    private encomendas: EncomendasService,
    private uiService: UIService,
    private route: ActivatedRoute
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
            this.artigoForm.patchValue(state.encomendaPageArtigoForm);
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
      this.artigoForm.valueChanges
        .pipe(
          concatMap(value => this.uiService.patchState({ encomendaPageArtigoForm: value }))
        ),
      this.encomendaForm.valueChanges
        .pipe(
          concatMap(value => this.uiService.patchState({ encomendaPageEncomendaForm: value }))
        )
    )
      .subscribe();
    this.encomendaForm.patchValue({ artigo_id: this.artigoForm.value.id });
  }

  ngOnDestroy() {
  }

  createEncomenda(arg: Encomenda) {
    if (this.encomendaForm.invalid || this.contactoClienteForm.invalid || this.clienteForm.invalid) {
      return alert('Alguns dados obrigatórios em falta!');
    }
    const encomenda = { ...clone(arg), estado: 'registada' };
    const success = () => {
      this.artigoForm.reset();
      this.encomendaForm.reset();
      alert('Sucesso!');
    };
    const error = err => {
      console.log('Falhou a submissão. Chame o Admin.', err);
      alert('Falhou a submissão. Chame o Admin. (detalhes: CTRL + SHIFT + I)');
    };

    if (this.clienteForm.dirty) {
      if (this.clienteForm.value.id) {
        return this.users.patch(this.clienteForm.value.id, this.clienteForm.value)
          .pipe(concatMap(() => this.encomendas.create(encomenda)))
          .subscribe(success, error);
      } else {
        return this.users.create({
          ...this.clienteForm.value,
          contacto: this.contactoClienteForm.value.contacto,
          ...{ tipo: 'cliente' }
        })
          .pipe(
            map((newUserArr: User[]) => newUserArr[0]),
            // refresh contacto form to fix bug when creating new user
            tap((newUser: User) => this.contactoClienteForm.patchValue({ contacto: newUser.contacto })),
            concatMap((newUser: User) => this.encomendas.create({ ...encomenda, ...{ cliente_user_id: newUser.id } })))
          .subscribe(success, error);
      }
    } else {
      return this.encomendas.create(encomenda)
        .subscribe(success, error);
    }
  }

  /*
    createEncomenda(encomenda: Encomenda) {
    return this.encomendasService.create({...encomenda, estado: 'registada'})
      .subscribe(
        () => {
          this.artigoForm.reset();
          this.encomendaForm.reset();
          alert('Sucesso!');
        },
        error => alert(error)
      );
    }
  */

}
