import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DURATION } from '../consts';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  snackBar = inject(MatSnackBar);

  openSnackBar(text: string): void {
    this.snackBar.open(text, 'Close', {
      duration: DURATION,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
