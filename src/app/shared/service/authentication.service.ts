import { DestroyRef, inject, Injectable } from '@angular/core';
import { User } from '../models';
import { UserDataService } from './user-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userService = inject(UserDataService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);

  isAuthenticated(users: User[], input: User): boolean {
    const authUser = users.find(user => user.userName === input.userName && user.password === input.password) || null;
    const isFound = Boolean(authUser?.userName);
    localStorage.setItem('isAuthenticated', isFound.toString());
    localStorage.setItem('user', JSON.stringify(authUser));
    return isFound;
  }

  getAuthenticatedUser(): User {
    return JSON.parse(<string>localStorage.getItem('user'));
  }

  setUserScore(score: string, OlderScore: string, loggedUser: User): void {
    const lastUser = loggedUser;
    loggedUser.score = score;
    loggedUser.olderScore = OlderScore;
    localStorage.setItem('user', JSON.stringify(loggedUser));
    this.userService.changeUserDetails(loggedUser, lastUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  isUserLoggedIn(): boolean {
    return !!JSON.parse(<string>localStorage.getItem('isAuthenticated'));
  }
  logOut(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    this.router.navigate(['']);
  }

  getAge(): number {
    return parseInt(this.getAuthenticatedUser().age);
  }

  getScore(): number {
    return parseInt(this.getAuthenticatedUser().score) || 0;
  }
  getOlderScore(): number {
    return parseInt(this.getAuthenticatedUser().olderScore) || 0;
  }
}
