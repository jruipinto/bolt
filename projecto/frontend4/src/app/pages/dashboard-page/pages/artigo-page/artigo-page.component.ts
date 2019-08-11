import { Component, OnInit, OnDestroy } from '@angular/core';
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
  styleUrls: ['./artigo-page.component.scss']
})
export class ArtigoPageComponent implements OnInit, OnDestroy {
  public artigoForm = this.fb.group({
    id: [null],
    marca: [null, [Validators.maxLength(45)]],
    modelo: [null, [Validators.maxLength(45)]],
    descricao: [null, [Validators.required, Validators.maxLength(255)]],
    localizacao: [null, [Validators.maxLength(5)]],
    qty: [null],
    preco: [null],
    pvp: [null]
  });

  constructor(
    private artigos: ArtigosService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private uiService: UIService
  ) { }

  ngOnInit() {
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
      ).subscribe();
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => +params.get('id')),
        concatMap((id: number) => this.artigos.state$
          .pipe(map((state: Artigo[]) => {
            return state && state.length
            ? state.filter(a => a.id === id)
            : null;
          }))
        )
      )
      .subscribe(
        (artigo: Artigo[]) => {
          if (artigo && artigo.length) {
            this.artigoForm.patchValue(artigo[0]);
          }
        }
      );
  }

  ngOnDestroy() { }

  saveArtigo(artigo: Artigo) {
    return this.artigos.patch(artigo.id, capitalize(artigo))
      .pipe(
        concatMap(
          () => artigo.qty === 0
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
    return this.artigos.create(capitalize(artigo))
      .pipe(
        map((res: Artigo[]) => res[0]),
        concatMap(
          (newArtigo: Artigo) => artigo.qty === 0
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
    this.uiService.patchState({ encomendaPageArtigoForm: artigo })
      .subscribe();
    return this.router.navigate(['/dashboard/encomendas-criar-nova']);
  }

  navigateBack() {
    window.history.back();
  }

}
