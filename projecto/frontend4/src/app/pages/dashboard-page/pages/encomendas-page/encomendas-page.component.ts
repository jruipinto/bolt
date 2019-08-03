import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { EncomendasService, UIService } from 'src/app/shared/state';
import { Observable } from 'rxjs';
import { Encomenda } from 'src/app/shared';

@AutoUnsubscribe()
@Component({
  selector: 'app-encomendas-page',
  templateUrl: './encomendas-page.component.html',
  styleUrls: ['./encomendas-page.component.scss']
})
export class EncomendasPageComponent implements OnInit, OnDestroy {
  public loading = true;
  public encomendas$: Observable<Encomenda[]>;

  constructor(
    private encomendas: EncomendasService,
    private router: Router) {
  }

  /*
    estados possiveis:
    registada
    marcada para ir ao fornecedor
    adquirida (quando se vai ao fornecedor buscar / = "recebido" mas mais especifico)
    esgotada (quando não há mas se adivinha que vai haver e fica pendente)
    sem fornecedor (quando nao se arranja material em lado nenhum)
    aguarda reposta de fornecedor (quando fornecedor fica de dar uma resposta)
    aguarda entrega (quando está comprado)
    recebida
    detectado defeito (igual a "registada", reinicia o processo + contacto pendente de assistencias + criar nota no todo do card)
    entregue
  */

  ngOnInit() {
    this.encomendas
      .findAndWatch({ query: { $limit: 200, estado: { $ne: 'entregue' } } })
      .subscribe(() => this.loading = false);
    this.filterEncomendas('todas');
  }

  ngOnDestroy() { }


  openEncomenda(encomendaID: number) {
    return this.router.navigate(['/dashboard/encomenda', encomendaID]);
  }

  filterEncomendas(arg: 'todas' | 'marcadas' | 'aguarda entrega' | 'recebida') {
    if (arg === 'todas') {
      return this.encomendas$ = this.encomendas.state$
        .pipe(
          map(state =>
            state
              ? state.filter(encomenda =>
                encomenda.estado === 'registada'
                || encomenda.estado === 'marcada para ir ao fornecedor'
                || encomenda.estado === 'adquirida'
                || encomenda.estado === 'esgotada'
                || encomenda.estado === 'sem fornecedor'
                || encomenda.estado === 'aguarda reposta de fornecedor'
                || encomenda.estado === 'aguarda entrega'
                || encomenda.estado === 'recebida'
                || encomenda.estado === 'detectado defeito')
              : null
          )
        );
    }
    if (arg === 'marcadas') {
      return this.encomendas$ = this.encomendas.state$
        .pipe(
          map(state =>
            state
              ? state.filter(encomenda =>
                encomenda.estado === 'marcada para ir ao fornecedor'
              )
              : null
          )
        );
    }
    if (arg === 'aguarda entrega') {
      return this.encomendas$ = this.encomendas.state$
        .pipe(
          map(state =>
            state
              ? state.filter(encomenda =>
                encomenda.estado === 'aguarda entrega'
              )
              : null
          )
        );
    }
    if (arg === 'recebida') {
      return this.encomendas$ = this.encomendas.state$
        .pipe(
          map(state =>
            state
              ? state.filter(encomenda =>
                encomenda.estado === 'recebida'
              )
              : null
          )
        );
    }
  }

}
