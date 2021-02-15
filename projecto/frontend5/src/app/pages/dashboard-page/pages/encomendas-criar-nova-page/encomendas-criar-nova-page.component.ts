import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { tap, concatMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { User, Encomenda, Artigo } from 'src/app/shared/models';
import {
  UsersService,
  EncomendasService,
  ArtigosService,
} from 'src/app/shared/state';
import clone from 'ramda/es/clone';
import { ClientesPesquisarModalComponent } from 'src/app/pages/dashboard-page/modals';
import { FocusMonitor } from '@angular/cdk/a11y';

@AutoUnsubscribe()
@Component({
  selector: 'app-encomendas-criar-nova-page',
  templateUrl: './encomendas-criar-nova-page.component.html',
  styleUrls: ['./encomendas-criar-nova-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncomendasCriarNovaPageComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('artigoSearchModalInput')
  artigoSearchModalInputEl: ElementRef<HTMLElement>;
  @ViewChild('userSearchModalInput')
  userSearchModalInputEl: ElementRef<HTMLElement>;
  @ViewChild(ClientesPesquisarModalComponent)
  clientesSearchModal: ClientesPesquisarModalComponent;

  public artigoSearchModalOpened = false;
  public artigoSearchResults$: Observable<Artigo[]>;

  public artigoSearchForm = this.fb.group({
    input: [null],
  });
  public contactoClienteForm = this.fb.group({
    contacto: [null, [Validators.required]], // por exemplo, contacto: 255486001
  });
  public clienteForm = this.fb.group({
    nome: [null, [Validators.required]],
    email: [''],
    endereço: [''],
    nif: [''],
    id: [null],
  });
  public artigo: Artigo;
  public artigoForm = this.fb.group({
    id: [null],
    marca: [null],
    modelo: [null],
    descricao: [null],
    localizacao: [null],
    qty: [null],
    preco: [null],
    pvp: [null],
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
    qty: [null, [Validators.required]],
  });

  private clienteChange$ = this.contactoClienteForm.valueChanges.pipe(
    tap(() => {
      this.clienteForm.reset();
      this.encomendaForm.patchValue({ cliente_user_id: null });
    }),
    concatMap(({ contacto }) =>
      this.user$(contacto).pipe(
        map((users: User[]) =>
          users.filter((user: User) => user.contacto === +contacto)
        ),
        map((users: User[]) => users[0]),
        tap((cliente: User) => {
          if (cliente) {
            this.clienteForm.patchValue(cliente);
            this.encomendaForm.patchValue({ cliente_user_id: cliente.id });
          }
        })
      )
    )
  );

  private user$ = (contacto: number) =>
    this.users.find({ query: { contacto } }) as Observable<User[]>;

  constructor(
    private fb: FormBuilder,
    private users: UsersService,
    private encomendas: EncomendasService,
    private artigos: ArtigosService,
    private focusMonitor: FocusMonitor
  ) {}

  ngOnInit() {
    this.clienteChange$.subscribe();
  }

  ngAfterViewInit() {
    this.encomendaForm.patchValue({ artigo_id: this.artigoForm.value.id });
    this.clientesSearchModal.selectedCliente.subscribe((user: User) =>
      this.contactoClienteForm.patchValue({ contacto: clone(user.contacto) })
    );
  }

  ngOnDestroy() {}

  createEncomenda(arg: Encomenda) {
    if (
      this.encomendaForm.invalid ||
      this.contactoClienteForm.invalid ||
      this.clienteForm.invalid
    ) {
      return alert('Alguns dados obrigatórios em falta!');
    }
    const encomenda = { ...clone(arg), estado: 'registada' };
    const success = () => {
      this.artigoForm.reset();
      this.encomendaForm.reset();
      alert('Sucesso!');
    };
    const error = (err) => {
      console.log('Falhou a submissão. Chame o Admin.', err);
      alert('Falhou a submissão. Chame o Admin. (detalhes: CTRL + SHIFT + I)');
    };

    if (this.clienteForm.dirty) {
      if (this.clienteForm.value.id) {
        return this.users
          .patch(this.clienteForm.value.id, this.clienteForm.value)
          .pipe(concatMap(() => this.encomendas.create(encomenda)))
          .subscribe(success, error);
      } else {
        return this.users
          .create({
            ...this.clienteForm.value,
            contacto: this.contactoClienteForm.value.contacto,
            ...{ tipo: 'cliente' },
          })
          .pipe(
            map((newUserArr: User[]) => newUserArr[0]),
            // refresh contacto form to fix bug when creating new user
            tap((newUser: User) =>
              this.contactoClienteForm.patchValue({
                contacto: newUser.contacto,
              })
            ),
            concatMap((newUser: User) =>
              this.encomendas.create({
                ...encomenda,
                ...{ cliente_user_id: newUser.id },
              })
            )
          )
          .subscribe(success, error);
      }
    } else {
      return this.encomendas.create(encomenda).subscribe(success, error);
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

  searchArtigo(input?: string) {
    if (input) {
      const inputSplited = input.split(' ');
      const inputMapped = inputSplited.map(
        (word) =>
          '{"$or": [' +
          '{ "marca": { "$like": "%' +
          word +
          '%" }},' +
          '{ "modelo": { "$like": "%' +
          word +
          '%" }},' +
          '{ "descricao": { "$like": "%' +
          word +
          '%" }}' +
          ' ]}'
      );
      const dbQuery =
        '{' +
        '"query": {' +
        '"$sort": { "marca": "1", "modelo": "1",  "descricao": "1"},' +
        '"$limit": "200",' +
        '"$and": [' +
        inputMapped +
        ']' +
        '}' +
        '}';

      this.artigoSearchResults$ = this.artigos.find(JSON.parse(dbQuery));
    }
  }

  addArtigo(artigoInStock: Artigo) {
    this.encomendaForm.patchValue({ artigo_id: artigoInStock.id });
    this.artigoForm.patchValue(artigoInStock);
    this.artigoSearchModalOpened = false;
  }

  openArtigoSearchModal() {
    this.artigoSearchModalOpened = true;
    setTimeout(
      () =>
        this.focusMonitor.focusVia(this.artigoSearchModalInputEl, 'program'),
      0.1
    );
  }
}
