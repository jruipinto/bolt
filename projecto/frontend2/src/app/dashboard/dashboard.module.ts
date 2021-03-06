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
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { ArtigosState } from '../store/artigos.state';
import { AssistenciasState } from '../store/assistencias.state';
import { EncomendasState } from '../store/encomendas.state';
import { UsersState } from '../store/users.state';
import { CriarNovaState } from './criar-nova/criar-nova.component.state';
import { RCardComponent, RModalComponent, RDataRowComponent } from '../shared/components';
import { AutofocusDirective } from '../shared';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,
    NgxsFormPluginModule,
    NgxsModule.forFeature([
      ArtigosState,
      AssistenciasState,
      EncomendasState,
      UsersState,
      CriarNovaState
    ])
  ],
  declarations: [
    DashboardComponent,
    AssistenciasComponent,
    CriarNovaComponent,
    HistoricoComponent,
    StockComponent,
    EncomendasComponent,
    RCardComponent,
    RModalComponent,
    RDataRowComponent,
    AutofocusDirective
  ]
})
export class DashboardModule { }
