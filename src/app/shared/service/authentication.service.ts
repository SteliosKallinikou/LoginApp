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

  //TODO this function should be a Getter
  get AuthenticatedUser(): User {
    return JSON.parse(<string>localStorage.getItem('user'));
  }

  setBasicUserScore(score: string, loggedUser: User): void {
    const lastUser = loggedUser;
    loggedUser.score = score;
    localStorage.setItem('user', JSON.stringify(loggedUser));
    this.userService.changeUserDetails(loggedUser, lastUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  setOlderUserScore(score: string, loggedUser: User): void {
    const lastUser = loggedUser;
    loggedUser.olderScore = score;
    localStorage.setItem('user', JSON.stringify(loggedUser));
    this.userService.changeUserDetails(loggedUser, lastUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  //TODO this function should be a Getter
  isUserLoggedIn(): boolean {
    return !!JSON.parse(<string>localStorage.getItem('isAuthenticated'));
  }

  logOut(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    this.router.navigate(['']);
  }

  get Age(): number {
    return parseInt(this.AuthenticatedUser.age) || 0;
  }

  get userName():string{
    return this.AuthenticatedUser.userName || ''
  }

  get Score(): number {
    return parseInt(this.AuthenticatedUser.score) || 0;
  }

  get OlderScore(): number {
    return parseInt(this.AuthenticatedUser.olderScore) || 0;
  }
}
