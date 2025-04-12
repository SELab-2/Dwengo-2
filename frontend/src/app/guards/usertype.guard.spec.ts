import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { usertypeGuard } from './usertype.guard';

describe('usertypeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => usertypeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
