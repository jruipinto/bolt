import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AssistenciasComponent } from './assistencias/assistencias.component';
import { CriarNovaComponent } from './criar-nova/criar-nova.component';
import { HistoricoComponent } from './historico/historico.component';
import { StockComponent } from './stock/stock.component';
import { EncomendasComponent } from './encomendas/encomendas.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent,
    AssistenciasComponent,
    CriarNovaComponent,
    HistoricoComponent,
    StockComponent,
    EncomendasComponent
  ]
})
export class DashboardModule { }
