import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { concat } from 'rxjs';
import { concatMap, reduce } from 'rxjs/operators';
import { Encomenda, User, Artigo } from 'src/app/shared';
import { EncomendasService, ArtigosService } from 'src/app/shared/state';
import { clone } from 'ramda';
import { ClientesPesquisarModalComponent } from 'src/app/pages/dashboard-page/modals';

@AutoUnsubscribe()
@Component({
  selector: 'app-encomendas-pesquisar-page',
  templateUrl: './encomendas-pesquisar-page.component.html',
  styleUrls: ['./encomendas-pesquisar-page.component.scss']
})
export class EncomendasPesquisarPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('userSearchModalInput', { static: false }) userSearchModalInputEl: ElementRef<HTMLElement>;
  @ViewChild(ClientesPesquisarModalComponent, { static: false }) clientesSearchModal: ClientesPesquisarModalComponent;

  public loading = false;
  public results: Encomenda[];
  public encomendasSearchForm = this.fb.group({
    input: [''],
    estado: ['qualquer'],
    cliente: ['']
  });

  public estados = [
    'qualquer',
    'registada',
    'marcada para ir ao fornecedor',
    'adquirida',
    'esgotada',
    'sem fornecedor',
    'aguarda resposta de fornecedor',
    'aguarda entrega',
    'recebida',
    'detectado defeito',
    'entregue'
  ];

  constructor(
    private encomendas: EncomendasService,
    private artigos: ArtigosService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.clientesSearchModal.selectedCliente
      .subscribe(
        (user: User) => this.encomendasSearchForm.patchValue({ cliente: clone(user.id) })
      );
  }

  ngOnDestroy() {
  }

  openEncomenda(encomendaID: number) {
    return this.router.navigate(['/dashboard/encomenda', encomendaID]);
  }

  searchEncomenda(input: string, estado?: string, cliente_user_id?: number) {
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
      JSON.parse(
        '{' +
        '"query": {' +
        '"$limit": "200",' +
        '"$and": [' +
        inputMapped +
        ']' +
        '}' +
        '}'
      );

    if ((!input || input === ' ' || input === '  ') && estado === 'qualquer' && !cliente_user_id) {
      return this.encomendas.find({ query: { $limit: 200 } })
        .subscribe(encomendas => {
          this.loading = false;
          this.results = encomendas;
        });
    }
    if ((!input || input === ' ' || input === '  ') && estado === 'qualquer' && cliente_user_id) {
      return this.encomendas.find({ query: { cliente_user_id, $limit: 200 } })
        .subscribe(encomendas => {
          this.loading = false;
          this.results = encomendas;
        });
    }

    if (estado !== 'qualquer' && !cliente_user_id) {
      return this.artigos
        .find(dbQuery)
        .pipe(
          concatMap(
            (artigosDB: Artigo[]) => concat(...artigosDB.map(
              ({ id }) => this.encomendas.find({ query: { artigo_id: id, estado, $limit: 200 } })
            ))
              .pipe(reduce((acc, val) => ([...acc, ...val])))
          )
        )
        .subscribe(encomendas => {
          this.loading = false;
          this.results = clone(encomendas);
        });
    }

    if (estado !== 'qualquer' && cliente_user_id) {
      return this.artigos
        .find(dbQuery)
        .pipe(
          concatMap(
            (artigosDB: Artigo[]) => concat(...artigosDB.map(
              ({ id }) => this.encomendas.find({ query: { artigo_id: id, estado, cliente_user_id, $limit: 200 } })
            ))
              .pipe(reduce((acc, val) => ([...acc, ...val])))
          )
        )
        .subscribe(encomendas => {
          this.loading = false;
          this.results = clone(encomendas);
        });
    }

    if (estado === 'qualquer' && !cliente_user_id) {
      return this.artigos
        .find(dbQuery)
        .pipe(
          concatMap(
            (artigosDB: Artigo[]) => concat(...artigosDB.map(
              ({ id }) => this.encomendas.find({ query: { artigo_id: id, $limit: 200 } })
            ))
              .pipe(reduce((acc, val) => ([...acc, ...val])))
          )
        )
        .subscribe(encomendas => {
          this.loading = false;
          this.results = clone(encomendas);
        });
    }

    if (estado === 'qualquer' && cliente_user_id) {
      return this.artigos
        .find(dbQuery)
        .pipe(
          concatMap(
            (artigosDB: Artigo[]) => concat(...artigosDB.map(
              ({ id }) => this.encomendas.find({ query: { artigo_id: id, cliente_user_id, $limit: 200 } })
            ))
              .pipe(reduce((acc, val) => ([...acc, ...val])))
          )
        )
        .subscribe(encomendas => {
          this.loading = false;
          this.results = clone(encomendas);
        });
    }

    // this.results$ = this.encomendas.find(JSON.parse(dbQuery));
  }


}
