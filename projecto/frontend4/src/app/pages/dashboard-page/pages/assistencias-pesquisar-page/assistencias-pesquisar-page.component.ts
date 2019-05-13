import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, first } from 'rxjs/operators';
import { AssistenciasService, UIService, UI } from 'src/app/shared/state';
import { Assistencia } from 'src/app/shared';

@Component({
  selector: 'app-assistencias-pesquisar-page',
  templateUrl: './assistencias-pesquisar-page.component.html',
  styleUrls: ['./assistencias-pesquisar-page.component.scss']
})
export class AssistenciasPesquisarPageComponent implements OnInit {
  results$: Observable<Assistencia[]>;

  constructor(
    private assistencias: AssistenciasService,
    private uiService: UIService) { }

  ngOnInit() {
  }

  search(proprieadade: string, valor: string) {
    const expression = '{ "query": { "$limit": "200", "' + proprieadade + '" : "' + valor + '" } }';
    console.log(expression);
    const query = JSON.parse(expression);
    console.log(query);
    this.results$ = this.assistencias
      .findAndWatch(query);
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

}
