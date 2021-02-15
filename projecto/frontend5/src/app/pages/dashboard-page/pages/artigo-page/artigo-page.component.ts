import { Component, OnDestroy, AfterContentInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { tap, concatMap, map } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { capitalize } from 'src/app/shared/utilities';
import { Artigo } from 'src/app/shared/models';
import { ArtigosService, UIService } from 'src/app/shared/state';
import { of } from 'rxjs';

@AutoUnsubscribe()
@Component({
  selector: 'app-artigo-page',
  templateUrl: './artigo-page.component.html',
  styleUrls: ['./artigo-page.component.scss'],
})
export class ArtigoPageComponent implements AfterContentInit, OnDestroy {
  public artigoForm = this.fb.group({
    id: [null],
    marca: [null],
    modelo: [null],
    descricao: [null, [Validators.required]],
    localizacao: [null],
    qty: [null],
    preco: [null],
    pvp: [null],
  });

  constructor(
    private artigos: ArtigosService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private uiService: UIService
  ) {}

  ngAfterContentInit() {
    // retrieves the article from DB (wich gets cached on state$)
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => +params.get('id')),
        concatMap((id: number) => {
          if (id > 0) {
            return this.artigos.get(id);
          } else {
            return of();
          }
        })
      )
      .subscribe();
    // retrieves the article from state$ (this is how state$ work in this app, for now)
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => +params.get('id')),
        concatMap((id: number) =>
          this.artigos.state$.pipe(
            map((state: Artigo[]) => {
              return state && state.length
                ? state.filter((a) => a.id === id)
                : null;
            })
          )
        )
      )
      .subscribe((artigo: Artigo[]) => {
        if (artigo && artigo.length) {
          this.artigoForm.patchValue(artigo[0]);
        }
      });
  }

  ngOnDestroy() {}

  saveArtigo(artigo: Artigo) {
    if (this.artigoForm.invalid) {
      return alert('Alguns dados obrigatórios em falta!');
    }
    return this.artigos
      .patch(artigo.id, capitalize(artigo))
      .pipe(
        concatMap(() =>
          !artigo.qty || artigo.qty < 2
            ? this.uiService.patchState({
                encomendaPromptModalVisible: true,
                encomendaPromptModalArtigo: artigo,
              })
            : of(true)
        ),
        tap(() => window.history.back())
      )
      .subscribe();
  }

  createArtigo(artigo: Artigo) {
    if (this.artigoForm.invalid) {
      return alert('Alguns dados obrigatórios em falta!');
    }
    return this.artigos
      .create(capitalize(artigo))
      .pipe(
        map((res: Artigo[]) => res[0]),
        concatMap((newArtigo: Artigo) =>
          !artigo.qty || artigo.qty < 2
            ? this.uiService.patchState({
                encomendaPromptModalVisible: true,
                encomendaPromptModalArtigo: newArtigo,
              })
            : of(true)
        ),
        tap(() => window.history.back())
      )
      .subscribe();
  }

  orderArtigo(artigo: Artigo) {
    if (this.artigoForm.invalid) {
      alert('Alguns dados obrigatórios em falta!');
      return;
    }
    this.uiService
      .patchState({ encomendaPageArtigoForm: artigo })
      .subscribe(() => {
        this.router.navigate(['/dashboard/encomendas-criar-nova']);
      });
  }

  navigateBack() {
    window.history.back();
  }
}
