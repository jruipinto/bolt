import {
  Component, OnInit, ChangeDetectionStrategy, OnDestroy,
  ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { tap, concatMap, map } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { AssistenciasService, UsersService } from 'src/app/shared/state';
import { PrintService } from 'src/app/pages/dashboard-page/prints';
import { User, Assistencia } from 'src/app/shared/models';
import { capitalize } from 'src/app/shared/utilities';
import { clone } from 'ramda';
import { ClientesPesquisarModalComponent } from 'src/app/pages/dashboard-page/modals';



@AutoUnsubscribe()
@Component({
  selector: 'app-assistencias-criar-nova-page',
  templateUrl: './assistencias-criar-nova-page.component.html',
  styleUrls: ['./assistencias-criar-nova-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistenciasCriarNovaPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('userSearchModalInput', { static: false }) userSearchModalInputEl: ElementRef<HTMLElement>;
  @ViewChild(ClientesPesquisarModalComponent, { static: false }) clientesSearchModal: ClientesPesquisarModalComponent;

  public oldAssists$: Observable<Assistencia[]>;

  /* Declaration of the 3 Forms on the UI */
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
    codigo: [''],
    acessorios: [''],
    problema: ['', Validators.required],
    orcamento: [null]
  });
  /*########################################### */
  private clienteChange$ = this.contactoClienteForm.valueChanges
    .pipe(
      tap(() => {
        this.clienteForm.reset();
        this.oldAssists$ = of();
      }),
      concatMap(({ contacto }) => this.user$(contacto).pipe(
        map((users: User[]) => users.filter((user: User) => user.contacto === +contacto)),
        map((users: User[]) => users[0]),
        tap((cliente: User) => {
          if (cliente) {
            this.clienteForm.patchValue(cliente);
            this.oldAssists$ = this.assistenciasService.find({ query: { cliente_user_id: cliente.id, estado: 'entregue' } });
            setTimeout(() => {
              this.cdr.detectChanges();
            }, 200);
          }
        })
      ))
    );

  private user$ = (contacto: number) => this.usersService.find({ query: { contacto } }) as Observable<User[]>;


  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private assistenciasService: AssistenciasService,
    private printService: PrintService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.clienteChange$.subscribe();
  }

  ngAfterViewInit() {
    this.clientesSearchModal.selectedCliente
      .subscribe(
        (user: User) => this.contactoClienteForm.patchValue({ contacto: clone(user.contacto) })
      );
  }

  ngOnDestroy() { }

  onSubmit() {
    if (this.contactoClienteForm.invalid || this.clienteForm.invalid || this.criarNovaForm.invalid) {
      return alert('Alguns dados obrigatórios em falta!');
    }
    const estado = 'recebido';
    const cliente = clone(this.clienteForm.value);
    const contacto = clone(this.contactoClienteForm.value.contacto);
    const equipment = capitalize(clone(this.criarNovaForm.value));
    const assistencia: Partial<Assistencia> = {
      estado,
      cliente_user_id: cliente.id,
      categoria: equipment.categoria,
      marca: equipment.marca,
      modelo: equipment.modelo,
      cor: equipment.cor,
      serial: equipment.serial,
      problema: equipment.problema +
        (equipment.acessorios ? ` - Acessórios: ${equipment.acessorios}` : '') +
        (equipment.codigo ? ` - Código: ${equipment.codigo}` : ''),
      orcamento: equipment.orcamento
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
      }
      return usersService.create$({ ...cliente, contacto, ...{ tipo: 'cliente' } })
        .pipe(
          // refresh contacto form to fix bug when creating new user
          tap((newUserArr: User[]) => this.contactoClienteForm.patchValue({ contacto: newUserArr[0].contacto })),
          concatMap((newUserArr: User[]) => assistenciasService.create$({ ...assistencia, ...{ cliente_user_id: newUserArr[0].id } })))
        .subscribe(success, error);
    }
    return assistenciasService.create$(assistencia)
      .subscribe(success, error);
  }

  copyToCriarNovaForm(assistencia: Assistencia) {
    this.criarNovaForm.patchValue(assistencia);
    this.criarNovaForm.patchValue({
      problema: `(Ficha anterior: ${assistencia.id}) `,
      orcamento: null
    });
  }

}
