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
    marca: [null],
    modelo: [null],
    descricao: [null, [Validators.required]],
    localizacao: [null],
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
            return this.artigos.getAndWatch(id);
          } else {
            return of();
          }
        })
      )
      .subscribe(
        (artigo: Artigo[]) => {
          if (artigo[0]) {
            this.artigoForm.patchValue(artigo[0]);
          }
        }
      );
  }

  ngOnDestroy() { }

  saveArtigo(artigo: Artigo) {
    return this.artigos.patch(artigo.id, capitalize(artigo))
      .pipe(
        tap(() => window.history.back())
      )
      .subscribe();
  }

  createArtigo(artigo: Artigo) {
    return this.artigos.create(capitalize(artigo))
      .pipe(
        tap(() => window.history.back())
      )
      .subscribe();
  }

  orderArtigo(artigo: Artigo) {
    console.log(artigo);
    this.uiService.patchState({ encomendaPageArtigoForm: artigo })
    .subscribe();
    return this.router.navigate(['/dashboard/encomendas-criar-nova']);
  }

}
