import { DestroyRef, inject, Injectable } from '@angular/core';
import { User } from '../models';
import { UserDataService } from './user-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userService = inject(UserDataService);
  destroyRef = inject(DestroyRef);

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
    return JSON.parse(<string>localStorage.getItem('isAuthenticated'));
  }
  isLogOutAvailable(): boolean {
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.setItem('user', '');
    return Boolean(localStorage.getItem('isAuthenticated'));
  }

  getAge(): number {
    return parseInt(this.getAuthenticatedUser().age);
  }

  getScore(): number {
    return parseInt(this.getAuthenticatedUser().score);
  }
  getOlderScore(): number {
    return parseInt(this.getAuthenticatedUser().olderScore);
  }
}
