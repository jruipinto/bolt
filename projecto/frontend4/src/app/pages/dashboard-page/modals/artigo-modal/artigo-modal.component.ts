import { Component, OnInit, OnDestroy } from '@angular/core';
import { first, tap, concatMap, map } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ArtigosService, UIService, UI } from 'src/app/shared/state';
import { Artigo } from 'src/app/shared';

@AutoUnsubscribe()
@Component({
  selector: 'app-artigo-modal',
  templateUrl: './artigo-modal.component.html',
  styleUrls: ['./artigo-modal.component.scss']
})
export class ArtigoModalComponent implements OnInit, OnDestroy {
  public artigo: Artigo;

  constructor(
    private uiService: UIService,
    private artigos: ArtigosService
  ) { }

  public artigo$ = this.uiService.state$
    .pipe(
      concatMap((uiState: UI) => this.artigos.state$
        .pipe(
          map((artigos: Artigo[]) =>
            artigos.filter((artigo: Artigo) =>
              artigo.id === uiState.artigoModalID)
          ),
          map((artigos: Artigo[]) => artigos[0])
        ))
    );

  ngOnInit() {
    this.uiService.state$
      .pipe(
        concatMap((uiState: UI) => this.artigos.get(uiState.artigoModalID))
      )
      .subscribe();
    this.artigo$
      .subscribe(artigo => this.artigo = artigo);
  }

  ngOnDestroy() { }

  closeModal(modalIsOpen: boolean) {
    if (modalIsOpen) {
      this.uiService.state$
        .pipe(
          first(),
          tap((uiState: UI) =>
            this.uiService.source.next({ ...uiState, artigoModalVisible: false })
          )
        )
        .subscribe();
    }
  }

  saveArtigo(artigo: Artigo) {
    return this.artigos.patch(artigo.id, artigo)
      .pipe(
        concatMap(() =>
          this.uiService.state$
            .pipe(
              first(),
              concatMap(() => this.uiService.patchState({ artigoModalVisible: false }))
            )
        )
      )
      .subscribe();
  }

  createArtigo(artigo: Artigo) {
    return this.artigos.create(artigo)
      .pipe(
        concatMap(() =>
          this.uiService.state$
            .pipe(
              first(),
              concatMap(() => this.uiService.patchState({ artigoModalVisible: false }))
            )
        )
      )
      .subscribe();
  }
}
