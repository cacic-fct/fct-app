import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { supabaseGuard } from './supabase.guard';

describe('supabaseGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => supabaseGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
