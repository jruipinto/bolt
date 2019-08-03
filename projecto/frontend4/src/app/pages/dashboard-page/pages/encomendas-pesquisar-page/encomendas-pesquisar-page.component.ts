import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable, concat } from 'rxjs';
import { Encomenda, Query, User, Artigo } from 'src/app/shared';
import { EncomendasService, UsersService, UIService, ArtigosService } from 'src/app/shared/state';
import { map, tap, concatMap, toArray } from 'rxjs/operators';
import { clone } from 'ramda';

@AutoUnsubscribe()
@Component({
  selector: 'app-encomendas-pesquisar-page',
  templateUrl: './encomendas-pesquisar-page.component.html',
  styleUrls: ['./encomendas-pesquisar-page.component.scss']
})
export class EncomendasPesquisarPageComponent implements OnInit, OnDestroy {
  public loading = false;
  public userSearchModal = false;
  public userSearchResults$: Observable<User[]>;
  public results: Encomenda[];
  public encomendasSearchForm = this.fb.group({
    input: [''],
    estado: ['qualquer'],
    cliente: ['']
  });

  public userSearchForm = this.fb.group({
    input: ['']
  });

  public estados = [
    'qualquer',
    'registada',
    'marcada para ir ao fornecedor',
    'adquirida',
    'esgotada',
    'sem fornecedor',
    'aguarda reposta de fornecedor',
    'aguarda entrega',
    'recebida',
    'detectado defeito',
    'entregue'
  ];

  constructor(
    private encomendas: EncomendasService,
    private artigos: ArtigosService,
    private users: UsersService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  openEncomenda(encomendaID: number) {
    return this.router.navigate(['/dashboard/encomenda', encomendaID]);
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
    this.encomendasSearchForm.patchValue({ cliente: clone(user.id) });
    this.userSearchModal = false;
  }

  /*searchEncomenda(input: string, estado?: string, cliente?: number) {
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

    this.results$ = this.encomendas
      .find(JSON.parse(dbQuery));
  }*/

  searchEncomenda(input: string, estado?: string, cliente?: number) {
    this.loading = true;
    const inputSplited = input.split(' ');
    const inputMapped = inputSplited.map(word =>
      '{"$or": [' +
      '{ "marca": { "$like": "%' + word + '%" }},' +
      '{ "modelo": { "$like": "%' + word + '%" }},' +
      '{ "descricao": { "$like": "%' + word + '%" }}' +
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

    if ((!input || input === ' ' || input === '  ') && estado === 'qualquer' && !cliente) {
      return this.encomendas.find({ query: { $limit: 200 } })
        .subscribe(encomendas => {
          this.loading = false;
          this.results = encomendas;
        });
    }
    if ((!input || input === ' ' || input === '  ') && estado === 'qualquer' && cliente) {
      return this.encomendas.find({ query: { cliente_user_id: cliente, $limit: 200 } })
        .subscribe(encomendas => {
          this.loading = false;
          this.results = encomendas;
        });
    }

    return this.artigos
      .find(JSON.parse(dbQuery))
      .pipe(
        concatMap(
          (artigosDB: Artigo[]) => concat(artigosDB.map(
            ({ id }) => this.encomendas.find({ query: { artigo_id: id } })
              .pipe(map(res => res[0]))
          )).pipe(concatMap(concats => concats), toArray())
        )
      )
      .subscribe(encomendas => {
        this.loading = false;
        this.results = encomendas;
      });
    // this.results$ = this.encomendas.find(JSON.parse(dbQuery));
  }


}
