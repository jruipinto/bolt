import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EncomendasService } from 'src/app/shared/state';

@Component({
  selector: 'app-encomendas-criar-nova-page',
  templateUrl: './encomendas-criar-nova-page.component.html',
  styleUrls: ['./encomendas-criar-nova-page.component.scss']
})
export class EncomendasCriarNovaPageComponent implements OnInit {
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
    private fb: FormBuilder,
    private encomendas: EncomendasService
  ) { }

  ngOnInit() {
  }

}
