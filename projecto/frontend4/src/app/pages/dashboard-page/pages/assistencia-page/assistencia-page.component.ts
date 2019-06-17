import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map, concatMap, tap } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { Assistencia, Artigo } from 'src/app/shared/models';
import { PrintService } from 'src/app/pages/dashboard-page/prints/print.service';
import { UIService, UI } from 'src/app/shared/state/ui.service';
import { AssistenciasService, ArtigosService } from 'src/app/shared/state';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@AutoUnsubscribe()
@Component({
  selector: 'app-assistencia-page',
  templateUrl: './assistencia-page.component.html',
  styleUrls: ['./assistencia-page.component.scss']
})
export class AssistenciaPageComponent implements OnInit, OnDestroy {
  public assistencia: Assistencia;
  public modal = false;
  public artigoSearchForm = this.fb.group({
    input: [null]
  });
  public results: Artigo[];
  public material: Artigo[];

  constructor(
    private printService: PrintService,
    private uiService: UIService,
    private assistencias: AssistenciasService,
    private artigos: ArtigosService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        concatMap((params: ParamMap) => this.assistencias.getAndWatch(+params.get('id')))
      )
      .subscribe(
        (assistencias: Assistencia[]) => this.assistencia = assistencias[0]
      );
  }

  ngOnDestroy() { }

  saveAssistencia(newEstado: string, assistencia: Assistencia) {
    if (newEstado !== 'em análise' && !assistencia.relatorio_cliente) {
      return alert('Preenche o relatório para o cliente!');
    }
    return this.assistencias.patch(assistencia.id, { ...assistencia, estado: newEstado })
      .pipe(
        tap(() => {
          if (newEstado === 'entregue') { this.printService.printAssistenciaSaida(assistencia); }
        }),
        tap(() => window.history.back())
      )
      .subscribe();
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
        .findAndWatch(JSON.parse(dbQuery))
        .subscribe((res: Artigo[]) => this.results = res);
    }
  }

  addArtigo(artigoInStock: Artigo) {
    const artigo = { ...artigoInStock, qty: 1 };
    let list = this.material;
    if (artigoInStock.qty > 0) {
      if (list) {
        list.map(
          item => {
            if (item.id === artigo.id) {
              item.qty++;
              return item;
            } else {
              return item;
            }
          }
        );
        if (list.findIndex(a => a.id === artigo.id) < 0) {
          list = [...list, artigo];
        }
      } else {
        list = [artigo];
      }
      this.material = list;
      this.modal = false;
    }
  }

}
