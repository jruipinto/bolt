import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AssistenciasService, UIService, UsersService } from 'src/app/shared/state';
import { Assistencia, User } from 'src/app/shared';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { clone } from 'ramda';

export interface Query {
  column: string;
  condition: string | number;
}

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencias-pesquisar-page',
  templateUrl: './assistencias-pesquisar-page.component.html',
  styleUrls: ['./assistencias-pesquisar-page.component.scss']
})
export class AssistenciasPesquisarPageComponent implements OnInit, OnDestroy {
  public userSearchModal = false;
  public userSearchResults$: Observable<User[]>;
  public results$: Observable<Assistencia[]>;
  public assistenciasSearchForm = this.fb.group({
    input: [''],
    estado: ['qualquer'],
    cliente: ['']
  });

  public userSearchForm = this.fb.group({
    input: ['']
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
    private users: UsersService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  openAssistencia(assistenciaID: number) {
    return this.router.navigate(['/dashboard/assistencia', assistenciaID]);
  }

  searchUser(input: string) {
    if (input) {
      const inputSplited = input.split(' ');
      const inputMapped = inputSplited.map(word =>
        '{"$or": [' +
        '{ "nome": { "$like": "%' + word + '%" }},' +
        '{ "contacto": { "$like": "%' + word + '%" }}' +
        ' ]}'
      );
      const dbQuery =
        '{' +
        '"query": {' +
        '"$limit": "200",' +
        '"$and": [' +
        inputMapped +
        ']' +
        '}' +
        '}';

      this.userSearchResults$ = this.users
        .find(JSON.parse(dbQuery));
    }
  }

  addUser(user: User) {
    this.assistenciasSearchForm.patchValue({ cliente: clone(user.id) });
    this.userSearchModal = false;
  }

  searchAssistencia(input: string, estado?: string, cliente?: number) {
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

    this.results$ = this.assistencias
      .find(JSON.parse(dbQuery));
  }


}
