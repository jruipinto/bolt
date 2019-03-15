/* angular modules */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* guards */
import { AuthGuard } from './shared/guards/auth.guard';

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
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    canLoad: [AuthGuard]
  },
  { path: '',   redirectTo: '/dashboard/painelrapido', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard/painelrapido' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
