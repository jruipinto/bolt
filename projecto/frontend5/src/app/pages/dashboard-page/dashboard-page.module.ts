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
  RDataRowModule,
  ChatWidgetModule,
  BackButtonModule,
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
  ArtigoPageComponent,
} from './pages';
import { EncomendasPesquisarPageComponent } from './pages/encomendas-pesquisar-page/encomendas-pesquisar-page.component';
import { AssistenciasConcluidasPageComponent } from './pages/assistencias-concluidas-page/assistencias-concluidas-page.component';
import { EncomendaPromptModalComponent } from './modals/encomenda-prompt-modal';
import { ClientesPesquisarModalComponent } from './modals/clientes-pesquisar-modal/clientes-pesquisar-modal.component';
import { ConfigsPageComponent } from './pages/configs-page/configs-page.component';
import { PainelRapidoPageModule } from './pages/painel-rapido-page/painel-rapido-page.module';
import { RLoadingModule } from 'src/app/shared/components/r-loading/r-loading.module';
import { AssistenciaPageModule } from './pages/assistencia-page/assistencia-page.module';
import { ArtigoModule } from './components/artigo/artigo.module';
import { AssistenciaModule } from './components/assistencia/assistencia.module';
import { EncomendaModule } from './components/encomenda/encomenda.module';

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
    AssistenciaPageModule,
    BackButtonModule,
    RDataRowModule,
    ArtigoModule,
    AssistenciaModule,
    EncomendaModule,
  ],
  declarations: [
    RCardComponent,
    DashboardPageComponent,
    AssistenciasPageComponent,
    AssistenciasCriarNovaPageComponent,
    StockPageComponent,
    EncomendasPageComponent,
    EncomendasCriarNovaPageComponent,
    AssistenciaEntradaPrintComponent,
    AssistenciaSaidaPrintComponent,
    AssistenciasPesquisarPageComponent,
    ArtigoPageComponent,
    EncomendaPageComponent,
    EncomendasPesquisarPageComponent,
    AssistenciasConcluidasPageComponent,
    EncomendaPromptModalComponent,
    ClientesPesquisarModalComponent,
    ConfigsPageComponent,
  ],
})
export class DashboardPageModule {}
