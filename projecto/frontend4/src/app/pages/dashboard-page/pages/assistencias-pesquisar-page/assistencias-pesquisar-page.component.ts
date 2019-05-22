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
  public querys: Query[];

  public filtros = [
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

  search(propriedade: string, valor: string) {
    const extenseQuery = propriedade + ' : ' + valor;
    const expression = { query: { $limit: 200, extenseQuery} };
    // const expression = '{ "query": { "$limit": "200", "' + propriedade + '" : "' + valor + '" } }';
    console.log(expression);
    this.results$ = this.assistencias
      .findAndWatch(expression);
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

  addFilter(query: Query) {
    this.querys
    ? this.querys = [...this.querys, query]
    : this.querys = [query];
  }

}
