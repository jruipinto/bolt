import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Artigo, dbQuery } from 'src/app/shared';
import { ArtigosService } from 'src/app/shared/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-artigo-row-list',
  templateUrl: './artigo-row-list.component.html',
  styleUrls: ['./artigo-row-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtigoRowListComponent implements OnDestroy {
  @Input() artigos$: Observable<Artigo[]> = of([]);
  @Input() isLoading = false;
  @Output() rowClick = new EventEmitter<Artigo>();

  constructor(
    private artigos: ArtigosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {}

  searchArtigo(input?: string): Observable<Artigo[]> {
    if (!input || !input.length) {
      this.artigos$ = of([]);
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.cdr.detectChanges();

    return this.artigos
      .find(dbQuery(input, ['marca', 'modelo', 'descricao']))
      .pipe(
        tap(() => {
          this.isLoading = false;
        })
      );
  }

  searchArtigoByLocal(input?: string): Observable<Artigo[]> {
    if (!input || !input.length) {
      this.artigos$ = of([]);
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.cdr.detectChanges();

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

    return this.artigos.find(JSON.parse(query)).pipe(
      tap(() => {
        this.isLoading = false;
      })
    );
  }
}
