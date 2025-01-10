import { CanDeactivateFn } from '@angular/router';
import { CanDeactivate } from '../models/CanDeactivate';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import {Observable, of, switchMap} from 'rxjs';

//TODO
export const unsavedChangesGuard: CanDeactivateFn<CanDeactivate> = (
  component: CanDeactivate,
): Observable<boolean> => {
    const dialog = inject(MatDialog);
    return component.CanDeactivate().pipe(
      switchMap((isDirty) => {
        if (!isDirty) {
          return of(true);
        }

        const confirmDialog = dialog.open(ConfirmDialogComponent);
        return confirmDialog.afterClosed().pipe(
          switchMap(stay => {
            if (stay === undefined) {
              return of(false);
            }
            return of(!stay);
          })
        );
      })
    )
};
