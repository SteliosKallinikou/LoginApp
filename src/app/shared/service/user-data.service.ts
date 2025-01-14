import { inject, DestroyRef, Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  http = inject(HttpClient);
  URL = 'http://localhost:3000/users';
  destroyRef = inject(DestroyRef);

  get user(): Observable<User[]> {
    return this.http.get<User[]>(this.URL);
  }

  changeUserDetails(currUser: User, prevUser: User): Observable<Object> {
    localStorage.setItem('user', JSON.stringify(currUser));
    let replaceUrl = `${this.URL}/${prevUser.id}`;
    return this.http.put(replaceUrl, currUser);
  }

  registerUser(registerUser: User): Observable<boolean> {
    return this.user.pipe(
      switchMap(canRegister => {
        if (canRegister.some(data => registerUser.email === data.email || registerUser.userName === data.userName)) {
          return of(false);
        } else {
          registerUser.id = String(canRegister.length + 1);
          this.http.post<User>(this.URL, registerUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
          return of(true);
        }
      })
    );
  }
}
