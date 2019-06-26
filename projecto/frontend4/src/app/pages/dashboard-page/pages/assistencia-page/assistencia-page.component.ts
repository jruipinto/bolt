import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map, concatMap, tap, toArray } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { Assistencia, Artigo } from 'src/app/shared/models';
import { PrintService } from 'src/app/pages/dashboard-page/prints/print.service';
import { UIService, UI } from 'src/app/shared/state/ui.service';
import { AssistenciasService, ArtigosService } from 'src/app/shared/state';
import { Observable, concat, of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ArtigosApiService } from 'src/app/shared';
import { List, Map } from 'immutable';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencia-page',
  templateUrl: './assistencia-page.component.html',
  styleUrls: ['./assistencia-page.component.scss']
})
export class AssistenciaPageComponent implements OnInit, OnDestroy {
  public assistenciaOpen: Assistencia;
  public materialModal = false;
  public qtyModal = false;
  public artigoSearchForm = this.fb.group({
    input: [null]
  });
  public results: Artigo[];
  public material: Partial<Artigo>[];
  public openDBArtigo: Artigo;
  public openArtigo: Artigo = null;

  constructor(
    private printService: PrintService,
    private uiService: UIService,
    private assistencias: AssistenciasService,
    private artigos: ArtigosService,
    // private artigosApi: ArtigosApiService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        concatMap((params: ParamMap) => this.assistencias.getAndWatch(+params.get('id'))),
        map((res: List<Assistencia>) => res.get(0)),
        concatMap(
          assistencia => {
            if (assistencia.material) {
              let assistMaterial: List<Partial<Artigo>>;
              typeof assistencia.material === 'string'
                ? assistMaterial = JSON.parse(assistencia.material)
                : assistMaterial = assistencia.material;
              return concat([...assistMaterial.map(
                (artigo: Partial<Artigo>) => {
                  return this.artigos.get(artigo.id)
                    .pipe(
                      map((dbArtigo: List<Artigo>) => dbArtigo.get(0)),
                      map(dbArtigo => dbArtigo = { ...dbArtigo, qty: artigo.qty })
                    );
                }
              )])
                .pipe(
                  concatMap(concats => concats),
                  toArray(),
                  map((material: List<Artigo>) => Map({ ...assistencia, material })));
            } else {
              return of(assistencia);
            }
          }
        ),
        tap(assistencia => this.assistenciaOpen = assistencia)
      )
      .subscribe(assistencia => this.material = assistencia.material);
  }

  ngOnDestroy() { }

  saveChangesOnStock(material: List<Partial<Artigo>>) {
    if (material) {
      return concat([...material.map(
        (artigo: Artigo) => this.artigos.get(artigo.id)
          .pipe(
            map((res: List<Artigo>) => res.get(0)),
            concatMap(
              dbArtigo => {
                let id: number;
                if (!this.assistenciaOpen.material) {
                  return this.artigos.patch(
                    dbArtigo.id,
                    { ...dbArtigo, qty: dbArtigo.qty - artigo.qty }
                  );
                } else {
                  id = this.assistenciaOpen.material.findIndex(obj => obj.id === artigo.id);
                  if (id < 0) {
                    return this.artigos.patch(
                      dbArtigo.id,
                      { ...dbArtigo, qty: dbArtigo.qty - artigo.qty }
                    );
                  } else {
                    return this.artigos.patch(
                      dbArtigo.id,
                      { ...dbArtigo, qty: dbArtigo.qty - (artigo.qty - this.assistenciaOpen.material[id].qty) }
                    );
                  }
                }
              }
            )
          )
      )]).pipe(concatMap(a => a), toArray());
    } else {
      return of(null);
    }
  }

  saveAssistencia(newEstado: string, assistencia: Assistencia) {
    if (newEstado !== 'em análise' && !assistencia.relatorio_cliente) {
      return alert('Preenche o relatório para o cliente!');
    }
    return this.saveChangesOnStock(this.material)
      .pipe(
        concatMap(
          () => this.assistencias.patch(assistencia.id, { ...assistencia, estado: newEstado, material: this.material })
            .pipe(
              tap(() => {
                if (newEstado === 'entregue') { this.printService.printAssistenciaSaida(assistencia); }
              }),
              tap(() => window.history.back())
            )
        )
      ).subscribe();
  }

  openNewAssistenciaWithThisData(assistencia: Assistencia) {
    this.uiService.patchState(
      {
        // modals
        // pages
        assistenciasCriarNovaPageContactoClienteForm: {
          contacto: assistencia.cliente_user_contacto
        },
        assistenciasCriarNovaPageCriarNovaForm: {
          ...assistencia,
          problema: `(Ficha anterior: ${assistencia.id}) `,
          orcamento: null
        },
        // prints
      }
    )
      .subscribe(() => this.router.navigate(['/dashboard/assistencias-criar-nova']));
  }

  navigateBack() {
    window.history.back();
  }

  searchArtigo(input?: string) {
    if (input) {
      const inputSplited = input.split(' ');
      const inputMapped = inputSplited.map(word =>
        '{"$or": [' +
        '{ "marca": { "$like": "%' + word + '%" }},' +
        '{ "modelo": { "$like": "%' + word + '%" }},' +
        '{ "descricao": { "$like": "%' + word + '%" }}' +
        ' ]}'
      );
      const dbQuery =
        '{' +
        '"query": {' +
        '"$limit": "200",' +
        '"$and": [' +
        inputMapped +
        ']' +
        '}' +
        '}';

      this.artigos
        .find(JSON.parse(dbQuery))
        .pipe(
          map((artigos: Artigo[]) => {
            if (this.material) {
              return artigos.map(
                artigo => {
                  const id = this.material.findIndex(item => item.id === artigo.id);
                  if (id > -1) {
                    if (!this.assistenciaOpen.material || !this.assistenciaOpen.material[id].qty) {
                      return { ...artigo, qty: artigo.qty - this.material[id].qty };
                    } else {
                      return { ...artigo, qty: artigo.qty - (this.material[id].qty - this.assistenciaOpen.material[id].qty) };
                    }
                  } else {
                    return artigo;
                  }
                }
              );
            } else {
              return artigos;
            }
          })
        )
        .subscribe((res: Artigo[]) => this.results = res);
    }
  }

  addArtigo(artigoInStock: Artigo) {
    const artigo = { ...artigoInStock, qty: 1 };
    let materialQ = this.material;
    if (artigoInStock.qty > 0) {
      if (materialQ) {
        if (materialQ.findIndex(item => item.id === artigo.id) < 0) {
          materialQ = [...materialQ, artigo];
        } else {
          materialQ = materialQ.map(
            itemQ => {
              if (itemQ.id === artigo.id) {
                return { ...itemQ, qty: itemQ.qty + 1 };
              } else {
                return itemQ;
              }
            }
          );
        }
      } else {
        materialQ = [artigo];
      }
      const resultIndex = this.results.findIndex(result => result.id === artigo.id);
      this.results[resultIndex].qty = this.results[resultIndex].qty - artigo.qty;
      this.material = materialQ;
      this.materialModal = false;
    }
  }

  openQtyModal(artigo: Artigo) {
    this.qtyModal = true;
    this.openArtigo = artigo;
    this.artigos.get(artigo.id)
      .pipe(
        map(a => a[0])
      )
      .subscribe(dbArtigo => this.openDBArtigo = dbArtigo);
  }

  editQty(artigo: Artigo) {
    if (artigo.qty > this.openDBArtigo.qty) {
      artigo.qty = this.openDBArtigo.qty;
    }
    this.material = this.material.map(
      artigoItem => {
        if (artigoItem.id === artigo.id) {
          return artigo;
        } else {
          return artigoItem;
        }
      }
    );
    this.qtyModal = false;
  }

}
