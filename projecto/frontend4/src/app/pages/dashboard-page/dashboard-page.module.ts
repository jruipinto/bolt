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
import { RCardComponent, RModalComponent, RDataRowComponent } from 'src/app/shared/components';
/* components */
import { DashboardPageComponent } from './dashboard-page.component';
import { AssistenciaModalComponent, ArtigoModalComponent } from './modals';
import { AssistenciaEntradaPrintComponent, AssistenciaSaidaPrintComponent } from './prints';
import {
  AssistenciasPageComponent, AssistenciasPesquisarPageComponent,
  AssistenciasCriarNovaPageComponent, EncomendaPageComponent,
  EncomendasCriarNovaPageComponent,
  EncomendasHistoricoPageComponent, EncomendasPageComponent,
  StockPageComponent, PainelRapidoPageComponent,
  AssistenciaPageComponent, ArtigoPageComponent
} from './pages';
import { EncomendasPesquisarPageComponent } from './pages/encomendas-pesquisar-page/encomendas-pesquisar-page.component';
import { EncomendaPromptModalComponent } from './modals/encomenda-prompt-modal/encomenda-prompt-modal.component';


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
    AssistenciaEntradaPrintComponent,
    AssistenciaSaidaPrintComponent,
    AssistenciasPesquisarPageComponent,
    ArtigoModalComponent,
    AssistenciaPageComponent,
    ArtigoPageComponent,
    EncomendaPageComponent,
    EncomendasPesquisarPageComponent,
    EncomendaPromptModalComponent
  ]
})
export class DashboardPageModule { }
