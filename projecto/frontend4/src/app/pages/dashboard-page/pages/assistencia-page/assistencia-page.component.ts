import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map, concatMap, tap, toArray } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { Assistencia, Artigo, Encomenda } from 'src/app/shared/models';
import { PrintService } from 'src/app/pages/dashboard-page/prints/print.service';
import { UIService } from 'src/app/shared/state/ui.service';
import { AssistenciasService, ArtigosService, EncomendasService } from 'src/app/shared/state';
import { Observable, concat, of } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
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
  public artigoSearchResults: Artigo[];
  public encomendaWizard = false;
  @ViewChild('wizard', { static: false }) wizard;
  @ViewChild('wizardPageTwo', { static: false }) wizardPageTwo;
  public wizardEncomendaForm = this.fb.group({
    artigo_id: [null, [Validators.required]],
    artigo_marca: [null],
    artigo_modelo: [null],
    artigo_descricao: [null],
    assistencia_id: [null],
    observacao: [null],
    estado: ['nova'],
    previsao_entrega: [null, [Validators.required]],
    orcamento: [null],
    fornecedor: [null],
    qty: [null, [Validators.required]]
  });
  public newEncomendasCounter = 0;
  public material: Partial<Artigo>[];
  public assistenciaOnInit: Assistencia;

  constructor(
    private printService: PrintService,
    private uiService: UIService,
    private assistencias: AssistenciasService,
    private artigos: ArtigosService,
    private encomendas: EncomendasService,
    // private artigosApi: ArtigosApiService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        concatMap((params: ParamMap) => this.assistencias.get(+params.get('id'))),
        map(res => res[0]),
        tap(assistencia => this.assistenciaOnInit = clone(assistencia))
      )
      .subscribe(assistencia => {/*
        if (this.assistencia) {
          const receivedAssistencia = clone(assistencia);
          if (receivedAssistencia.relatorio_interno !== this.assistencia.relatorio_interno
            || receivedAssistencia.relatorio_cliente !== this.assistencia.relatorio_cliente) {
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
        } else {
          this.assistencia = clone(assistencia);
        }*/
        if (!this.assistencia) { this.assistencia = clone(assistencia); }
      });
  }

  ngOnDestroy() { }

  saveChangesOnStock(arg: Partial<Artigo>[]): Observable<any> {
    if (arg && arg.length) {
      const currentMaterial = clone(arg);
      const materialOnInit = clone(this.assistenciaOnInit.material);
      const newMaterial = materialOnInit && materialOnInit.length
        ? materialOnInit.map(
          artigoOnInit => {
            const currentArtigo = currentMaterial.find(a => a.id === artigoOnInit.id);
            if (!currentArtigo) {
              return { ...artigoOnInit, qty: 0 };
            }
            return currentArtigo;
          }
        )
        : currentMaterial;
      return concat(
        newMaterial.map(
          (currentArtigo: Artigo) => this.artigos.get(currentArtigo.id)
            .pipe(
              map((res) => res[0]),
              map(artigoOnDB => {
                const {
                  createdAt,
                  updatedAt,
                  ...artigoOnDBMod
                } = artigoOnDB;
                return artigoOnDBMod;
              }),
              concatMap(artigoOnDB => {
                const artigoOnInit = materialOnInit ? materialOnInit.find(a => a.id === artigoOnDB.id) : null;
                if (!artigoOnInit) {
                  return this.artigos.patch(
                    artigoOnDB.id,
                    { ...artigoOnDB, qty: artigoOnDB.qty - currentArtigo.qty }
                  );
                }
                return this.artigos.patch(
                  artigoOnDB.id,
                  { ...artigoOnDB, qty: artigoOnDB.qty - currentArtigo.qty + artigoOnInit.qty }
                );
              }
              )
            )
        )
      ).pipe(concatMap(a => a), toArray());
    }
    return of(null);
  }

  createEncomendasOnApi(args: Partial<Encomenda>[]) {
    if (args && args) {
      const encomendas = clone(args);
      return concat(encomendas
        .filter(encomenda => encomenda.estado === 'nova')
        .map(encomenda => this.encomendas.create({ ...encomenda, estado: 'registada' })
          .pipe(
            map((encomendaDB: Encomenda[]) => encomendaDB[0]),
            map(encomendaDB => {
              const {
                cliente_user_name,
                cliente_user_contacto,
                artigo_marca,
                artigo_modelo,
                artigo_descricao,
                createdAt,
                updatedAt,
                registo_cronologico,
                ...encomendaMod } = encomendaDB;
              return encomendaMod;
            })
          )
        )).pipe(concatMap(a => a), toArray());
    } else {
      return of(null);
    }
  }

  saveAssistencia(newEstado: string, arg: Assistencia) {
    const assistencia = clone(arg);
    if (newEstado !== 'em análise' && !assistencia.relatorio_cliente) {
      return alert('Preenche o relatório para o cliente!');
    }
    return this.saveChangesOnStock(assistencia.material)
      .pipe(
        concatMap(() => this.createEncomendasOnApi(assistencia.encomendas)),
        concatMap(
          (encomendas) => this.assistencias
            .patch(
              assistencia.id,
              {
                ...assistencia,
                estado: newEstado,
                material: assistencia.material,
                encomendas
              })
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
            return artigos.map(
              artigoOnDB => {
                const currentArtigo = this.assistencia.material
                  ? this.assistencia.material.find(a => a.id === artigoOnDB.id)
                  : null;
                const artigoOnInit = this.assistenciaOnInit.material
                  ? this.assistenciaOnInit.material.find(a => a.id === artigoOnDB.id)
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
                return { ...artigoOnDB, qty: artigoOnDB.qty - currentArtigo.qty + artigoOnInit.qty };
              }
            );
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

  pushToWizardEncomendaForm(arg: Artigo) {
    const artigo = { ...arg };
    this.wizardEncomendaForm.patchValue({
      artigo_id: artigo.id,
      artigo_marca: artigo.marca,
      artigo_modelo: artigo.modelo,
      artigo_descricao: artigo.descricao
    });
    this.wizard.navService.currentPage = this.wizardPageTwo;
  }

  addEncomenda(arg: Encomenda) {
    const encomenda = { ...arg, assistencia_id: this.assistencia.id, cliente_user_id: this.assistencia.cliente_user_id };
    this.assistencia.encomendas
      ? this.assistencia.encomendas = [...this.assistencia.encomendas, encomenda]
      : this.assistencia.encomendas = [encomenda];
    this.wizard.reset();
    ++this.newEncomendasCounter;
  }

  encomendasChanged(arg: Encomenda) {
    if (arg.qty < 1) {
      this.assistencia.encomendas = this.assistencia.encomendas
        .filter(({ estado }) => estado === 'nova') // only let to clean 'nova' encomendas
        .filter(({ id }) => id !== arg.id);
    }
    this.newEncomendasCounter = this.assistencia.encomendas.filter(({ estado }) => estado === 'nova').length;
    this.artigoSearchResults = null; // reset this variable to enforce new search if needed
  }

  materialChanged(arg: Artigo) {
    if (arg.qty < 1) {
      this.assistencia.material = this.assistencia.material
        .filter(({ id }) => id !== arg.id);
    }
    this.artigoSearchResults = null; // reset this variable to enforce new search if needed
  }

  print(arg: Assistencia) {
    const assistencia = clone(arg);
    if (assistencia.estado === 'entregue') {
      return this.printService.printAssistenciaSaida(assistencia);
    }
    return this.printService.printAssistenciaEntrada(assistencia);
  }

}
