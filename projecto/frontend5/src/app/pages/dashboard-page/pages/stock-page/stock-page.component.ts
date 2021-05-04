import {
  Component,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Artigo } from 'src/app/shared';
import { Observable } from 'rxjs';
import { ArtigoRowListComponent } from '../../components/artigo/artigo-row-list/artigo-row-list.component';

@AutoUnsubscribe()
@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild(ArtigoRowListComponent) artigoRowList: ArtigoRowListComponent;
  public results$: Observable<Artigo[]>;
  public artigoSearchForm = this.fb.group({
    input: [null],
  });

  constructor(private router: Router, private fb: FormBuilder) {}

  ngAfterViewInit() {
    this.searchArtigo(this.artigoSearchForm.value.input);
  }

  ngOnDestroy() {}

  openArtigo({ id }: Artigo) {
    return this.router.navigate(['/dashboard/artigo', id]);
  }

  searchArtigo(input?: string): void {
    this.results$ = this.artigoRowList.searchArtigo(input);
  }

  searchArtigoByLocal(input?: string): void {
    this.results$ = this.artigoRowList.searchArtigoByLocal(input);
  }

  newArtigo() {
    return this.router.navigate(['/dashboard/artigo']);
  }
}
