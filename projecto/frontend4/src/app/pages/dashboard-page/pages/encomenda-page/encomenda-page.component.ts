import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

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

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
