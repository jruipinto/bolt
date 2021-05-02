import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { clone } from 'ramda';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Artigo, Assistencia, dbQuery } from 'src/app/shared';
import { ArtigosService } from 'src/app/shared/state';

@Component({
  selector: 'app-artigo-search-modal',
  templateUrl: './artigo-search-modal.component.html',
  styleUrls: ['./artigo-search-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtigoSearchModalComponent {
  @Input() assistencia: Assistencia = null;
  assistenciaOnInit: Assistencia = null;
  isLoading = false;
  isModalOpen = false;
  results$: Observable<Artigo[]> = of([]);

  artigoSearchForm = this.fb.group({
    input: [null],
  });

  constructor(
    private artigos: ArtigosService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  open(): void {
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  searchArtigo(input?: string) {
    if (!input || !input.length) {
      this.results$ = of([]);
      return;
    }
    this.isLoading = true;

    this.results$ = this.artigos
      .find(dbQuery(input, ['marca', 'modelo', 'descricao']))
      .pipe(
        map((artigos: Artigo[]) =>
          artigos.map((artigoOnDB) => {
            const currentArtigo = this.assistencia?.material.find(
              ({ id }) => id === artigoOnDB.id
            );
            const artigoOnInit = this.assistenciaOnInit?.material.find(
              ({ id }) => id === artigoOnDB.id
            );
            if (!currentArtigo && !artigoOnInit) {
              return artigoOnDB;
            }
            if (!currentArtigo && artigoOnInit) {
              return { ...artigoOnDB, qty: artigoOnDB.qty + artigoOnInit.qty };
            }
            if (currentArtigo && !artigoOnInit) {
              return { ...artigoOnDB, qty: artigoOnDB.qty - currentArtigo.qty };
            }
            return {
              ...artigoOnDB,
              qty: artigoOnDB.qty - currentArtigo.qty + artigoOnInit.qty,
            };
          })
        ),
        tap(() => {
          this.isLoading = false;
        })
      );
  }

  addArtigo(artigoInStock: Artigo) {
    if (artigoInStock.qty < 1) {
      return;
    }
    const artigo = { ...artigoInStock, qty: 1 };
    let material = clone(this.assistencia.material);
    if (material) {
      if (material.findIndex((item) => item.id === artigo.id) < 0) {
        material = [...material, artigo];
      } else {
        material = material.map((item) => {
          if (item.id === artigo.id) {
            return { ...item, qty: item.qty + 1 };
          } else {
            return item;
          }
        });
      }
    } else {
      material = clone([artigo]);
    }
    this.results$.subscribe((results) => {
      const resultIndex = results.findIndex(
        (result) => result.id === artigo.id
      );
      results[resultIndex].qty = results[resultIndex].qty - artigo.qty;
      this.assistencia.material = clone(material);
      this.isModalOpen = false;
    });
  }
}
