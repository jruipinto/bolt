import {
  Component,
  AfterContentInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FocusMonitor } from '@angular/cdk/a11y';
import { map, concatMap, tap, toArray } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { Assistencia, Artigo, Encomenda, User } from 'src/app/shared/models';
import { PrintService } from 'src/app/pages/dashboard-page/prints/print.service';
import {
  AssistenciasService,
  ArtigosService,
  EncomendasService,
  UsersService,
} from 'src/app/shared/state';
import { Observable, concat, of } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { clone, uniqBy } from 'ramda';
import { AuthService } from 'src/app/shared';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencia-page',
  templateUrl: './assistencia-page.component.html',
  styleUrls: ['./assistencia-page.component.scss'],
})
export class AssistenciaPageComponent implements AfterContentInit, OnDestroy {
  isLoading = true;
  tecnicos$ = this.users.find({ query: { tipo: 'tecnico' } });
  assistencia: Assistencia;

  wizardArtigoSearchForm = this.fb.group({
    input: [null],
  });
  artigoSearchResults: Artigo[];
  encomendaWizardOpened = false;
  @ViewChild('artigoSearchModalInput')
  artigoSearchModalInputEl: ElementRef<HTMLElement>;
  @ViewChild('encomendaWizardInput')
  encomendaWizardInputEl: ElementRef<HTMLElement>;
  @ViewChild('wizard') wizard;
  @ViewChild('wizardPageTwo') wizardPageTwo;
  wizardEncomendaForm = this.fb.group({
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
    qty: [null, [Validators.required]],
  });
  newEncomendasCounter = 0;
  material: Partial<Artigo>[];
  assistenciaOnInit: Assistencia;
  tecnicoSelectModalOpened = false;

  constructor(
    private printService: PrintService,
    private assistencias: AssistenciasService,
    private artigos: ArtigosService,
    private encomendas: EncomendasService,
    private users: UsersService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private focusMonitor: FocusMonitor
  ) {}

