/* angular modules */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/* guards */
import { AuthGuard } from 'src/app/shared';
/* components */
import { DashboardPageComponent } from './dashboard-page.component';
import {
  PainelRapidoPageComponent, AssistenciasPageComponent, AssistenciasCriarNovaPageComponent,
  EncomendasPageComponent, EncomendasHistoricoPageComponent, StockPageComponent
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
          { path: 'assistencias', component: AssistenciasPageComponent },
          { path: 'assistencias-criar-nova', component: AssistenciasCriarNovaPageComponent },
          { path: 'encomendas', component: EncomendasPageComponent },
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
