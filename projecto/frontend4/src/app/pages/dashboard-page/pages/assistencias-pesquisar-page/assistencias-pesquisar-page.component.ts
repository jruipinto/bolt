import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, first } from 'rxjs/operators';
import { AssistenciasService, UIService, UI, UsersService } from 'src/app/shared/state';
import { Assistencia } from 'src/app/shared';

export interface Query {
  column: string;
  condition: string;
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

  private findClientUserIDbyContacto (searchFilters: Query[]) {
    const userContactoIndex = searchFilters
      .findIndex((searchFilter: Query) => searchFilter.column === 'cliente_user_contacto');
    const clienteUserContacto = searchFilters.splice(userContactoIndex);
    return this.users.find({query: {cliente_user_contacto: { $like: '%' + clienteUserContacto[0].condition + '%'}}});
  }

  private findClientUserIDbyName (searchFilters: Query[]): Query[] {
    const userContactoIndex = searchFilters
      .findIndex((searchFilter: Query) => searchFilter.column === 'cliente_user_contacto');
    const userNameIndex = searchFilters
      .findIndex((searchFilter: Query) => searchFilter.column === 'cliente_user_name');
    const clienteUserContacto = searchFilters.splice(userContactoIndex);
    const clienteUserName = searchFilters.splice(userNameIndex);

    return searchFilters;
  }

}
