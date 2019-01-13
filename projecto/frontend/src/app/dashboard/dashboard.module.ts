import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AssistenciasComponent } from './assistencias/assistencias.component';
import { CriarNovaComponent } from './criar-nova/criar-nova.component';
import { HistoricoComponent } from './historico/historico.component';
import { StockComponent } from './stock/stock.component';
import { EncomendasComponent } from './encomendas/encomendas.component';
import { NgxsModule } from '@ngxs/store';
import { AssistenciasState } from '../store/assistencias.state';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,
    NgxsModule.forFeature([AssistenciasState])
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
