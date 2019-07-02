import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map, concatMap, tap, toArray, first } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { Assistencia, Artigo } from 'src/app/shared/models';
import { PrintService } from 'src/app/pages/dashboard-page/prints/print.service';
import { UIService, UI } from 'src/app/shared/state/ui.service';
import { AssistenciasService, ArtigosService } from 'src/app/shared/state';
import { Observable, concat, of, BehaviorSubject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ArtigosApiService } from 'src/app/shared';
import { clone } from 'ramda';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencia-page',
  templateUrl: './assistencia-page.component.html',
  styleUrls: ['./assistencia-page.component.scss']
})
export class AssistenciaPageComponent implements OnInit, OnDestroy {
  public assistencia: Assistencia;
  public artigoSearchModal = false;
  public artigoSearchForm = this.fb.group({
    input: [null]
  });
  public wizardArtigoSearchForm = this.fb.group({
    input: [null]
  });
  public wizardEncomendaform = this.fb.group({
    artigo_id: [null],
    artigo_marca: [null],
    artigo_modelo: [null],
    artigo_descricao: [null],
    assistencia_id: [null],
    observacao: [null],
    estado: [null],
    previsao_entrega: [null],
    orcamento: [null],
    fornecedor: [null],
    qty: [null]
  });
  public artigoSearchResults: Artigo[];
  public encomendaWizard = false;
  @ViewChild('wizard', { static: false }) wizard;
  @ViewChild('wizardPageTwo', { static: false }) wizardPageTwo;
  public material: Partial<Artigo>[];
  public assistenciaOnInit: Assistencia;

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
        map((res: Assistencia[]) => res[0]),
        concatMap(
          assistencia => {
            if (assistencia.material) {
              if (typeof assistencia.material === 'string') {
                assistencia.material = JSON.parse(assistencia.material);
              }
              return concat(assistencia.material
                .map(
                  (artigo: Partial<Artigo>) => this.artigos.get(artigo.id)
                    .pipe(
                      map((dbArtigo: Artigo[]) => dbArtigo[0]),
                      map(dbArtigo => dbArtigo = { ...dbArtigo, qty: artigo.qty })
                    )
                ))
                .pipe(
                  concatMap(concats => concats),
                  toArray(),
                  map((material: Artigo[]) => ({ ...assistencia, material }) as Assistencia));
            } else {
              return of(assistencia);
            }
          }
        ),
        tap(assistencia => this.assistenciaOnInit = clone(assistencia))
      )
      .subscribe(assistencia => {
        if (this.assistencia) {
          const receivedAssistencia = clone(assistencia);
          this.assistencia = {
            ...receivedAssistencia,
            relatorio_interno: `alterado por outro utilizador ${receivedAssistencia.updatedAt}:
${receivedAssistencia.relatorio_interno}
-------------------------------------
tuas alterações:
${this.assistencia.relatorio_interno}`,
            relatorio_cliente: `alterado por outro utilizador ${receivedAssistencia.updatedAt}:
${receivedAssistencia.relatorio_cliente}
-------------------------------------
tuas alterações:
${this.assistencia.relatorio_cliente}`
          };
        } else {
          this.assistencia = clone(assistencia);
        }
      });
  }

  ngOnDestroy() { }

  saveChangesOnStock(material: Partial<Artigo>[]) {
    if (material) {
      return concat(material.map(
        (artigo: Artigo) => this.artigos.get(artigo.id)
          .pipe(
            map((res: Artigo[]) => res[0]),
            concatMap(
              dbArtigo => {
                let id: number;
                if (!this.assistenciaOnInit.material) {
                  return this.artigos.patch(
                    dbArtigo.id,
                    { ...dbArtigo, qty: dbArtigo.qty - artigo.qty }
                  );
                } else {
                  id = this.assistenciaOnInit.material.findIndex(obj => obj.id === artigo.id);
                  if (id < 0) {
                    return this.artigos.patch(
                      dbArtigo.id,
                      { ...dbArtigo, qty: dbArtigo.qty - artigo.qty }
                    );
                  } else {
                    return this.artigos.patch(
                      dbArtigo.id,
                      { ...dbArtigo, qty: dbArtigo.qty - (artigo.qty - this.assistenciaOnInit.material[id].qty) }
                    );
                  }
                }
              }
            )
          )
      )).pipe(concatMap(a => a), toArray());
    } else {
      return of(null);
    }
  }

  saveAssistencia(newEstado: string, assistencia: Assistencia) {
    if (newEstado !== 'em análise' && !assistencia.relatorio_cliente) {
      return alert('Preenche o relatório para o cliente!');
    }
    return this.saveChangesOnStock(this.assistencia.material)
      .pipe(
        concatMap(
          () => this.assistencias.patch(assistencia.id, { ...assistencia, estado: newEstado, material: this.assistencia.material })
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
            if (this.assistencia.material) {
              return artigos.map(
                artigo => {
                  const id = this.assistencia.material.findIndex(item => item.id === artigo.id);
                  if (id > -1) {
                    if (!this.assistenciaOnInit.material || !this.assistenciaOnInit.material[id].qty) {
                      return { ...artigo, qty: artigo.qty - this.assistencia.material[id].qty };
                    } else {
                      return { ...artigo, qty: artigo.qty - (this.assistencia.material[id].qty - this.assistenciaOnInit.material[id].qty) };
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
        .subscribe((res: Artigo[]) => this.artigoSearchResults = clone(res));
    }
  }

  addArtigo(artigoInStock: Artigo) {
    const artigo = { ...artigoInStock, qty: 1 };
    let material = clone(this.assistencia.material);
    if (artigoInStock.qty > 0) {
      if (material) {
        if (material.findIndex(item => item.id === artigo.id) < 0) {
          material = [...material, artigo];
        } else {
          material = material.map(
            item => {
              if (item.id === artigo.id) {
                return { ...item, qty: item.qty + 1 };
              } else {
                return item;
              }
            }
          );
        }
      } else {
        material = clone([artigo]);
      }
      const resultIndex = this.artigoSearchResults.findIndex(result => result.id === artigo.id);
      this.artigoSearchResults[resultIndex].qty = this.artigoSearchResults[resultIndex].qty - artigo.qty;
      this.assistencia.material = clone(material);
      this.artigoSearchModal = false;
    }
  }

  pushToWizardEncomendaForm(artigo) {
    this.wizardEncomendaform.patchValue(clone(artigo));
    this.wizard.navService.currentPage = this.wizardPageTwo;
  }

  addEncomenda() {
    this.wizard.reset();
  }

}
