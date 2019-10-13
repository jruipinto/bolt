import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { clone } from 'ramda';
import { AssistenciasService } from 'src/app/shared/state';
import { Assistencia, User } from 'src/app/shared';
import { ClientesPesquisarModalComponent } from 'src/app/pages/dashboard-page/modals';


@AutoUnsubscribe()
@Component({
  selector: 'app-assistencias-pesquisar-page',
  templateUrl: './assistencias-pesquisar-page.component.html',
  styleUrls: ['./assistencias-pesquisar-page.component.scss']
})
export class AssistenciasPesquisarPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('userSearchModalInput', { static: false }) userSearchModalInputEl: ElementRef<HTMLElement>;
  @ViewChild(ClientesPesquisarModalComponent, { static: false }) clientesSearchModal: ClientesPesquisarModalComponent;
  public loading = false;
  public results: Assistencia[];

  public assistenciasSearchForm = this.fb.group({
    input: [''],
    estado: ['qualquer'],
    cliente: ['']
  });

  public estados = [
    'qualquer',
    'registado',
    'em transito',
    'recebido',
    'em análise',
    'contacto pendente',
    'não atendeu p/ cont.',
    'cliente adiou resp.',
    'contactado',
    'incontactável',
    'orçamento pendente',
    'não atendeu p/ orç.',
    'cliente adiou orç.',
    'orçamento aprovado',
    'orçamento recusado',
    'aguarda material',
    'material recebido',
    'concluído',
    'entregue'
  ];

  constructor(
    private assistencias: AssistenciasService,
    private router: Router,
    private fb: FormBuilder) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.clientesSearchModal.selectedCliente
      .subscribe(
        (user: User) => this.assistenciasSearchForm.patchValue({ cliente: clone(user.id) })
      );
  }

  ngOnDestroy() {
  }

  openAssistencia(assistenciaID: number) {
    return this.router.navigate(['/dashboard/assistencia', assistenciaID]);
  }

  searchAssistencia(input: string, estado?: string, cliente?: number) {
    this.loading = true;
    const inputSplited = input.split(' ');
    const inputMapped = inputSplited.map(word =>
      '{"$or": [' +
      '{ "categoria": { "$like": "%' + word + '%" }},' +
      '{ "marca": { "$like": "%' + word + '%" }},' +
      '{ "modelo": { "$like": "%' + word + '%" }},' +
      '{ "cor": { "$like": "%' + word + '%" }},' +
      '{ "serial": { "$like": "%' + word + '%" }},' +
      '{ "problema": { "$like": "%' + word + '%" }}' +
      ' ]}'
    );

    const clienteStatement = cliente && typeof cliente === 'number' ? ',"cliente_user_id":' + cliente : '';
    const estadoStatement = estado && estado !== 'qualquer' ? ',"estado": "' + estado + '"' : '';
    const dbQuery =
      '{' +
      '"query": {' +
      '"$limit": "200",' +
      '"$and": [' +
      inputMapped +
      ']' +
      estadoStatement +
      clienteStatement +
      '}' +
      '}';

    return this.assistencias
      .find(JSON.parse(dbQuery))
      .subscribe(assistencias => {
        this.loading = false;
        this.results = assistencias;
      });
  }

}
