import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { concat, of } from 'rxjs';
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

    const clienteStatement = cliente_user_id && typeof cliente_user_id === 'number' ? ',"cliente_user_id":' + cliente_user_id : '';
    const estadoStatement = estado && estado !== 'qualquer' ? ',"estado": "' + estado + '"' : '';
    const dbQuery =
      JSON.parse(
        '{' +
        '"query": {' +
        '"$sort": { "marca": "1", "modelo": "1",  "descricao": "1"},' +
        '"$limit": "200",' +
        '"$and": [' +
        inputMapped +
        ']' +
        '}' +
        '}'
      );

    return this.artigos
      .find(dbQuery)
      .pipe(
        concatMap(
          (artigosDB: Artigo[]) => {
            if (artigosDB && artigosDB.length > 0) {
              return concat(
                ...artigosDB.map(
                  ({ id }) => {
                    return this.encomendas
                      .find(
                        JSON.parse(
                          '{' +
                          '"query": {' +
                          '"$limit": "200",' +
                          '"artigo_id": ' + id +
                          clienteStatement +
                          estadoStatement +
                          '}' +
                          '}'
                        )
                      );
                  }
                )
              )
                .pipe(reduce((acc, val) => ([...acc, ...val])));
            }
            return of([]);
          }
        )
      )
      .subscribe(encomendas => {
        this.loading = false;
        this.results = clone(encomendas);
      });
  }

}
