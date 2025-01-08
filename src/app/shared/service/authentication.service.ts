import {DestroyRef, inject, Injectable} from '@angular/core';
import {User} from '../models';
import {UserDataService} from './user-data.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  UserService = inject(UserDataService)
  destroyRef = inject(DestroyRef)


  isAuthenticated(users: User[],input: User):boolean{
    const AuthUser = users.find(user => user.UserName === input.UserName && user.Password === input.Password) || null;
    const isFound = Boolean(AuthUser?.UserName);
    localStorage.setItem('isAuthenticated', isFound.toString());
      localStorage.setItem('user', JSON.stringify(AuthUser))
      return isFound
  }

  getAuthenticatedUser():User{
    return JSON.parse(<string>localStorage.getItem('user'))
  }

  setUserScore(score:string,OlderScore:string,LoggedUser:User):void{
    const LastUser = LoggedUser
    LoggedUser.Score=score
    LoggedUser.OlderScore=OlderScore
    localStorage.setItem('user', JSON.stringify(LoggedUser))
    this.UserService.changeUserDetails(LoggedUser,LastUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
  }

  isLogged():boolean{
    return JSON.parse(<string>localStorage.getItem('isAuthenticated'));
  }

  LogOutAuthenticatedUser():boolean{
    localStorage.setItem('isAuthenticated','false')
    localStorage.setItem('user','')
    return Boolean(localStorage.getItem('isAuthenticated'))
  }

  getAge():number{
    return parseInt(this.getAuthenticatedUser().Age)
  }

  getScore():number{
    return parseInt(this.getAuthenticatedUser().Score)
  }
  getOlderScore():number{
    return parseInt(this.getAuthenticatedUser().OlderScore)
  }
}
