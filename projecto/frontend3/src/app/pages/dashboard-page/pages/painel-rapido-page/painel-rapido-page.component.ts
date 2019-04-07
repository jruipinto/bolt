import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import {
  PainelRapidoFindEncomendas,
  PainelRapidoPageState, PainelRapidoPageStateModel, PainelRapidoFindOrcamentos, PainelRapidoFindPedidosContactoCliente
} from './painel-rapido-page.state';
import { Encomenda, Assistencia } from 'src/app/shared';

@Component({
  selector: 'app-painel-rapido-page',
  templateUrl: './painel-rapido-page.component.html',
  styleUrls: ['./painel-rapido-page.component.scss']
})
export class PainelRapidoPageComponent implements OnInit {

  @Select(PainelRapidoPageState)
  public painelRapidoPageState$: Observable<PainelRapidoPageStateModel>;
  public encomendas: Encomenda[];
  public orcamentos: Partial<Assistencia[]>;
  public pedidosContactoCliente: Partial<Assistencia[]>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch([new PainelRapidoFindEncomendas, new PainelRapidoFindOrcamentos, new PainelRapidoFindPedidosContactoCliente])
      .subscribe(() =>
        this.painelRapidoPageState$
          .subscribe(
            painelRapidoPageState => {
              this.encomendas = painelRapidoPageState.encomendas;
              this.orcamentos = painelRapidoPageState.orcamentos;
              this.pedidosContactoCliente = painelRapidoPageState.pedidosContactoCliente;
            }
          )
      );
  }

}
