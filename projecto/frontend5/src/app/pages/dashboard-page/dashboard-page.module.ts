/* angular modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
/* third party modules*/
import { ClarityModule } from '@clr/angular';
/* routing & custom modules */
import { DashboardPageRoutingModule } from './dashboard-page-routing.module';
/* directives */
import {
  AutofocusModule,
  FormStateModule,
  AutocapsModule,
} from 'src/app/shared';
/* shared components */
import {
  RCardComponent,
  RDataRowComponent,
  ChatWidgetModule,
} from 'src/app/shared/components';
/* components */
import { DashboardPageComponent } from './dashboard-page.component';
import {
  AssistenciaEntradaPrintComponent,
  AssistenciaSaidaPrintComponent,
} from './prints';
import {
  AssistenciasPageComponent,
  AssistenciasPesquisarPageComponent,
  AssistenciasCriarNovaPageComponent,
  EncomendaPageComponent,
  EncomendasCriarNovaPageComponent,
  EncomendasPageComponent,
  StockPageComponent,
  AssistenciaPageComponent,
  ArtigoPageComponent,
} from './pages';
import { EncomendasPesquisarPageComponent } from './pages/encomendas-pesquisar-page/encomendas-pesquisar-page.component';
import { AssistenciasConcluidasPageComponent } from './pages/assistencias-concluidas-page/assistencias-concluidas-page.component';
import { EncomendaPromptModalComponent } from './modals/encomenda-prompt-modal';
import { ClientesPesquisarModalComponent } from './modals/clientes-pesquisar-modal/clientes-pesquisar-modal.component';
import { ConfigsPageComponent } from './pages/configs-page/configs-page.component';
import { PainelRapidoPageModule } from './pages/painel-rapido-page/painel-rapido-page.module';
import { RLoadingModule } from 'src/app/shared/components/r-loading/r-loading.module';
import { AssistenciaRowComponent } from './pages/assistencias-page/components/assistencia-row/assistencia-row.component';
import { AssistenciaRowListComponent } from './pages/assistencias-page/components/assistencia-row-list/assistencia-row-list.component';
import { ArtigoRowComponent } from './pages/stock-page/components/artigo-row/artigo-row.component';
import { ArtigoRowListComponent } from './pages/stock-page/components/artigo-row-list/artigo-row-list.component';
import { EncomendaRowComponent } from './pages/encomendas-page/components/encomenda-row/encomenda-row.component';
import { EncomendaRowListComponent } from './pages/encomendas-page/components/encomenda-row-list/encomenda-row-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardPageRoutingModule,
    ClarityModule,
    FormStateModule,
    AutocapsModule,
    AutofocusModule,
    ChatWidgetModule,
    PainelRapidoPageModule,
    RLoadingModule,
  ],
  declarations: [
    RCardComponent,
    RDataRowComponent,
    DashboardPageComponent,
    AssistenciasPageComponent,
    AssistenciasCriarNovaPageComponent,
    StockPageComponent,
    EncomendasPageComponent,
    EncomendasCriarNovaPageComponent,
    AssistenciaEntradaPrintComponent,
    AssistenciaSaidaPrintComponent,
    AssistenciasPesquisarPageComponent,
    AssistenciaPageComponent,
    ArtigoPageComponent,
    EncomendaPageComponent,
    EncomendasPesquisarPageComponent,
    AssistenciasConcluidasPageComponent,
    EncomendaPromptModalComponent,
    ClientesPesquisarModalComponent,
    ConfigsPageComponent,
    AssistenciaRowComponent,
    AssistenciaRowListComponent,
    ArtigoRowComponent,
    ArtigoRowListComponent,
    EncomendaRowComponent,
    EncomendaRowListComponent,
  ],
})
export class DashboardPageModule {}
