// Attribution: kylerummens
// https://gist.github.com/kylerummens/c2ec82e65d137f3220748ff0dee76c3f
import { Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RealtimeChannel, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, first, skipWhile } from 'rxjs';
import { SupabaseService } from 'src/app/shared/services/supabase.service';

export interface Profile {
  user_id: string;
  photo_url: string;
  email: string;
  first_name: string;
  last_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Supabase user state
  private _$user = new BehaviorSubject<User | null | undefined>(undefined);
  $user = this._$user.pipe(skipWhile((x) => typeof x === 'undefined')) as Observable<User | null>;
  private user_id: string;

  // Profile state
  private _$profile = new BehaviorSubject<Profile | null | undefined>(undefined);
  $profile = this._$profile.pipe(skipWhile((x) => typeof x === 'undefined')) as Observable<Profile | null>;
  private profile_subscription: RealtimeChannel;

  constructor(private supabase: SupabaseService) {
    this.supabase.client.auth.getUser().then(({ data, error }) => {
      this._$user.next(data?.user && !error ? data.user : null);

      // After the initial value is set, listen for auth state changes
      this.supabase.client.auth.onAuthStateChange((event, session) => {
        this._$user.next(session?.user ?? null);
      });
    });

    // Initialize the user's profile
    // The state of the user's profile is dependent on their being a user. If no user is set, there shouldn't be a profile.
    this.$user.pipe(takeUntilDestroyed()).subscribe((user) => {
      if (user) {
        // We only make changes if the user is different
        if (user.id === this.user_id) {
          return;
        }

        const user_id = user.id;
        this.user_id = user_id;

        // One-time API call to Supabase to get the user's profile
        this.supabase.client
          .from('users')
          .select('*')
          .match({ user_id })
          .single()
          .then((res) => {
            // Update our profile BehaviorSubject with the current value
            this._$profile.next(res.data ?? null);

            // Listen to any changes to our user's profile using Supabase Realtime
            this.profile_subscription = this.supabase.client
              .channel('public:profiles')
              .on(
                'postgres_changes',
                {
                  event: '*',
                  schema: 'public',
                  table: 'users',
                  filter: 'user_id=eq.' + user.id,
                },
                (payload: any) => {
                  // Update our profile BehaviorSubject with the newest value
                  this._$profile.next(payload.new);
                }
              )
              .subscribe();
          });
      } else {
        // If there is no user, update the profile BehaviorSubject, delete the user_id, and unsubscribe from Supabase Realtime
        this._$profile.next(null);
        delete this.user_id;
        if (this.profile_subscription) {
          this.supabase.client.removeChannel(this.profile_subscription).then((res) => {
            console.log('Removed profile channel subscription with status: ', res);
          });
        }
      }
    });
  }

  signIn(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      // Set _$profile back to undefined. This will mean that $profile will wait to emit a value
      this._$profile.next(undefined);
      this.supabase.client.auth.signInWithPassword({ email, password }).then(({ data, error }) => {
        if (error || !data) reject('Invalid email/password combination');

        // Wait for $profile to be set again.
        // We don't want to proceed until our API request for the user's profile has completed
        this.$profile.pipe(first(), takeUntilDestroyed()).subscribe(() => {
          resolve();
        });
      });
    });
  }

  logout() {
    return this.supabase.client.auth.signOut();
  }
}
