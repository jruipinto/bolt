import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-criar-nova',
  templateUrl: './criar-nova.component.html',
  styleUrls: ['./criar-nova.component.scss']
})
export class CriarNovaComponent implements OnInit {

  private cliente_user_id: number;
  private tecnico_user_id: number;
  private tecnico_id_JSON: object;
  private estado = 'em análise';

  contactoClienteForm = this.fb.group({
    contacto: [null, Validators.min(200000000)]
  });

  clienteForm = this.fb.group({
    nome: ['', Validators.required],
    email: [''],
    endereco: [''],
    nif: ['']
  });

  criarNovaForm = this.fb.group({
    categoria: ['', Validators.required],
    marca: [''],
    modelo: [''],
    cor: ['', Validators.required],
    serial: [''],
    problema: ['', Validators.required],
    orcamento: [null]
  });


  constructor(private fb: FormBuilder, private dataService: DataService, private authService: AuthService) { }

  onChanges(): void {
    this.contactoClienteForm.valueChanges.subscribe(val => {
      if (this.contactoClienteForm.invalid) { this.clienteForm.patchValue({nome: '', email: '', endereco: '', nif: ''}); return; }

      const myQuery: object = {query:
        {
        contacto: this.contactoClienteForm.value.contacto
        }
      };

      this.dataService.find$('users', myQuery).subscribe(resposta => {
        console.log(resposta.data[0]);
        console.log(this.clienteForm.value);
        if (resposta.data[0]) {
          this.clienteForm.patchValue(resposta.data[0]);
          this.cliente_user_id = resposta.data[0].id;
        }
      });

      /*this.dataService.find$('users', myQuery).subscribe({
        next(resposta) {
          console.log(resposta.data[0].nome);
          console.log(copiaClienteForm);

          this.clienteForm.value.nome = resposta.data[0].nome;
          this.clienteForm.value.email = resposta.data[0].email;
          this.clienteForm.value.endereço = resposta.data[0].endereço;
          this.clienteForm.value.nif = resposta.data[0].nif;

        },
        complete() {
          console.log('nao foram encontrados mais registos');
        },
        error(err) {
          console.log('erro = ' + err);
        }
      });*/

    });
  }

  ngOnInit() {
    this.onChanges();
  }

  onSubmit() {
    console.log(this.criarNovaForm.status);
    console.log(this.criarNovaForm.value);

    const agora = new Date();
    const tecnico_JSON: string = JSON.stringify([{
      tecnico_user_id: this.authService.getUserId(),
      estado: this.estado,
      updatedAt: agora.toLocaleString()
    }]);

    const myObj: object = {
      tecnico_user_id: tecnico_JSON,
      cliente_user_id: this.cliente_user_id,
      estado: this.estado
    };
    Object.assign(myObj, this.criarNovaForm.value);
    console.log(myObj);

    this.dataService.create$('assistencias', myObj);
  }

}
