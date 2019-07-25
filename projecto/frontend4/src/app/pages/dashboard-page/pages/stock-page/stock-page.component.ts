import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Artigo } from 'src/app/shared';
import { Observable } from 'rxjs';
import { ArtigosService, UIService } from 'src/app/shared/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss']
})
export class StockPageComponent implements OnInit, OnDestroy {
  public dropdown = false;
  public results$: Observable<Artigo[]>;
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

  searchArtigoByLocal(input?: string) {
    if (input) {
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

      this.results$ = this.artigos
        .find(JSON.parse(dbQuery));
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

  toogleDropdown() {
    this.dropdown = !this.dropdown;
  }

}
