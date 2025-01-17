import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { unsavedChangesGuard } from './shared/guard/unsaved-changes.guard';
import { ErrorPageComponent } from './error-page/error-page.component';
import { TestPageOlderComponent } from './test-page-older/test-page-older.component';

import { RegisterComponent } from './register/register.component';

import { BasicTestComponent } from './basic-test/basic-test.component';
import { LeaderBoardsComponent } from './leader-boards/leader-boards.component';
import { authGuard } from './shared/guard/auth-guard';
import { ageGuard } from './shared/guard/age-guard';
import { FeedPageComponent } from './feed-page/feed-page.component';

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
    path: 'dashboard',
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
    path: 'test',
    children: [
      {
        path: '',
        component: BasicTestComponent,
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: ':UserAge',
        component: TestPageOlderComponent,
        canActivate: [authGuard, ageGuard],
        canDeactivate: [unsavedChangesGuard],
      },
    ],
  },
  {
    path: 'leaderboard',
    component: LeaderBoardsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'feed',
    component: FeedPageComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: ErrorPageComponent,
  },
];
