import { Component, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Artigo, dbQuery } from 'src/app/shared';
import { ArtigosService, UIService } from 'src/app/shared/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockPageComponent implements AfterViewInit, OnDestroy {
  public loading = false;
  public results: Artigo[];
  public artigoSearchForm = this.fb.group({
    input: [null]
  });

  constructor(
    private artigos: ArtigosService,
    private uiService: UIService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.searchArtigo(this.artigoSearchForm.value.input);
  }

  ngOnDestroy() {
  }

  searchArtigo(input?: string) {
    if (!input || !input.length) {
      return;
    }
    this.loading = true;

    this.artigos.find(dbQuery(input, ['marca', 'modelo', 'descricao']))
      .subscribe(results => {
        this.results = results;
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  searchArtigoByLocal(input?: string) {
    if (!input || !input.length) {
      return;
    }
    this.loading = true;
    const inputSplited = input.split(' ');
    const inputMapped = inputSplited.map(word =>
      '{"$or": [' +
      '{ "localizacao": { "$like": "%' + word + '%" }}' +
      ' ]}'
    );
    const query =
      '{' +
      '"query": {' +
      '"$sort": { "localizacao": "1", "marca": "1", "modelo": "1",  "descricao": "1"},' +
      '"$limit": "200",' +
      '"$and": [' +
      inputMapped +
      ']' +
      '}' +
      '}';

    this.artigos.find(JSON.parse(query))
      .subscribe(results => {
        this.results = results;
        this.loading = false;
        this.cdr.detectChanges();
      });
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
