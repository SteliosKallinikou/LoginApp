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
    let AuthUser:User={UserName:'', Password:'',id:'',Age:'',Email:'',Score:'',OlderScore:''}
    let isFound=false
    for(let i=0; i<users.length;i++){
      if(users[i].UserName===input.UserName && users[i].Password===input.Password){
        AuthUser=users[i]
        isFound=true
      }
    }
      localStorage.setItem('isAuthenticated','true')
      localStorage.setItem('user', JSON.stringify(AuthUser))
      return isFound
  }

  getAuthenticatedUser():User{
    const retrieved = localStorage.getItem('user')
    console.log(retrieved)
    return JSON.parse(<string>retrieved)
  }

  setUserScore(score:string,OlderScore:string,LoggedUser:User):void{
    const LastUser = LoggedUser
    console.log(OlderScore)
    console.log(score)
    LoggedUser.Score=score
    LoggedUser.OlderScore=OlderScore
    localStorage.setItem('user', JSON.stringify(LoggedUser))
    this.UserService.changeUserDetails(LoggedUser,LastUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
  }

  isLogged():boolean{
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  LogOutAuthenticatedUser():void{
    localStorage.setItem('isAuthenticated','false')
    localStorage.setItem('user','')
  }
}
