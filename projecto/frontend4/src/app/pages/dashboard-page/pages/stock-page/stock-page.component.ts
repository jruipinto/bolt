import { Component, OnInit } from '@angular/core';
import { Artigo } from 'src/app/shared';
import { Observable } from 'rxjs';
import { ArtigosService, UIService } from 'src/app/shared/state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss']
})
export class StockPageComponent implements OnInit {
  results$: Observable<Artigo[]>;

  constructor(
    private artigos: ArtigosService,
    private uiService: UIService,
    private router: Router) { }

  ngOnInit() {
  }

  search(input?: string) {
    if (input) {
      const inputSplited = input.split(' ');
      const inputMapped = inputSplited.map(word =>
        '{"$or": [' +
        '{ "marca": { "$like": "%' + word + '%" }},' +
        '{ "modelo": { "$like": "%' + word + '%" }},' +
        '{ "descricao": { "$like": "%' + word + '%" }}' +
        ' ]}'
      );
      const dbQuery =
        '{' +
        '"query": {' +
        '"$limit": "200",' +
        '"$and": [' +
        inputMapped +
        ']' +
        '}' +
        '}';

      this.results$ = this.artigos
        .findAndWatch(JSON.parse(dbQuery));
    }
  }

  openArtigoModal(artigoID?: number) {
    if (!artigoID) { artigoID = null; }
    return this.uiService.patchState({ artigoModalID: artigoID, artigoModalVisible: true })
      .subscribe();
  }

  openArtigo(artigoID?: number) {
    if (artigoID) {
      return this.router.navigate(['/dashboard/artigo', artigoID]);
    } else {
      return this.router.navigate(['/dashboard/artigo']);
    }
  }
}
