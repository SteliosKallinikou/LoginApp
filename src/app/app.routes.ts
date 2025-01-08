import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './shared/guard/authGuard';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { unsavedChangesGuard } from './shared/guard/unsaved-changes.guard';
import { ErrorPageComponent } from './error-page/error-page.component';
import { TestPageComponent } from './test-page/test-page.component';
import { TestPageOlderComponent } from './test-page-older/test-page-older.component';

import { RegisterComponent } from './register/register.component';
import {ageGuard} from './shared/guard/ageGuard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard/:userName',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'general-test',
    children: [
      {
        path: '',
        component: TestPageComponent,
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: ':UserAge',
        component: TestPageOlderComponent,
        canActivate: [authGuard,ageGuard],
        canDeactivate: [unsavedChangesGuard],
      },
    ],
  },
  {
    path: '**',
    component: ErrorPageComponent,
  },
];
