import { Component, AfterContentInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { EncomendasService } from 'src/app/shared/state';
import { Observable } from 'rxjs';
import { Encomenda } from 'src/app/shared';

@AutoUnsubscribe()
@Component({
  selector: 'app-encomendas-page',
  templateUrl: './encomendas-page.component.html',
  styleUrls: ['./encomendas-page.component.scss'],
})
export class EncomendasPageComponent implements AfterContentInit, OnDestroy {
  public isLoading = true;
  public inOverflow = null;
  public encomendas$: Observable<Encomenda[]>;
  public encomendasTodas$ = this.encomendas.state$.pipe(
    map((state) =>
      state
        ? state.filter(
            (encomenda) =>
              encomenda.estado === 'registada' ||
              encomenda.estado === 'marcada para ir ao fornecedor' ||
              encomenda.estado === 'adquirida' ||
              encomenda.estado === 'esgotada' ||
              encomenda.estado === 'sem fornecedor' ||
              encomenda.estado === 'aguarda resposta de fornecedor' ||
              encomenda.estado === 'aguarda entrega' ||
              encomenda.estado === 'recebida' ||
              encomenda.estado === 'detectado defeito'
          )
        : null
    )
  );
  public encomendasMarcadas$ = this.encomendas.state$.pipe(
    map((state) =>
      state
        ? state.filter(
            (encomenda) => encomenda.estado === 'marcada para ir ao fornecedor'
          )
        : null
    )
  );
  public encomendasAguardaEntrega$ = this.encomendas.state$.pipe(
    map((state) =>
      state
        ? state.filter((encomenda) => encomenda.estado === 'aguarda entrega')
        : null
    )
  );
  public encomendasRecebidas$ = this.encomendas.state$.pipe(
    map((state) =>
      state
        ? state.filter((encomenda) => encomenda.estado === 'recebida')
        : null
    )
  );

  constructor(private encomendas: EncomendasService, private router: Router) {}

  /*
    estados possiveis:
    registada
    marcada para ir ao fornecedor
    adquirida (quando se vai ao fornecedor buscar / = "recebido" mas mais especifico)
    esgotada (quando não há mas se adivinha que vai haver e fica pendente)
    sem fornecedor (quando nao se arranja material em lado nenhum)
    aguarda resposta de fornecedor (quando fornecedor fica de dar uma resposta)
    aguarda entrega (quando está comprado)
    recebida
    detectado defeito (igual a "registada", reinicia o processo + contacto pendente de assistencias + criar nota no todo do card)
    entregue
  */

  ngAfterContentInit() {
    window.innerWidth < 890
      ? (this.inOverflow = 'inOverflow')
      : (this.inOverflow = null);
    this.encomendas
      .find({ query: { $limit: 200, estado: { $ne: 'entregue' } } })
      .subscribe(() => (this.isLoading = false));
    this.filterEncomendas('aguarda entrega');
  }

  ngOnDestroy() {}

  filterEncomendas(arg: 'todas' | 'marcadas' | 'aguarda entrega' | 'recebida') {
    if (arg === 'todas') {
      return (this.encomendas$ = this.encomendasTodas$);
    }
    if (arg === 'marcadas') {
      return (this.encomendas$ = this.encomendasMarcadas$);
    }
    if (arg === 'aguarda entrega') {
      return (this.encomendas$ = this.encomendasAguardaEntrega$);
    }
    if (arg === 'recebida') {
      return (this.encomendas$ = this.encomendasRecebidas$);
    }
  }

  onResize(event) {
    const width = event.target.innerWidth;
    width < 890 ? (this.inOverflow = 'inOverflow') : (this.inOverflow = null);
  }
}
