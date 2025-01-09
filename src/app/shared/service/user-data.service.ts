import { inject, DestroyRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  http = inject(HttpClient);
  URL = 'http://localhost:3000/users';
  private validRegistration = new BehaviorSubject<boolean>(false);
  validated$ = this.validRegistration.asObservable();
  destroyRef = inject(DestroyRef);

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.URL);
  }

  changeUserDetails(currUser: User, prevUser: User): Observable<Object> {
    localStorage.setItem('user', JSON.stringify(currUser));
    let replaceUrl = `${this.URL}/${prevUser.id}`;
    return this.http.put(replaceUrl, currUser);
  }

  registerUser(registerUser: User): void {
    this.getUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        registerUser.id = String(data.length + 1);
        if (data.some(data => data.email === registerUser.email || data.userName === registerUser.userName)) {
          this.validRegistration.next(false);
        } else {
          this.validRegistration.next(true);
          this.http.post<User>(this.URL, registerUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
        }
      });
  }
}
