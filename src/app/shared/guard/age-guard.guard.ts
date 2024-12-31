import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AlertDialogComponent} from '../../alert-dialog/alert-dialog.component';

export const ageGuardGuard: CanActivateFn = () => {
  const router = inject(Router)
  const dialog = inject(MatDialog)
  const user = localStorage.getItem('user')
  const age = parseInt(<string>user!.match(/\d+/g)?.at(2))

  if(age<18){
    const dialogRef= dialog.open(AlertDialogComponent)
    dialogRef.afterClosed().subscribe(()=>{
        router.navigate(['/general-test'])
        return false
    })
  }
  return true

};