  ngAfterContentInit() {
    this.route.paramMap
      .pipe(
        tap(() => (this.isLoading = true)),
        concatMap((params) => this.assistencias.get(+params.get('id'))),
        map((res) => res[0]),
        tap((assistencia) => (this.assistenciaOnInit = clone(assistencia)))
      )
      .subscribe((assistencia) => {
        if (!this.assistencia || this.isLoading) {
          this.assistencia = clone(assistencia);
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy() {}

  saveAssistencia(newEstado: string, arg: Assistencia) {
    const assistencia = clone(arg);
    const assistenciaOnInit = clone(this.assistenciaOnInit);
    const editor_action =
      newEstado === assistenciaOnInit.estado ? 'edição' : 'novo estado';
    if (
      newEstado !== 'em análise' &&
      newEstado !== 'recebido' &&
      !assistencia.relatorio_cliente
    ) {
      return alert('Preencha o relatório para o cliente!');
    }
    if (newEstado === 'orçamento pendente' && !assistencia.preco) {
      return alert('Para orçamentar assistência o preço não pode ser 0€!');
    }
    // If assistencia.estado is subject of change &&
    // is going to be one of these,
    // then assign the authenticated user to assistencia.tecnico_user_id
    if (
      newEstado !== assistenciaOnInit.estado &&
      (newEstado === 'em análise' ||
        newEstado === 'contacto pendente' ||
        newEstado === 'orçamento pendente' ||
        newEstado === 'aguarda material' ||
        newEstado === 'concluído' ||
        newEstado === 'concluído s/ rep.')
    ) {
      assistencia.tecnico_user_id = this.authService.getUserId();
    }

    return of(null)
      .pipe(
        // calculates the mutations provoked by assistencia.material  and submits them to artigosApi
        concatMap(() => {
          if (
            (!assistenciaOnInit.material ||
              !assistenciaOnInit.material.length) &&
            (!assistencia.material || !assistencia.material.length)
          ) {
            return of(null);
          }
          const materialMutation = () => {
            if (assistenciaOnInit.material) {
              return uniqBy(({ id }) => id, [
                ...assistenciaOnInit.material.map((artigoOnInit) => {
                  const currentArtigo = assistencia.material.filter(
                    ({ id }) => artigoOnInit.id === id
                  )[0];
                  if (currentArtigo) {
                    return {
                      ...artigoOnInit,
                      qty: artigoOnInit.qty - currentArtigo.qty,
                    };
                  }
                  return artigoOnInit;
                }),
                ...assistencia.material.map((e) => ({ ...e, qty: -e.qty })),
              ]);
            }
            return assistencia.material.map((e) => ({ ...e, qty: -e.qty }));
          };
          return concat(
            ...materialMutation().map((artigoMutation: Artigo) =>
              this.artigos.get(artigoMutation.id).pipe(
                map((res: Artigo[]) => res[0]),
                concatMap((artigoOnDB) =>
                  this.artigos.patch(artigoOnDB.id, {
                    qty: artigoOnDB.qty + artigoMutation.qty,
                  })
                )
              )
            )
          ).pipe(toArray());
        }),

        // create encomendas (wich estado === 'nova') on encomendasApi
        concatMap(
          (): Observable<Partial<Encomenda>[]> => {
            if (!assistencia.encomendas || !assistencia.encomendas.length) {
              return of(null);
            }
            return concat(
              ...assistencia.encomendas
                .filter(({ estado }) => estado === 'nova')
                .map((encomenda) =>
                  this.encomendas
                    .create({ ...encomenda, estado: 'registada' })
                    .pipe(
                      map((encomendaDB: Encomenda[]) => encomendaDB[0]),
                      map((encomendaDB) => {
                        const {
                          cliente_user_name,
                          cliente_user_contacto,
                          artigo_marca,
                          artigo_modelo,
                          artigo_descricao,
                          createdAt,
                          updatedAt,
                          registo_cronologico,
                          ...encomendaMod
                        } = encomendaDB;
                        return encomendaMod;
                      })
                    )
                )
            ).pipe(
              toArray(),
              map((encomendasMod): Partial<Encomenda>[] =>
                uniqBy(({ id }) => id, [
                  ...encomendasMod,
                  ...assistencia.encomendas,
                ])
              ),
              map((encomendas) => encomendas.filter(({ id }) => id))
            );
          }
        ),

        // submit assistencia to assistenciasApi, print paper and return to last page
        concatMap((encomendas) =>
          this.assistencias.patch(
            assistencia.id,
            {
              ...assistencia,
              estado: newEstado,
              material: assistencia.material,
              encomendas,
            },
            editor_action
          )
        ),
        tap(() =>
          newEstado === 'entregue'
            ? this.printService.printAssistenciaSaida(assistencia)
            : null
        ),
        tap(() => window.history.back())
      )
      .subscribe();
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
    this.artigoSearchModalOpened = false;
  }

  pushToWizardEncomendaForm(arg: Artigo) {
    const artigo = { ...arg };
    this.wizardEncomendaForm.patchValue({
      artigo_id: artigo.id,
      artigo_marca: artigo.marca,
      artigo_modelo: artigo.modelo,
      artigo_descricao: artigo.descricao,
    });
    this.wizard.navService.currentPage = this.wizardPageTwo;
  }

  addEncomenda(arg: Encomenda) {
    const encomenda = {
      ...arg,
      assistencia_id: this.assistencia.id,
      cliente_user_id: this.assistencia.cliente_user_id,
    };
    this.assistencia.encomendas
      ? (this.assistencia.encomendas = [
          ...this.assistencia.encomendas,
          encomenda,
        ])
      : (this.assistencia.encomendas = [encomenda]);
    this.wizard.reset();
    ++this.newEncomendasCounter;
  }

  encomendasChanged(arg: Encomenda) {
    if (arg.qty < 1) {
      this.assistencia.encomendas = this.assistencia.encomendas
        .filter(({ estado }) => estado === 'nova') // only let to clean 'nova' encomendas
        .filter(({ id }) => id !== arg.id);
    }
    this.newEncomendasCounter = this.assistencia.encomendas.filter(
      ({ estado }) => estado === 'nova'
    ).length;
    this.artigoSearchResults = null; // reset this variable to enforce new search if needed
  }

  replaceTecnicoBy(tecnico: User) {
    this.assistencia.tecnico_user_id = tecnico.id;
    this.assistencia.tecnico = tecnico.nome;
    this.tecnicoSelectModalOpened = false;
  }
}
