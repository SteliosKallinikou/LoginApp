import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { unsavedChangesGuard } from './unsaved-changes.guard';
import {canDeactivate} from './canDeactivate';

describe('unsavedChangesGuard', () => {
  const executeGuard: CanDeactivateFn<canDeactivate> = (...guardParameters) =>
      TestBed.runInInjectionContext(() => unsavedChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
