import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authentication = inject(AuthenticationService);
  const router = inject(Router);
  if (authentication.isUserLoggedIn()) {
    console.log('logged in');
    return true;
  }
  router.navigate(['/login']);
  return false;
};
