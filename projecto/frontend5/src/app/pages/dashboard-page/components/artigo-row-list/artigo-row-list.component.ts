import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Artigo, dbQuery } from 'src/app/shared';
import { ArtigosService } from 'src/app/shared/state';

@Component({
  selector: 'app-artigo-row-list',
  templateUrl: './artigo-row-list.component.html',
  styleUrls: ['./artigo-row-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtigoRowListComponent {
  @Input() artigos$: Observable<Artigo[]> = of([]);
  @Input() isLoading = false;
  @Output() rowClick = new EventEmitter<Artigo>();

  constructor(private artigos: ArtigosService) {}

  searchArtigo(input?: string): Observable<Artigo[]> {
    if (!input || !input.length) {
      this.artigos$ = of([]);
      this.isLoading = false;
      return;
    }
    this.isLoading = true;

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
