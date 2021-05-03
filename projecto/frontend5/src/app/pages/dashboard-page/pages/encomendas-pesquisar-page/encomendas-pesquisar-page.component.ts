import {
  Component,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { concat, Observable, of } from 'rxjs';
import { concatMap, map, reduce, tap } from 'rxjs/operators';
import { Encomenda, User, Artigo, dbQuery } from 'src/app/shared';
import { EncomendasService, ArtigosService } from 'src/app/shared/state';
import { clone, sort } from 'ramda';
import { ClientesPesquisarModalComponent } from 'src/app/pages/dashboard-page/modals';

@AutoUnsubscribe()
@Component({
  selector: 'app-encomendas-pesquisar-page',
  templateUrl: './encomendas-pesquisar-page.component.html',
  styleUrls: ['./encomendas-pesquisar-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncomendasPesquisarPageComponent
  implements OnDestroy, AfterViewInit {
  @ViewChild('userSearchModalInput')
  userSearchModalInputEl: ElementRef<HTMLElement>;
  @ViewChild(ClientesPesquisarModalComponent)
  clientesSearchModal: ClientesPesquisarModalComponent;

  public isLoading = true;
  public results$: Observable<Encomenda[]>;
  public encomendasSearchForm = this.fb.group({
    input: [null],
    estado: ['qualquer'],
    cliente_user_id: [null],
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
    'entregue',
  ];

  constructor(
    private encomendas: EncomendasService,
    private artigos: ArtigosService,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit() {
    this.clientesSearchModal.selectedCliente.subscribe((user: User) =>
      this.encomendasSearchForm.patchValue({ cliente_user_id: clone(user.id) })
    );
    this.searchEncomenda(this.encomendasSearchForm.value);
  }

  ngOnDestroy() {}

  searchEncomenda({ input, estado, cliente_user_id }): void {
    if (!input && !cliente_user_id) {
      this.results$ = of([]);
      this.isLoading = false;
      return;
    }
    this.isLoading = true;

    this.results$ = this.artigos
      .find(dbQuery(input || ' ', ['marca', 'modelo', 'descricao']))
      .pipe(
        concatMap((artigosDB: Artigo[]) => {
          if (!artigosDB || !artigosDB.length) {
            return of(null);
          }
          return concat(
            ...artigosDB.map(({ id }) =>
              this.encomendas.find({
                query: {
                  $limit: '200',
                  artigo_id: id,
                  ...(estado !== 'qualquer' ? { estado: estado } : null),
                  ...(+cliente_user_id
                    ? { cliente_user_id: +cliente_user_id }
                    : null),
                },
              })
            )
          ).pipe(reduce((acc, val) => [...acc, ...val]));
        })
      )
      .pipe(
        map((encomendas) => {
          const inverseDiff = (objA, objB) => objB.id - objA.id;
          return sort(inverseDiff, clone(encomendas));
        }),
        tap(() => {
          this.isLoading = false;
        })
      );
  }
}
