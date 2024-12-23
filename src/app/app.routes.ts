import { Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {authGuardGuard} from './shared/guard/auth-guard.guard';
import {LoginComponent} from './login/login.component';

export const routes: Routes = [
  {
    path: 'dashboard/:name',
    component:DashboardComponent,
    canActivate: [authGuardGuard]
  },
  {
    path:'login',
    component: LoginComponent
  }
];
