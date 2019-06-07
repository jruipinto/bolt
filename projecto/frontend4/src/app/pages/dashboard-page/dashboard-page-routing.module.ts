/* angular modules */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/* guards */
import { AuthGuard } from 'src/app/shared';
/* components */
import { DashboardPageComponent } from './dashboard-page.component';
import {
  PainelRapidoPageComponent, AssistenciasPageComponent, AssistenciasCriarNovaPageComponent,
  EncomendasPageComponent, EncomendasHistoricoPageComponent,
  StockPageComponent, AssistenciasPesquisarPageComponent, AssistenciaPageComponent, ArtigoPageComponent, EncomendaPageComponent
} from './pages';


const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'painel-rapido', component: PainelRapidoPageComponent },
          { path: 'assistencia/:id', component: AssistenciaPageComponent },
          { path: 'assistencias', component: AssistenciasPageComponent },
          { path: 'assistencias-criar-nova', component: AssistenciasCriarNovaPageComponent },
          { path: 'assistencias-pesquisar', component: AssistenciasPesquisarPageComponent },
          { path: 'artigo/:id', component: ArtigoPageComponent },
          { path: 'artigo', component: ArtigoPageComponent },
          { path: 'encomenda/:id', component: EncomendaPageComponent },
          { path: 'encomenda', component: EncomendaPageComponent },
          { path: 'encomendas', component: EncomendasPageComponent },
          { path: 'encomendas-criar-nova', component: EncomendaPageComponent },
          { path: 'encomendas-historico', component: EncomendasHistoricoPageComponent },
          { path: 'stock', component: StockPageComponent },
          { path: 'login', redirectTo: '/login' },
          { path: '', redirectTo: '/dashboard/painel-rapido', pathMatch: 'full' },
          { path: '**', redirectTo: '/dashboard/painel-rapido' }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardPageRoutingModule { }
