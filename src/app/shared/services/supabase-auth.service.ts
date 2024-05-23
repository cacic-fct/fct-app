// Attribution: kylerummens
// https://gist.github.com/kylerummens/c2ec82e65d137f3220748ff0dee76c3f
import { Injectable, WritableSignal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { user } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthError, AuthTokenResponse, OAuthResponse, RealtimeChannel, Session, User } from '@supabase/supabase-js';
import { CredentialResponse } from 'google-one-tap';
import { BehaviorSubject, Observable, first, skipWhile, take } from 'rxjs';
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
export class SupabaseAuthService {
  // Supabase user state
  private _$user = new BehaviorSubject<User | null | undefined>(undefined);
  public $user = this._$user.pipe(skipWhile((x) => typeof x === 'undefined')) as Observable<User | null>;
  private user_id: WritableSignal<string | undefined> = signal(undefined);
  public isLoggedIn: WritableSignal<boolean | undefined> = signal(undefined);

  // Profile state
  private _$profile = new BehaviorSubject<Profile | null | undefined>(undefined);
  $profile = this._$profile.pipe(skipWhile((x) => typeof x === 'undefined')) as Observable<Profile | null>;
  private profile_subscription: RealtimeChannel | null = null;

  constructor(
    private supabase: SupabaseService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.supabase.client.auth.getUser().then(({ data, error }) => {
      this._$user.next(data?.user && !error ? data.user : null);

      // After the initial value is set, listen for auth state changes
      this.supabase.client.auth.onAuthStateChange((event, session) => {
        console.log('Auth State Changed:', event, session);
        this._$user.next(session?.user ?? null);
      });
    });

    // Initialize the user's profile
    // The state of the user's profile is dependent on them being a user. If no user is set, there shouldn't be a profile.
    this.$user.pipe(takeUntilDestroyed()).subscribe((user) => {
      if (user) {
        this.isLoggedIn.set(true);
        // We only make changes if the user is different
        if (user.id === this.user_id()) {
          return;
        }

        const user_id = user.id;
        this.user_id.set(user_id);

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
                },
              )
              .subscribe();
          });
      } else {
        // If there is no user, update the profile BehaviorSubject, delete the user_id, and unsubscribe from Supabase Realtime
        this._$profile.next(null);
        this.isLoggedIn.set(false);
        this.user_id.set(undefined);
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
        if (error || !data) {
          reject(error);
        }

        // Wait for $profile to be set again.
        // We don't want to proceed until our API request for the user's profile has completed
        this.$profile.pipe(first()).subscribe(() => {
          this.isLoggedIn.set(true);
          resolve();
        });
      });
    });
  }

  GoogleOneTapSignIn(token: CredentialResponse) {
    this._$profile.next(undefined);

    this.supabase.client.auth
      .signInWithIdToken({
        provider: 'google',
        token: token.credential,
      })
      .then(({ data, error }: { data: { user: User | null; session: Session | null }; error: AuthError | null }) => {
        if (error || !data) {
          throw error;
        }

        this.saveUserData(data);
        this.isLoggedIn.set(true);

        this.route.queryParams.pipe(take(1)).subscribe((params) => {
          const redirect = params['redirect'];
          if (redirect) {
            this.router.navigate([redirect]);
          } else {
            this.router.navigate(['menu']);
          }
        });
      });
  }

  saveUserData(data: { user: User | null; session: Session | null }) {
    const user = data.user;

    if (!user) {
      throw new Error('User not found');
    }

    this.supabase.client
      .from('users')
      .select('*')
      .match({ id: user.id })
      .single()
      .then((res) => {
        if (res.data) {
          this.supabase.client
            .from('users')
            .upsert({
              name: user.user_metadata['full_name'],
              email: user.email,
              avatar_url: user.user_metadata['picture'],
            })
            .select();

          return;
        } else {
          this.router.navigate(['register']);
        }
      });

    console.log('Saved user data');
  }

  /* async signInWithGoogle() {
    return new Promise<OAuthResponse>((resolve, reject) => {
      this._$profile.next(undefined);

      return this.supabase.client.auth
        .signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'https://localhost:8100/login',
          },
        })
        .then(({ data, error }: { data: any; error: any }) => {
          if (error || !data) {
            reject(error);
          }

   

          this.$profile.pipe(first()).subscribe(() => {
            this.isLoggedIn.set(true);
            resolve(data);
          });
        });
    });
  } */

  signOut() {
    this.isLoggedIn.set(false);
    return this.supabase.client.auth.signOut();
  }
}
