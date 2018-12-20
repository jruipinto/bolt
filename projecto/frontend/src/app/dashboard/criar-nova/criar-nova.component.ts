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

  private cliente: any; // objecto
  private estado: string;
  private query: object; //payload que vamos enviar ao backend
                        // https://docs.feathersjs.com/api/databases/common.html#adapterfindparams

  
  contactoClienteForm = this.fb.group({
    // por exemplo, contacto: 255486001
    contacto: [null, Validators.min(200000000)]
  });

  clienteForm = this.fb.group({
    nome: ['', Validators.required],
    email: [''],
    endereço: [''],
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

  listenToMyFormsChanges(): void {
    this.contactoClienteForm.valueChanges.subscribe(() => {
      if (this.contactoClienteForm.invalid) { this.clienteForm.patchValue({nome: '', email: '', endereco: '', nif: ''}); return; }

      // this.query é o payload que vamos enviar ao backend
      // https://docs.feathersjs.com/api/databases/common.html#adapterfindparams
      this.query = {query:
        {
        contacto: this.contactoClienteForm.value.contacto
        }
      };

      this.dataService.find$('users', this.query).subscribe(resposta => {
        if (resposta.data[0]) {
          this.clienteForm.patchValue(resposta.data[0]);
          this.cliente = resposta.data[0];
        }
      });
    });
  }

  onSubmit() {
    this.estado = 'recebido';
    const agora = new Date();
    const tecnico_JSON: string = JSON.stringify([{
      tecnico_user_id: this.authService.getUserId(),
      estado: this.estado,
      updatedAt: agora.toLocaleString()
    }]);

    this.query = {
      tecnico_user_id: tecnico_JSON,
      cliente_user_id: this.cliente.id,
      estado: this.estado
    };

    Object.assign(this.query, this.criarNovaForm.value);
    this.dataService.create$('assistencias', this.query);

    if (this.clienteForm.dirty) {
      console.log(this.clienteForm.value);
      this.dataService.patch$('users', this.clienteForm.value, this.cliente.id);
    }
  }

  ngOnInit() {
    this.listenToMyFormsChanges();
  }

}
