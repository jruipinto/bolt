import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import {
  PainelRapidoPageFindEncomendas, PainelRapidoPageState,
  PainelRapidoPageStateModel, PainelRapidoPageFindOrcamentos,
  PainelRapidoPageFindPedidosContactoCliente
} from './painel-rapido-page.state';
import { AssistenciaModalGetAssistencia } from 'src/app/pages/dashboard-page/modals/assistencia-modal';
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
    this.store.dispatch([
      new PainelRapidoPageFindEncomendas,
      new PainelRapidoPageFindOrcamentos,
      new PainelRapidoPageFindPedidosContactoCliente])
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

  openAssistencia(id: number): void {
    this.store.dispatch(new AssistenciaModalGetAssistencia(id));
  }

}
