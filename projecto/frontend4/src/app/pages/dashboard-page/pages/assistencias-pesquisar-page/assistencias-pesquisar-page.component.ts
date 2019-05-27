import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, first, map } from 'rxjs/operators';
import { AssistenciasService, UIService, UI, UsersService } from 'src/app/shared/state';
import { Assistencia, User } from 'src/app/shared';

export interface Query {
  column: string;
  condition: string | number;
}

@Component({
  selector: 'app-assistencias-pesquisar-page',
  templateUrl: './assistencias-pesquisar-page.component.html',
  styleUrls: ['./assistencias-pesquisar-page.component.scss']
})
export class AssistenciasPesquisarPageComponent implements OnInit {
  results$: Observable<Assistencia[]>;

  public selectedOption: string;
  public input: string;
  public searchFilters: Query[];

  public filterOptions = [
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
    // 'createdAt'
  ];

  constructor(
    private assistencias: AssistenciasService,
    private users: UsersService,
    private uiService: UIService) { }

  ngOnInit() {
  }

  openModal(id: number): void {
    this.uiService.state$
      .pipe(
        first(),
        tap((uiState: UI) =>
          this.uiService.source.next({ ...uiState, ...{ assistenciaModalID: id, assistenciaModalVisible: true } })
        )
      )
      .subscribe();
  }
  /*
    addFilter(newSearchFilter: Query) {
      if (!this.selectedOption) {
        alert('Tens de decidir o que queres procurar primeiro!');
        return;
      }
      this.searchFilters
        ? this.searchFilters = [...this.searchFilters, newSearchFilter]
        : this.searchFilters = [newSearchFilter];
      this.input = null;
      this.selectedOption = null;
    }
    */

  private patchSearchFilters(newSearchFilterToAdd: Query, searchFiltersToPatch: Query[]): Query[] {
    if (searchFiltersToPatch) {
      searchFiltersToPatch
        .splice(
          searchFiltersToPatch
            .findIndex((searchFilter: Query) => searchFilter.column === newSearchFilterToAdd.column)
        );
      return searchFiltersToPatch = [...searchFiltersToPatch, newSearchFilterToAdd];
    } else {
      return searchFiltersToPatch = [newSearchFilterToAdd];
    }
  }
  private findClienteIdByNameOrContactAndPatchSearchFilters(newSearchFilter: Query): Observable<User> {
    const column = (a) => {
      a.column === 'cliente_user_name'
        ? 'nome'
      : 'contacto'
  }
    return this.users
  .find({
    query: {
      $limit: 200,
      ...JSON.parse('{"' + newSearchFilter.column + '" : { "$like" : "%' + newSearchFilter.condition + '%"} }')
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
    this.searchFilters = [{ column: this.selectedOption, condition: this.input }];
  }

  // search client_id here!

  this.searchFilters.forEach((searchFilter: Query) => {
    const newdbQueryParam = JSON.parse('{"' + searchFilter.column + '" : { "$like" : "%' + searchFilter.condition + '%"} }');
    dbQueryParams = { ...dbQueryParams, ...newdbQueryParam };
  });
  const dbQuery = { query: { $limit: 200, ...dbQueryParams } };
  this.results$ = this.assistencias
    .findAndWatch(dbQuery);
  this.input = null;
  this.selectedOption = null;
  this.searchFilters = null;
}

}
