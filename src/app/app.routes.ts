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
    path:'',
    redirectTo:'/login',
    pathMatch: "full"

  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard/:userName',
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
    children:[
      {
        path:'',
        component:TestPageComponent,
        canActivate:[authGuardGuard],
        canDeactivate:[unsavedChangesGuard]
      },
      {
        path:':UserAge',
        component: TestPageOlderComponent,
        canActivate:[ageGuardGuard,authGuardGuard],
        canDeactivate:[unsavedChangesGuard]
      }
    ]
  },
  {
    path: '**',
    component: ErrorPageComponent
  }
];
