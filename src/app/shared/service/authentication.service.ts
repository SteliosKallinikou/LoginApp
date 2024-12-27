import {Injectable} from '@angular/core';
import {User} from '../models';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated(users: User[],input: User):boolean{
    let AuthUser:User={UserName:'', Password:'',id:'',Age:'',Email:''}
    let isFound=false
    for(let i=0; i<users.length;i++){
      if(JSON.stringify(users[i].UserName&& users[i].Password)===JSON.stringify(input.UserName && input.Password)){
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

  isLogged(){
    return localStorage.getItem('isAuthenticated')==='true'
}
}
