/* angular modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
/* third party modules*/
import { ClarityModule } from '@clr/angular';
/* routing & custom modules */
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgxsDashboardStoreModule } from './dashboard-store.module';
/* components */
import { DashboardComponent } from './dashboard.component';
import {
  AssistenciasComponent, CriarNovaComponent, HistoricoComponent,
  StockComponent, EncomendasComponent, PainelRapidoComponent,
  AssistenciaModalComponent
} from './pages';
/* shared components */
import { RCardComponent, RModalComponent, RDataRowComponent } from 'src/app/shared/components';
/* directives */
import { AutofocusDirective } from 'src/app/shared';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,
    NgxsDashboardStoreModule,
    ClarityModule
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
    AutofocusDirective,
    PainelRapidoComponent,
    AssistenciaModalComponent
  ]
})
export class DashboardModule { }
