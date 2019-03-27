/* angular modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
/* third party modules*/
import { ClarityModule } from '@clr/angular';
/* routing & custom modules */
import { DashboardPageRoutingModule } from './dashboard-page-routing.module';
import { DashboardPageStoreModule } from './dashboard-page-store.module';
/* components */
import { DashboardPageComponent } from './dashboard-page.component';
import {
  AssistenciasPageComponent, AssistenciasCriarNovaPageComponent, EncomendasHistoricoPageComponent,
  StockPageComponent, EncomendasPageComponent, PainelRapidoPageComponent,
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
    DashboardPageRoutingModule,
    DashboardPageStoreModule,
    ClarityModule
  ],
  declarations: [
    AutofocusDirective,
    RCardComponent,
    RModalComponent,
    RDataRowComponent,
    DashboardPageComponent,
    AssistenciasPageComponent,
    AssistenciasCriarNovaPageComponent,
    EncomendasHistoricoPageComponent,
    StockPageComponent,
    EncomendasPageComponent,
    PainelRapidoPageComponent,
    AssistenciaModalComponent
  ]
})
export class DashboardPageModule { }
