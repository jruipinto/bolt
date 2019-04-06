import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import {
  PainelRapidoFindEncomendas,
  PainelRapidoPageState, PainelRapidoPageStateModel, PainelRapidoFindOrcamentos, PainelRapidoFindPedidosContactoCliente
} from './painel-rapido-page.state';

@Component({
  selector: 'app-painel-rapido-page',
  templateUrl: './painel-rapido-page.component.html',
  styleUrls: ['./painel-rapido-page.component.scss']
})
export class PainelRapidoPageComponent implements OnInit {

  @Select(PainelRapidoPageState)
  public painelRapidoPageState$: Observable<PainelRapidoPageStateModel>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch([new PainelRapidoFindEncomendas, new PainelRapidoFindOrcamentos, new PainelRapidoFindPedidosContactoCliente]);
  }

}
