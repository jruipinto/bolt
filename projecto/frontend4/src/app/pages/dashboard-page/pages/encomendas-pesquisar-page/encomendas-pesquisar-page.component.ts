import {
  Component, OnInit, OnDestroy,
  AfterViewInit, ViewChild, ElementRef,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { concat, of } from 'rxjs';
import { concatMap, reduce } from 'rxjs/operators';
import { Encomenda, User, Artigo, dbQuery } from 'src/app/shared';
import { EncomendasService, ArtigosService } from 'src/app/shared/state';
import { clone } from 'ramda';
import { ClientesPesquisarModalComponent } from 'src/app/pages/dashboard-page/modals';

@AutoUnsubscribe()
@Component({
  selector: 'app-encomendas-pesquisar-page',
  templateUrl: './encomendas-pesquisar-page.component.html',
  styleUrls: ['./encomendas-pesquisar-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EncomendasPesquisarPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('userSearchModalInput', { static: false }) userSearchModalInputEl: ElementRef<HTMLElement>;
  @ViewChild(ClientesPesquisarModalComponent, { static: false }) clientesSearchModal: ClientesPesquisarModalComponent;

  public loading = false;
  public results: Encomenda[];
  public encomendasSearchForm = this.fb.group({
    input: [null],
    estado: ['qualquer'],
    cliente_user_id: [null]
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
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.clientesSearchModal.selectedCliente.subscribe(
      (user: User) => this.encomendasSearchForm.patchValue({ cliente_user_id: clone(user.id) })
    );
    this.searchEncomenda(this.encomendasSearchForm.value);
  }

  ngOnDestroy() {
  }

  openEncomenda(encomendaID: number) {
    return this.router.navigate(['/dashboard/encomenda', encomendaID]);
  }

  searchEncomenda({ input, estado, cliente_user_id }) {
    if (!input) {
      return;
    }
    this.loading = true;

    const clienteStatement = cliente_user_id && typeof cliente_user_id === 'number' ? ',"cliente_user_id":' + cliente_user_id : '';
    const estadoStatement = estado && estado !== 'qualquer' ? ',"estado": "' + estado + '"' : '';

    return this.artigos.find(dbQuery(input, ['marca', 'modelo', 'descricao'])).pipe(
      concatMap((artigosDB: Artigo[]) => {
        if (!artigosDB || !artigosDB.length) {
          return of(null);
        }
        return concat(...artigosDB.map(
          ({ id }) => this.encomendas.find(
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
          )
        )).pipe(reduce((acc, val) => ([...acc, ...val])));
      })
    ).subscribe(encomendas => {
      this.results = clone(encomendas);
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

}
