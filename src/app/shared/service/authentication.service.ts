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
    console.log(localStorage)
    localStorage.setItem('user', JSON.stringify(authUser));
    return isFound;
  }

  get authenticatedUser(): User {
    return JSON.parse(<string>localStorage.getItem('user'));
  }

  setBasicUserScore(score: number, loggedUser: User): void {
    const lastUser = loggedUser;
    loggedUser.score = score;
    localStorage.setItem('user', JSON.stringify(loggedUser));
    this.userService.changeUserDetails(loggedUser, lastUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  setOlderUserScore(score: number, loggedUser: User): void {
    const lastUser = loggedUser;
    loggedUser.olderScore = score;
    localStorage.setItem('user', JSON.stringify(loggedUser));
    this.userService.changeUserDetails(loggedUser, lastUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  isUserLoggedIn(): boolean {
    return !!JSON.parse(<string>localStorage.getItem('isAuthenticated'));
  }

  logOut(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('darkMode');
    document.body.classList.remove('dark-theme');
    this.router.navigate(['']);
  }

  toggleDarkMode(isDarkEnabled: boolean): void {
    localStorage.setItem('darkMode', String(isDarkEnabled));
    isDarkEnabled ? document.body.classList.add('dark-theme') : document.body.classList.remove('dark-theme');
  }

  get isDark(): boolean {
    return localStorage.getItem('darkMode') === 'true';
  }

  get age(): number {
    return parseInt(this.authenticatedUser.age) || 0;
  }

  get userName(): string {
    return this.authenticatedUser.userName || '';
  }

  get score(): number {
    return this.authenticatedUser.score || 0;
  }

  get olderScore(): number {
    return this.authenticatedUser.olderScore || 0;
  }

  get profilePicture(): string {
    return this.authenticatedUser.profilePicture;
  }
}
