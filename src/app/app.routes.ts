import { Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {authGuardGuard} from './shared/guard/auth-guard.guard';
import {LoginComponent} from './login/login.component';
import {ProfileComponent} from './profile/profile.component';
import {unsavedChangesGuard} from './shared/guard/unsaved-changes.guard';
import {ErrorPageComponent} from './error-page/error-page.component';
import {TestPageComponent} from './test-page/test-page.component';
import {TestPageOlderComponent} from './test-page-older/test-page-older.component';
import {ageGuardGuard} from './shared/guard/age-guard.guard';
import {RegisterComponent} from './register/register.component';

export const routes: Routes = [
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'register',
    component: RegisterComponent
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
    path: 'dashboard/:UserName',
    component:DashboardComponent,
    canActivate: [authGuardGuard]
  },
  {
    path:'profile',
    component: ProfileComponent,
    canActivate:[authGuardGuard],
    canDeactivate:[unsavedChangesGuard]
  },
  {
    path:'general-test',
    component: TestPageComponent,
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path:'general-test/:age',
    component: TestPageOlderComponent,
    canActivate:[ageGuardGuard],
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: '**',
    component: ErrorPageComponent
  }
];
