import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, concatMap, map } from 'rxjs/operators';

import { AuthService } from 'src/app/shared/services';
import { AssistenciasService, UsersService, UIService, UI } from 'src/app/shared/state';
import { PrintService } from 'src/app/pages/dashboard-page/prints';
import { User, Assistencia } from 'src/app/shared/models';
import { capitalize } from 'src/app/shared/utilities';




@Component({
  selector: 'app-assistencias-criar-nova-page',
  templateUrl: './assistencias-criar-nova-page.component.html',
  styleUrls: ['./assistencias-criar-nova-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistenciasCriarNovaPageComponent implements OnInit, OnDestroy {
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
    problema: ['', Validators.required],
    orcamento: [null]
  });
  /*########################################### */
  private clienteChange$ = this.contactoClienteForm.valueChanges.pipe(
    concatMap(({ contacto }) => this.user$(contacto).pipe(
      tap(clienteArr => {
        if (clienteArr.length > 0) {
          this.clienteForm.patchValue(clienteArr[0]);
        } else {
          this.clienteForm.reset();
        }
      })
    ))
  );
  private user$ = (contacto: number) => this.usersService.state$
    .pipe(
      map((users: User[]) => users !== null ? users.filter((user: User) => user.contacto === contacto) : [])
    )
  // private userService$ = (contacto: number) => this.usersService.find({ query: { contacto } }) as Observable<User[]>;


  constructor(
    private fb: FormBuilder,
    private uiService: UIService,
    private usersService: UsersService,
    private assistenciasService: AssistenciasService,
    private printService: PrintService) { }

  ngOnInit() {
    this.clienteChange$.subscribe();
    this.uiService.state$
      .pipe(
        tap((state: UI) => {
          this.contactoClienteForm.patchValue(state.assistenciasCriarNovaPageContactoClienteForm);
          this.clienteForm.patchValue(state.assistenciasCriarNovaPageClienteForm);
          this.criarNovaForm.patchValue(state.assistenciasCriarNovaPageCriarNovaForm);
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.uiService.patchState({
      assistenciasCriarNovaPageContactoClienteForm: this.contactoClienteForm.value,
      assistenciasCriarNovaPageClienteForm: this.clienteForm.value,
      assistenciasCriarNovaPageCriarNovaForm: this.criarNovaForm
    })
      .subscribe();
  }

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
        this.assistenciasService.create(data).pipe(
          tap(() => {
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
        return usersService.patch$(cliente.id, cliente).pipe(
          concatMap(() => assistenciasService.create$(assistencia))
        ).subscribe(success, error);
      } else {
        return usersService.create$({ ...cliente, contacto, ...{ tipo: 'cliente' } }).pipe(
          concatMap(newUserArr => assistenciasService.create$({ ...assistencia, ...{ cliente_user_id: newUserArr[0].id } }))
        ).subscribe(success, error);
      }
    } else {
      return assistenciasService.create$(assistencia).subscribe(success, error);
    }
  }

}
