import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assistencias-pesquisar-modal',
  templateUrl: './assistencias-pesquisar-modal.component.html',
  styleUrls: ['./assistencias-pesquisar-modal.component.scss']
})
export class AssistenciasPesquisarModalComponent implements OnInit {
  /*Parametros de pesquisa:

    id
    cliente_user_id
    cliente_user_name
    cliente_user_contacto
    categoria
    marca
    modelo
    cor
    serial
    problema
    estado
    createdAt
  */

  public filtros = [
    'id',
    'cliente_user_id',
    'cliente_user_name',
    'cliente_user_contacto',
    'categoria',
    'marca',
    'modelo',
    'cor',
    'serial',
    'problema',
    'estado',
    'createdAt'
  ];

  constructor() { }

  ngOnInit() {
  }

}
