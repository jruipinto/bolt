import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, first } from 'rxjs/operators';
import { AssistenciasService, UIService, UI } from 'src/app/shared/state';
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
  propriedade: string;
  valor: string;

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
    this.searchFilters
      ? this.searchFilters = [...this.searchFilters, newSearchFilter]
      : this.searchFilters = [newSearchFilter];
  }

  search() {
    let dbQueryParams: {};
    if (!this.searchFilters) {
      this.searchFilters = [{column: this.selectedOption, condition: this.input}];
    }
    this.searchFilters.forEach((searchFilter: Query) => {
      const newdbQueryParam = JSON.parse('{"' + searchFilter.column + '" : { "$like" : "%' + searchFilter.condition + '%"} }');
      dbQueryParams = { ...dbQueryParams, ...newdbQueryParam };
    });
    const dbQuery = { query: { $limit: 200, ...dbQueryParams } };
    this.results$ = this.assistencias
      .findAndWatch(dbQuery);
  }

}
