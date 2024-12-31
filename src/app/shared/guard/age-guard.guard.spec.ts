import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ageGuardGuard } from './age-guard.guard';

describe('ageGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ageGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
