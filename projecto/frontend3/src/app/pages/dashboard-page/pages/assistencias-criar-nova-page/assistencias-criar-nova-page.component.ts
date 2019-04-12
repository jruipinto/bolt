import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, from, of } from 'rxjs';
import { tap, map, concatMap, mergeMap } from 'rxjs/operators';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models';
import { UsersApiService } from 'src/app/shared/services/users-api.service';
import { AssistenciasApiService } from 'src/app/shared';
import { iif } from '@ngxs/store/operators';


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
    nome: ['', Validators.required],
    email: [''],
    endereço: [''],
    nif: ['']
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
  private cliente: User;
  private clienteChange$ = this.contactoClienteForm.valueChanges.pipe(
    concatMap(({ contacto }) => this.usersAPI$(contacto).pipe(
      tap(clienteArr => {
        if (clienteArr.length > 0) {
          this.clienteForm.patchValue(clienteArr[0]);
          this.cliente = clienteArr[0];
        } else {
          this.clienteForm.reset();
        }
      })
    )

    )
  );
  private usersAPI$ = (contacto: number) => this.usersApiService.find({ query: { contacto } }) as Observable<User[]>;


  constructor(private fb: FormBuilder, private dataService: DataService,
    private usersApiService: UsersApiService, private assistenciasApiService: AssistenciasApiService, private authService: AuthService) { }

  ngOnInit() {
    this.clienteChange$.subscribe();
  }

  onSubmit() {
    const estado = 'recebido';
    const tecnico_user_id = this.authService.getUserId();
    const cliente_user_id = this.cliente.id;
    const updatedAt = new Date().toLocaleString();
    const assistenciasAPI$ = {
      create: (data) =>
        this.assistenciasApiService.create(data).pipe(
          tap(() => {
            this.criarNovaForm.reset();
            if (this.clienteForm.dirty) { this.usersApiService.patch(this.cliente.id, this.clienteForm.value); }
          }))
    };
    const assistencia = {
      ...{
        tecnico_user_id: JSON.stringify([{ tecnico_user_id, estado, updatedAt }]),
        cliente_user_id,
        estado: estado
      },
      ...this.criarNovaForm.value
    };

    assistenciasAPI$.create(assistencia).subscribe(
      () => alert('Submetido'),
      err => {
        console.log('Falhou a submissão. Chame o Admin.', err);
        alert ('Falhou a submissão. Chame o Admin. (detalhes: CTRL + SHIFT + I)');
        }
    );
  }

}
