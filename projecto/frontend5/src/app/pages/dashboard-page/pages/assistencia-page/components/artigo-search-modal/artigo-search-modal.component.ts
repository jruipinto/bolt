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
  @Input() assistencia: Assistencia;

  isArtigoSearchModalOpened = false;

  artigoSearchResults: Artigo[];

  assistenciaOnInit: Assistencia;

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
}
