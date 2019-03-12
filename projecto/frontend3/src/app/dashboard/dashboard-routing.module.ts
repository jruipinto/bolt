import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { StockComponent } from './stock/stock.component';
import { EncomendasComponent } from './encomendas/encomendas.component';
import { AssistenciasComponent } from './assistencias/assistencias.component';
import { CriarNovaComponent } from './criar-nova/criar-nova.component';
import { HistoricoComponent } from './historico/historico.component';
import { PainelRapidoComponent } from './painel-rapido/painel-rapido.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'painelrapido', component: PainelRapidoComponent },
          { path: 'assistencias', component: AssistenciasComponent },
          { path: 'criarnova', component: CriarNovaComponent },
          { path: 'encomendas', component: EncomendasComponent },
          { path: 'historico', component: HistoricoComponent },
          { path: 'stock', component: StockComponent },
          { path: 'login', redirectTo: '/login' },
          { path: '', redirectTo: '/dashboard/painelrapido', pathMatch: 'full' },
          { path: '**', redirectTo: '/dashboard/painelrapido' }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
