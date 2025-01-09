import { CanDeactivateFn } from '@angular/router';
import { CanDeactivate } from '../models/CanDeactivate';
import { Observable } from 'rxjs';

export const unsavedChangesGuard: CanDeactivateFn<CanDeactivate> = component => {
  return component.CanDeactivate() as Observable<boolean>;
};
