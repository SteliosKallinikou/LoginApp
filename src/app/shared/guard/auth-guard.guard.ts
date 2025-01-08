import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';




export const authGuardGuard: CanActivateFn = (route, state) => {
  const Authentication = inject(AuthenticationService)
  const router = inject(Router)
  if(Authentication.isLogged()){
    console.log("logged in")
    return true
  }
  router.navigate(['/login'])
  return false
};
