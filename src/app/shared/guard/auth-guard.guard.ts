import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';




export const authGuardGuard: CanActivateFn = (route, state) => {
  const Authentication = inject(AuthenticationService)
  if(Authentication.isLogged()){
    console.log("logged in")
    return true
  }
  return false
};
