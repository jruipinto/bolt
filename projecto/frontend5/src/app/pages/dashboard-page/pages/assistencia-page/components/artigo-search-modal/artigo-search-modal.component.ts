import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { clone } from 'ramda';
import { map } from 'rxjs/operators';
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
  isArtigoSearchModalOpened = false;
  artigoSearchResults: Artigo[] = [];

  artigoSearchForm = this.fb.group({
    input: [null],
  });

  constructor(private artigos: ArtigosService, private fb: FormBuilder) {}

  searchArtigo(input?: string) {
    if (!input) {
      return;
    }
    this.artigos
      .find(dbQuery(input, ['marca', 'modelo', 'descricao']))
      .pipe(
        map((artigos: Artigo[]) =>
          artigos.map((artigoOnDB) => {
            const currentArtigo = this.assistencia.material
              ? this.assistencia.material.find((a) => a.id === artigoOnDB.id)
              : null;
            const artigoOnInit = this.assistenciaOnInit.material
              ? this.assistenciaOnInit.material.find(
                  (a) => a.id === artigoOnDB.id
                )
              : null;
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
        )
      )
      .subscribe((res: Artigo[]) => {
        this.artigoSearchResults = clone(res);
      });
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
    const resultIndex = this.artigoSearchResults.findIndex(
      (result) => result.id === artigo.id
    );
    this.artigoSearchResults[resultIndex].qty =
      this.artigoSearchResults[resultIndex].qty - artigo.qty;
    this.assistencia.material = clone(material);
    this.isArtigoSearchModalOpened = false;
  }
}
