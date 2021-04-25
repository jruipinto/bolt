import {
  Component,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Artigo, dbQuery } from 'src/app/shared';
import { ArtigosService } from 'src/app/shared/state';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@AutoUnsubscribe()
@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockPageComponent implements AfterViewInit, OnDestroy {
  public isLoading = false;
  public results$: Observable<Artigo[]>;
  public artigoSearchForm = this.fb.group({
    input: [null],
  });

  constructor(
    private artigos: ArtigosService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit() {
    this.searchArtigo(this.artigoSearchForm.value.input);
  }

  ngOnDestroy() {}

  searchArtigo(input?: string): void {
    if (!input || !input.length) {
      this.results$ = of([]);
      return;
    }
    this.isLoading = true;

    this.results$ = this.artigos
      .find(dbQuery(input, ['marca', 'modelo', 'descricao']))
      .pipe(
        tap(() => {
          this.isLoading = false;
        })
      );
  }

  searchArtigoByLocal(input?: string): void {
    if (!input || !input.length) {
      this.results$ = of([]);
      return;
    }
    this.isLoading = true;
    const inputSplited = input.split(' ');
    const inputMapped = inputSplited.map(
      (word) =>
        '{"$or": [' + '{ "localizacao": { "$like": "%' + word + '%" }}' + ' ]}'
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

    this.results$ = this.artigos.find(JSON.parse(query)).pipe(
      tap(() => {
        this.isLoading = false;
      })
    );
  }

  newArtigo() {
    return this.router.navigate(['/dashboard/artigo']);
  }
}
