/* angular modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
/* third party modules*/
import { ClarityModule } from '@clr/angular';
/* routing & custom modules */
import { DashboardPageRoutingModule } from './dashboard-page-routing.module';
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
import { EncomendasCriarNovaPageComponent } from './pages/encomendas-criar-nova-page/encomendas-criar-nova-page.component';
import { ArtigosCriarNovoModalComponent } from './modals/artigos-criar-novo-modal/artigos-criar-novo-modal.component';
import { AssistenciaEntradaPrintComponent } from './prints/assistencia-entrada-print/assistencia-entrada-print.component';
import { AssistenciaSaidaPrintComponent } from './prints/assistencia-saida-print/assistencia-saida-print.component';
import { AssistenciasPesquisarPageComponent } from './pages/assistencias-pesquisar-page/assistencias-pesquisar-page.component';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardPageRoutingModule,
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
    AssistenciaModalComponent,
    EncomendasCriarNovaPageComponent,
    ArtigosCriarNovoModalComponent,
    AssistenciaEntradaPrintComponent,
    AssistenciaSaidaPrintComponent,
    AssistenciasPesquisarPageComponent
  ]
})
export class DashboardPageModule { }
