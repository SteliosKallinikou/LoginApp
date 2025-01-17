import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../components';
import { AuthenticationService } from '../service/authentication.service';

export const ageGuard: CanActivateFn = () => {
  const router = inject(Router);
  const dialog = inject(MatDialog);
  const authenticationService = inject(AuthenticationService);
  const age = authenticationService.age;

  if (age < 18) {
    const dialogRef = dialog.open(AlertDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      router.navigate(['/test']);
      return false;
    });
  }
  return true;
};
