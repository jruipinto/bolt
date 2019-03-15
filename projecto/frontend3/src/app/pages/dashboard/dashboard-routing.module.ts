/* angular modules */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/* guards */
import { AuthGuard } from 'src/app/shared';
/* components */
import { DashboardComponent } from './dashboard.component';
import {
  PainelRapidoComponent, AssistenciasComponent, CriarNovaComponent,
  EncomendasComponent, HistoricoComponent, StockComponent
} from './pages';


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
