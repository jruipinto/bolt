import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { clone } from 'ramda';
import { Observable, of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { ArtigoRowListComponent } from 'src/app/pages/dashboard-page/components/artigo/artigo-row-list/artigo-row-list.component';
import { Artigo, Assistencia } from 'src/app/shared';
import { AssistenciaPageService } from '../../assistencia-page.service';

@Component({
  selector: 'app-artigo-search-modal',
  templateUrl: './artigo-search-modal.component.html',
  styleUrls: ['./artigo-search-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtigoSearchModalComponent {
  @ViewChild(ArtigoRowListComponent) artigoRowList: ArtigoRowListComponent;

  @Input() assistencia: Assistencia = null;
  isModalOpen = false;
  results$: Observable<Artigo[]> = of([]);

  artigoSearchForm = this.fb.group({
    input: [null],
  });

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private pageSvc: AssistenciaPageService
  ) {}

  open(): void {
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  searchArtigo(input?: string) {
    this.results$ = this.artigoRowList.searchArtigo(input).pipe(
      concatMap((artigos: Artigo[]) => {
        return this.pageSvc.state.observeOne().pipe(
          map((state) => {
            return artigos.map((artigoOnDB) => {
              const currentArtigo = state.assistenciaDraft?.material.find(
                ({ id }) => id === artigoOnDB.id
              );
              const artigoOnInit = state.assistenciaOriginal?.material.find(
                ({ id }) => id === artigoOnDB.id
              );
              if (!currentArtigo && !artigoOnInit) {
                return artigoOnDB;
              }
              if (!currentArtigo && artigoOnInit) {
                return {
                  ...artigoOnDB,
                  qty: artigoOnDB.qty + artigoOnInit.qty,
                };
              }
              if (currentArtigo && !artigoOnInit) {
                return {
                  ...artigoOnDB,
                  qty: artigoOnDB.qty - currentArtigo.qty,
                };
              }
              return {
                ...artigoOnDB,
                qty: artigoOnDB.qty - currentArtigo.qty + artigoOnInit.qty,
              };
            });
          })
        );
      })
    );
  }

  addArtigo(artigoInStock: Artigo) {
    if (artigoInStock.qty < 1) {
      return;
    }
    this.results$.subscribe((results) => {
      this.pageSvc.state.patch((draftState) => {
        const artigo = { ...artigoInStock, qty: 1 };
        let { material } = draftState.assistenciaDraft;
        if (material) {
          if (material.findIndex(({ id }) => id === artigo.id) < 0) {
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
        const resultIndex = results.findIndex(
          (result) => result.id === artigo.id
        );
        results[resultIndex].qty = results[resultIndex].qty - artigo.qty;
        draftState.assistenciaDraft.material = material;
        this.isModalOpen = false;
      });
    });
  }
}
