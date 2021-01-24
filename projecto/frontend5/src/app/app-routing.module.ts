/* angular modules */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/* guards */
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
/* components */
import { LoginPageComponent, SignupPageComponent } from './pages';


const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'signup',
    component: SignupPageComponent
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard-page/dashboard-page.module').then(m => m.DashboardPageModule),
    canLoad: [AuthGuard]
  },
  { path: '',   redirectTo: '/dashboard/painel-rapido', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard/painel-rapido' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
