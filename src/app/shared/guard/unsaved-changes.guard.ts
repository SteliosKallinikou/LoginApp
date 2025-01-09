import { CanDeactivateFn } from '@angular/router';
import { CanDeactivate } from '../models/CanDeactivate';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

export const unsavedChangesGuard = (allowNavigation: boolean): CanDeactivateFn<CanDeactivate> => {
  return component => {
    if (allowNavigation || component.CanDeactivate()) {
      return true;
    }
    const dialog = inject(MatDialog);
    const confirmDialog = dialog.open(ConfirmDialogComponent);
    return confirmDialog.afterClosed();
  };
};
