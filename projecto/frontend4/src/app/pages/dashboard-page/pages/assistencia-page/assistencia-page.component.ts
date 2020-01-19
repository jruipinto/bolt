import { Component, AfterContentInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FocusMonitor } from '@angular/cdk/a11y';
import { map, concatMap, tap, toArray } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { Assistencia, Artigo, Encomenda, User } from 'src/app/shared/models';
import { PrintService } from 'src/app/pages/dashboard-page/prints/print.service';
import { UIService } from 'src/app/shared/state/ui.service';
import { AssistenciasService, ArtigosService, EncomendasService, UsersService } from 'src/app/shared/state';
import { Observable, concat, of } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { clone, uniqBy } from 'ramda';
import { dbQuery } from 'src/app/shared/utilities';
import { AuthService } from 'src/app/shared';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencia-page',
  templateUrl: './assistencia-page.component.html',
  styleUrls: ['./assistencia-page.component.scss']
})
export class AssistenciaPageComponent implements AfterContentInit, OnDestroy {
  public loading = true;
  public tecnicos$ = this.users.find({ query: { tipo: 'tecnico' } });
  public assistencia: Assistencia;
  public tecnicoSelectModalOpened = false;
  public artigoSearchModalOpened = false;
  public artigoSearchForm = this.fb.group({
    input: [null]
  });
  public wizardArtigoSearchForm = this.fb.group({
    input: [null]
  });
  public artigoSearchResults: Artigo[];
  public encomendaWizardOpened = false;
  @ViewChild('artigoSearchModalInput', { static: false }) artigoSearchModalInputEl: ElementRef<HTMLElement>;
  @ViewChild('encomendaWizardInput', { static: false }) encomendaWizardInputEl: ElementRef<HTMLElement>;
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
    private users: UsersService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private focusMonitor: FocusMonitor) {
  }

  ngAfterContentInit() {
    this.route.paramMap.pipe(
      tap(() => this.loading = true),
      concatMap(params => this.assistencias.get(+params.get('id'))),
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
        if (!this.assistencia || this.loading) {
          this.assistencia = clone(assistencia);
          this.loading = false;
        }
      });
  }

  ngOnDestroy() { }


  saveAssistencia(newEstado: string, arg: Assistencia) {
    const assistencia = clone(arg);
    const assistenciaOnInit = clone(this.assistenciaOnInit);
    const editor_action = newEstado === assistenciaOnInit.estado ? 'edição' : 'novo estado';
    if ((newEstado !== 'em análise' && newEstado !== 'recebido') && !assistencia.relatorio_cliente) {
      return alert('Preenche o relatório para o cliente!');
    }
    if (
      (
        newEstado === 'em análise' ||
        newEstado === 'contacto pendente' ||
        newEstado === 'orçamento pendente' ||
        newEstado === 'aguarda material' ||
        newEstado === 'concluído'
      )
      && assistenciaOnInit.estado === 'recebido'
    ) {
      assistencia.tecnico_user_id = this.authService.getUserId();
    }

    return of(null).pipe(

      // calculates the mutations provoked by assistencia.material  and submits them to artigosApi
      concatMap(() => {
        if (
          (!assistenciaOnInit.material || !assistenciaOnInit.material.length)
          && (!assistencia.material || !assistencia.material.length)
        ) {
          return of(null);
        }
        const materialMutation = () => {
          if (assistenciaOnInit.material) {
            return uniqBy(
              ({ id }) => id,
              [
                ...assistenciaOnInit.material.map(artigoOnInit => {
                  const currentArtigo = assistencia.material.filter(({ id }) => artigoOnInit.id === id)[0];
                  if (currentArtigo) {
                    return {
                      ...artigoOnInit,
                      qty: (artigoOnInit.qty - currentArtigo.qty)
                    };
                  }
                  return artigoOnInit;
                }),
                ...assistencia.material.map(e => ({ ...e, qty: -e.qty }))
              ]
            );
          }
          return assistencia.material.map(e => ({ ...e, qty: -e.qty }));
        };
        return concat(...materialMutation().map(
          (artigoMutation: Artigo) => this.artigos.get(artigoMutation.id).pipe(
            map((res: Artigo[]) => res[0]),
            concatMap(artigoOnDB => this.artigos.patch(
              artigoOnDB.id,
              { qty: (artigoOnDB.qty + artigoMutation.qty) }
            ))
          )
        )).pipe(toArray());
      }),

      // create encomendas (wich estado === 'nova') on encomendasApi
      concatMap((): Observable<Partial<Encomenda>[]> => {
        if (!assistencia.encomendas || !assistencia.encomendas.length) {
          return of(null);
        }
        return concat(
          ...assistencia.encomendas
            .filter(({ estado }) => estado === 'nova')
            .map(encomenda => this.encomendas.create({ ...encomenda, estado: 'registada' }).pipe(
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
            ))
        ).pipe(
          toArray(),
          map((encomendasMod): Partial<Encomenda>[] => uniqBy(
            ({ id }) => id,
            [...encomendasMod, ...assistencia.encomendas])
          ),
          map(encomendas => encomendas.filter(({ id }) => id))
        );
      }),

      // submit assistencia to assistenciasApi, print paper and return to last page
      concatMap(encomendas => this.assistencias.patch(
        assistencia.id,
        {
          ...assistencia,
          estado: newEstado,
          material: assistencia.material,
          encomendas
        },
        editor_action
      )),
      tap(() => newEstado === 'entregue' ? this.printService.printAssistenciaSaida(assistencia) : null),
      tap(() => window.history.back())

    ).subscribe();
  }


  createAssistenciaWithThisData(assistencia: Assistencia) {
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
    ).subscribe(() => this.router.navigate(['/dashboard/assistencias-criar-nova']));
  }


  navigateBack() {
    window.history.back();
  }


  searchArtigo(input?: string) {
    if (!input) {
      return;
    }

    this.artigos.find(dbQuery(input, ['marca', 'modelo', 'descricao'])).pipe(
      map((artigos: Artigo[]) => artigos.map(
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
      ))
    ).subscribe((res: Artigo[]) => this.artigoSearchResults = clone(res));
  }

  addArtigo(artigoInStock: Artigo) {
    if (artigoInStock.qty < 1) {
      return;
    }
    const artigo = { ...artigoInStock, qty: 1 };
    let material = clone(this.assistencia.material);
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
    this.artigoSearchModalOpened = false;
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

  cloneRelatorioInterno() {
    this.assistencia.relatorio_cliente = clone(this.assistencia.relatorio_interno);
  }

  openArtigoSearchModal() {
    this.artigoSearchModalOpened = true;
    setTimeout(() => this.focusMonitor.focusVia(this.artigoSearchModalInputEl, 'program'), 0.1);
  }

  openEncomendaWizard() {
    this.encomendaWizardOpened = true;
    setTimeout(() => this.focusMonitor.focusVia(this.encomendaWizardInputEl, 'program'), 0.1);
  }

  replaceTecnicoBy(tecnico: User) {
    this.assistencia.tecnico_user_id = tecnico.id;
    this.assistencia.tecnico = tecnico.nome;
    this.tecnicoSelectModalOpened = false;
  }

}
