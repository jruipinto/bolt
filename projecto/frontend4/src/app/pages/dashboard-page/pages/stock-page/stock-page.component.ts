import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Artigo, dbQuery } from 'src/app/shared';
import { ArtigosService, UIService } from 'src/app/shared/state';
import { tap } from 'rxjs/operators';

@AutoUnsubscribe()
@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss']
})
export class StockPageComponent implements OnInit, OnDestroy {
  public loading = false;
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
    this.loading = true;
    this.uiService.state$
      .subscribe(({ stockPageArtigoSearch$ }) => {
        this.results$ = stockPageArtigoSearch$;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.uiService.patchState({ stockPageArtigoSearch$: this.results$ })
      .subscribe();
  }

  searchArtigo(input?: string) {
    if (!input) {
      return;
    }
    this.loading = true;

    this.results$ = this.artigos.find(dbQuery(input, ['marca', 'modelo', 'descricao'])).pipe(
      tap(() => { this.loading = false; })
    );
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

      this.results$ = this.artigos
        .find(JSON.parse(query))
        .pipe(
          tap(() => { this.loading = false; })
        );
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
