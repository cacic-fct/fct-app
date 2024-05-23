import { CanActivateFn } from '@angular/router';
import { SupabaseAuthService } from 'src/app/shared/services/supabase-auth.service';

export const supabaseGuard: CanActivateFn = (route, state) => {
  if (!SupabaseAuthService.$user) {
    return false;
  }

  return true;
};
