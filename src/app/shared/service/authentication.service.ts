import {Injectable} from '@angular/core';
import {User} from '../models';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated(user: User,input: User):boolean{
    if(JSON.stringify(user)===JSON.stringify(input)){
      localStorage.setItem('isAuthenticated','true')
      return true
    }else{
      return false
    }
  }
  isLogged(){
    return localStorage.getItem('isAuthenticated')==='true'
}
}
