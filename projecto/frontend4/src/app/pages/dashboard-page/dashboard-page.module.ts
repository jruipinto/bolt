/* angular modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
/* third party modules*/
import { ClarityModule } from '@clr/angular';
/* routing & custom modules */
import { DashboardPageRoutingModule } from './dashboard-page-routing.module';
/* directives */
import { AutofocusDirective } from 'src/app/shared';
/* shared components */
import { RCardComponent, RDataRowComponent } from 'src/app/shared/components';
/* components */
import { DashboardPageComponent } from './dashboard-page.component';
import { AssistenciaEntradaPrintComponent, AssistenciaSaidaPrintComponent } from './prints';
import {
  AssistenciasPageComponent, AssistenciasPesquisarPageComponent,
  AssistenciasCriarNovaPageComponent, EncomendaPageComponent,
  EncomendasCriarNovaPageComponent, EncomendasPageComponent,
  StockPageComponent, PainelRapidoPageComponent,
  AssistenciaPageComponent, ArtigoPageComponent
} from './pages';
import { EncomendasPesquisarPageComponent } from './pages/encomendas-pesquisar-page/encomendas-pesquisar-page.component';
import { AssistenciasConcluidasPageComponent } from './pages/assistencias-concluidas-page/assistencias-concluidas-page.component';
import { EncomendaPromptModalComponent } from './modals/encomenda-prompt-modal';


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
    RDataRowComponent,
    DashboardPageComponent,
    AssistenciasPageComponent,
    AssistenciasCriarNovaPageComponent,
    StockPageComponent,
    EncomendasPageComponent,
    PainelRapidoPageComponent,
    EncomendasCriarNovaPageComponent,
    AssistenciaEntradaPrintComponent,
    AssistenciaSaidaPrintComponent,
    AssistenciasPesquisarPageComponent,
    AssistenciaPageComponent,
    ArtigoPageComponent,
    EncomendaPageComponent,
    EncomendasPesquisarPageComponent,
    AssistenciasConcluidasPageComponent,
    EncomendaPromptModalComponent
  ]
})
export class DashboardPageModule { }
