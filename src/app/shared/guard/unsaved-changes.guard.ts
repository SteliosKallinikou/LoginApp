import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components';
import { Observable, of, switchMap } from 'rxjs';
import { CanDeactivate } from '../models';

export const unsavedChangesGuard: CanDeactivateFn<CanDeactivate> = (component: CanDeactivate): Observable<boolean> => {
  const dialog = inject(MatDialog);
  return component.CanDeactivate().pipe(
    switchMap(isDirty => {
      if (isDirty) {
        console.log('here')
        return of(true);
      }
      const confirmDialog = dialog.open(ConfirmDialogComponent);
      return confirmDialog.afterClosed().pipe(
        switchMap(stay => {
          if (stay === undefined) {
            return of(false);
          }
          return of(stay);
        })
      );
    })
  );
};
