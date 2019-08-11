import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Artigo } from 'src/app/shared';
import { ArtigosService, UIService } from 'src/app/shared/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss']
})
export class StockPageComponent implements OnInit, OnDestroy {
  public loading = false;
  public results: Artigo[];
  public artigoSearchForm = this.fb.group({
    input: [null]
  });

  constructor(
    private artigos: ArtigosService,
    private uiService: UIService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  searchArtigo(input?: string) {
    if (input) {
      this.loading = true;
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

      return this.artigos
        .find(JSON.parse(dbQuery))
        .subscribe(artigos => {
          this.loading = false;
          this.results = artigos;
        });
    }
  }

  searchArtigoByLocal(input?: string) {
    if (input) {
      this.loading = true;
      const inputSplited = input.split(' ');
      const inputMapped = inputSplited.map(word =>
        '{"$or": [' +
        '{ "localizacao": { "$like": "%' + word + '%" }}' +
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

      return this.artigos
        .find(JSON.parse(dbQuery))
        .subscribe(artigos => {
          this.loading = false;
          this.results = artigos;
        });
    }
  }

  openArtigoModal(arg?: number) {
    const artigoID = arg ? arg : null;
    return this.uiService.patchState({ artigoModalID: artigoID, artigoModalVisible: true })
      .subscribe();
  }

  openArtigo(artigoID: number) {
    return this.router.navigate(['/dashboard/artigo', artigoID]);
  }

  newArtigo() {
    return this.router.navigate(['/dashboard/artigo']);
  }

}
