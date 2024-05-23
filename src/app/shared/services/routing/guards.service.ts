import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Observable, pipe } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { SupabaseAuthService } from 'src/app/shared/services/supabase-auth.service';
import { filterNullish } from 'src/app/shared/services/rxjs.service';

export const DevelopmentOnlyGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return !environment.production;
};

export const redirectUnauthorizedToLogin: CanActivateFn = (route, state) => {
  const auth = inject(SupabaseAuthService);
  const router = inject(Router);
  return auth.$user.pipe(
    take(1), // Otherwise the Observable doesn't complete!
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } else {
        return router.createUrlTree(['/login'], {
          queryParams: { redirect: state.url },
        });
      }
    }),
  );
};

export const redirectLoggedInToMenu: CanActivateFn = (route, state) => {
  const auth = inject(SupabaseAuthService);
  const router = inject(Router);
  return auth.$user.pipe(
    take(1), // Otherwise the Observable doesn't complete!
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return router.createUrlTree(['/menu']);
      } else {
        return true;
      }
    }),
  );
};

export class adminOnly {
  canActivate(route: ActivatedRouteSnapshot): boolean {
    return true;
  }
}
