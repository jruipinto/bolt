import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable } from 'rxjs';
import { Encomenda, Query, User } from 'src/app/shared';
import { EncomendasService, UsersService, UIService } from 'src/app/shared/state';
import { map, tap } from 'rxjs/operators';

@AutoUnsubscribe()
@Component({
  selector: 'app-encomendas-pesquisar-page',
  templateUrl: './encomendas-pesquisar-page.component.html',
  styleUrls: ['./encomendas-pesquisar-page.component.scss']
})
export class EncomendasPesquisarPageComponent implements OnInit, OnDestroy {
  results$: Observable<Encomenda[]>;

  public selectedOption: string;
  public input: string;
  public searchFilters: Query[];

  /*
  {
    id: number;
    artigo_id: number;
    artigo_marca?: string;
    artigo_modelo?: string;
    artigo_descricao?: string;
    assistencia_id: number;
    cliente_user_id: number;
    cliente_user_name?: string;
    cliente_user_contacto?: number;
    observacao: string;
    registo_cronologico: EventoCronologico[]; // JSON.stringify(data: EventoCronologico[])
    estado: string;
    previsao_entrega: string;
    orcamento: number;
    fornecedor: string;
    qty: number;
}
  */

  public filterOptions = [
    'id',
    'assistencia_id',
    'artigo_id',
    'cliente_user_id',
    'cliente_user_name',
    'cliente_user_contacto',
    'fornecedor',
    'estado',
    // 'createdAt'
  ];

  constructor(
    private encomendas: EncomendasService,
    private users: UsersService,
    private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  openEncomenda(encomendaID: number) {
    return this.router.navigate(['/dashboard/encomenda', encomendaID]);
  }

  private patchSearchFilters(newSearchFilterToAdd: Query, searchFiltersToPatch: Query[]): Query[] {
    if (searchFiltersToPatch) {
      const i = searchFiltersToPatch
        .findIndex((searchFilter: Query) => searchFilter.column === newSearchFilterToAdd.column);
      if (i > -1) { searchFiltersToPatch.splice(i, 1); }
      return [...searchFiltersToPatch, newSearchFilterToAdd];
    } else {
      return [newSearchFilterToAdd];
    }
  }
  private findClienteIdByNameOrContactAndPatchSearchFilters(newSearchFilter: Query): Observable<User> {
    const column = (a) => {
      if (a === 'cliente_user_name') {
        return 'nome';
      } else {
        return 'contacto';
      }
    };
    return this.users
      .find({
        query: {
          $limit: 200,
          ...JSON.parse('{"' + column(newSearchFilter.column) + '" : { "$like" : "%' + newSearchFilter.condition + '%"} }')
        }
      })
      .pipe(
        map((res: User[]) => res[0]),
        tap((user: User) => {
          const searchFilter: Query = {
            column: 'cliente_user_id',
            condition: user.id
          };
          this.searchFilters = this.patchSearchFilters(searchFilter, this.searchFilters);
        })
      );
  }

  addFilter(newSearchFilter: Query) {
    if (!newSearchFilter.column) {
      alert('Tens de decidir o que queres procurar primeiro!');
      return;
    }

    switch (newSearchFilter.column) {
      case 'cliente_user_name':
        this.findClienteIdByNameOrContactAndPatchSearchFilters(newSearchFilter)
          .subscribe();
        break;
      case 'cliente_user_contacto':
        this.findClienteIdByNameOrContactAndPatchSearchFilters(newSearchFilter)
          .subscribe();
        break;
      default:
        this.searchFilters = this.patchSearchFilters(newSearchFilter, this.searchFilters);
        break;
    }

    this.input = null;
    this.selectedOption = null;
  }

  removeSearchFilter(i: number) {
    this.searchFilters.splice(i, 1);
  }

  search() {
    let dbQueryParams: {};
    if (!this.searchFilters) {
      if (!this.selectedOption) {
        alert('Tens de decidir o que queres procurar primeiro!');
        return;
      }
      // this.searchFilters = [{ column: this.selectedOption, condition: this.input }];
      this.addFilter({ column: this.selectedOption, condition: this.input });
    }

    // search client_id here!

    this.searchFilters.forEach((searchFilter: Query) => {
      const newdbQueryParam = JSON.parse('{"' + searchFilter.column + '" : { "$like" : "%' + searchFilter.condition + '%"} }');
      dbQueryParams = { ...dbQueryParams, ...newdbQueryParam };
    });
    const dbQuery = { query: { $limit: 200, ...dbQueryParams } };
    this.results$ = this.encomendas
      .findAndWatch(dbQuery);
    this.input = null;
    this.selectedOption = null;
    this.searchFilters = null;
  }

}
