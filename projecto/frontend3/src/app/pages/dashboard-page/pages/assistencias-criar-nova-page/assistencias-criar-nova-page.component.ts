import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable} from 'rxjs';
import { tap, concatMap } from 'rxjs/operators';

import { AssistenciasApiService, UsersApiService, AuthService } from 'src/app/shared/services';
import { AssistenciaEntradaPrintService } from 'src/app/pages/dashboard-page/prints/assistencia-entrada-print';
import { User, Assistencia } from 'src/app/shared/models';
import { capitalize } from 'src/app/shared/utilities';




@Component({
  selector: 'app-assistencias-criar-nova-page',
  templateUrl: './assistencias-criar-nova-page.component.html',
  styleUrls: ['./assistencias-criar-nova-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistenciasCriarNovaPageComponent implements OnInit {
  /* Declaration of the 3 Forms on the UI */
  private contactoClienteForm = this.fb.group({
    contacto: [null, Validators.min(200000000)] // por exemplo, contacto: 255486001
  });
  private clienteForm = this.fb.group({
    nome: [null, [Validators.required, Validators.minLength(3)]],
    email: [''],
    endereço: [''],
    nif: [''],
    id: [null]
  });
  private criarNovaForm = this.fb.group({
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
    concatMap(({ contacto }) => this.usersAPI$(contacto).pipe(
      tap(clienteArr => {
        if (clienteArr.length > 0) {
          this.clienteForm.patchValue(clienteArr[0]);
        } else {
          this.clienteForm.reset();
        }
      })
    )

    )
  );
  private usersAPI$ = (contacto: number) => this.usersApiService.find({ query: { contacto } }) as Observable<User[]>;


  constructor(private fb: FormBuilder,
    private usersApiService: UsersApiService,
    private assistenciasApiService: AssistenciasApiService,
    private authService: AuthService,
    private printService: AssistenciaEntradaPrintService) { }

  ngOnInit() {
    this.clienteChange$.subscribe();
  }

  onSubmit() {
    const estado = 'recebido';
    const cliente = this.clienteForm.value;
    const contacto = this.contactoClienteForm.value.contacto;
    const tecnico_user_id = this.authService.getUserId();
    const cliente_user_id = cliente.id;
    const updatedAt = new Date().toLocaleString();
    const processedCriarNovaForm = {
      ...this.criarNovaForm.value,
      marca: capitalize( this.criarNovaForm.value.marca),
      modelo: capitalize( this.criarNovaForm.value.modelo),
      cor: capitalize( this.criarNovaForm.value.cor),
      problema: capitalize( this.criarNovaForm.value.problema)
    };
    const assistencia = {
      ...{
        tecnico_user_id: JSON.stringify([{ tecnico_user_id, estado, updatedAt }]),
        cliente_user_id,
        estado
      },
      ...processedCriarNovaForm
    };
    const assistenciasAPI = {
      create$: (data: Partial<Assistencia>) =>
        this.assistenciasApiService.create(data).pipe(
          tap(() => {
            this.criarNovaForm.reset();
            // you can open print service here!
          }))
    };
    const usersAPI = {
      create$: (data: Partial<User>) => this.usersApiService.create(data),
      patch$: (id: number, data: Partial<User>) => this.usersApiService.patch(id, data)
    };
    const success = (response: Assistencia) => this.printService.print({contacto, ...cliente, ...response[0]});
    const error = err => {
      console.log('Falhou a submissão. Chame o Admin.', err);
      alert ('Falhou a submissão. Chame o Admin. (detalhes: CTRL + SHIFT + I)');
      };

    if (this.clienteForm.dirty) {
      cliente.id
      ? usersAPI.patch$(cliente.id, cliente).pipe(
        concatMap( () => assistenciasAPI.create$(assistencia))
        ).subscribe(success, error)
      : usersAPI.create$({...cliente, contacto, ...{tipo: 'cliente'} }).pipe(
        concatMap( newUserArr => assistenciasAPI.create$({...assistencia, ...{cliente_user_id: newUserArr[0].id}}))
        ).subscribe(success, error);
    } else {
      assistenciasAPI.create$(assistencia).subscribe(success, error);
    }
  }

}
