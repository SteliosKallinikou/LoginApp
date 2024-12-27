import { Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {authGuardGuard} from './shared/guard/auth-guard.guard';
import {LoginComponent} from './login/login.component';
import {ProfileComponent} from './profile/profile.component';
import {unsavedChangesGuard} from './shared/guard/unsaved-changes.guard';

export const routes: Routes = [
  {
    path:'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path:'',
    redirectTo:'/login',
    pathMatch: "full"

  },
  {
    path: 'dashboard/:name',
    component:DashboardComponent,
    canActivate: [authGuardGuard]
  },
  {
    path:'profile/:name',
    component: ProfileComponent,
    canActivate:[authGuardGuard],
    canDeactivate:[unsavedChangesGuard]
  }

];
