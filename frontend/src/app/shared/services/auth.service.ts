// @ts-strict-ignore
import { StringDataReturnType } from './cloud-functions.service';
import { EventItem } from 'src/app/shared/services/event';
import { Injectable, NgZone, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '../services/user';

import {
  Auth,
  signInAnonymously,
  authState,
  User as UserAuth,
  getIdTokenResult,
  AuthProvider,
  signInWithPopup,
  signInWithCredential,
  linkWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';

import { ModalController, ToastController } from '@ionic/angular/standalone';
import { GlobalConstantsService } from './global-constants.service';
import { take, Observable, map, switchMap } from 'rxjs';
import { trace } from '@angular/fire/compat/performance';

import { getStringChanges, RemoteConfig, getBooleanChanges } from '@angular/fire/remote-config';
import { arrayRemove } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { CredentialResponse } from 'google-one-tap';
import { PlausibleService } from '@notiz/ngx-plausible';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private plausible: PlausibleService = inject(PlausibleService);
  private remoteConfig: RemoteConfig = inject(RemoteConfig);

  private auth: Auth = inject(Auth);
  private document = inject(DOCUMENT);
  private functions: Functions = inject(Functions);

  authState$ = authState(this.auth);

  userData: UserAuth;
  localDataVersion: string = GlobalConstantsService.userDataVersion;

  private plausibleScript = this.document.getElementById('plausible-script');

  constructor(
    public router: Router,
    public afs: AngularFirestore,
    public ngZone: NgZone,
    public modalController: ModalController,
    public toastController: ToastController,
    private route: ActivatedRoute,
  ) {
    this.authState$.pipe(trace('auth')).subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));

        this.plausibleScript.setAttribute('event-author', user.uid);
        this.plausibleScript.setAttribute('event-logged_in', 'true');

        getStringChanges(this.remoteConfig, 'professors').subscribe((professors) => {
          if (professors) {
            const professorsList: string[] = JSON.parse(professors);
            // Check if user email matches a professor email.
            // Professors are exempt from the register prompt
            if (professorsList.includes(user.email)) {
              getIdTokenResult(user).then((idTokenResult) => {
                const claims = idTokenResult.claims;

                // If role is not set, set it to professor (3000)
                if (!claims['role'] || (claims['role'] as number) < 3000) {
                  const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
                  const userData: User = {
                    associateStatus: 'professor',
                  };
                  userRef.set(userData, {
                    merge: true,
                  });

                  const addProfessor = httpsCallable(this.functions, 'claims-addProfessorRole');
                  addProfessor({ email: user.email }).catch((error) => {
                    console.error(error);
                  });
                }
              });
            }
          }
        });

        this.CompareUserdataVersion(this.userData)
          .pipe(take(1))
          .subscribe((response) => {
            if (response) {
              return;
            }
            this.afs
              .collection('users')
              .doc<User>(this.userData.uid)
              .valueChanges()
              .pipe(take(1))
              .subscribe((user) => {
                if (user.pending?.onlineAttendance) {
                  user.pending.onlineAttendance.forEach((eventID) => {
                    this.afs
                      .collection('events')
                      .doc<EventItem>(eventID)
                      .valueChanges({ idField: 'id' })
                      .pipe(take(1))
                      .subscribe((eventData) => {
                        if (eventData.attendanceCollectionStart && !eventData.attendanceCollectionEnd) {
                          this.router.navigate(['/confirmar-presenca', eventID]);
                        } else if (eventData.attendanceCollectionEnd) {
                          this.afs
                            .collection('users')
                            .doc<User>(this.userData.uid)
                            .update({
                              // @ts-expect-error - This works
                              pending: { onlineAttendance: arrayRemove(eventID) },
                            });
                        }
                      });
                  });
                }
              });
          });
      } else {
        localStorage.removeItem('user');
        this.plausibleScript.setAttribute('event-logged_in', 'false');
      }
    });
  }

  async SignOut() {
    await this.auth.signOut();

    localStorage.removeItem('user');
  }

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  GoogleLink() {
    return this.LinkProfile(new GoogleAuthProvider());
  }

  async GoogleOneTap(token: CredentialResponse) {
    const credential = GoogleAuthProvider.credential(token.credential);

    signInWithCredential(this.auth, credential).then((result) => {
      const user = result.user;
      this.SetUserData(user);

      this.route.queryParams.pipe(take(1)).subscribe((params) => {
        const redirect = params['redirect'];
        if (redirect) {
          this.router.navigate([redirect]);
          this.plausible.event('Login', { props: { redirect: redirect } });
        } else {
          this.router.navigate(['menu']);
          this.plausible.event('Login', { props: { redirect: 'menu' } });
        }
      });
    });
  }

  async anonAuth() {
    try {
      await signInAnonymously(this.auth);
      console.log('Signed in');
    } catch (error) {
      console.error(error);
    }
  }

  async AuthLogin(provider: AuthProvider) {
    this.auth.useDeviceLanguage();
    try {
      signInWithPopup(this.auth, provider).then((result) => {
        const user = result.user;
        this.SetUserData(user);

        this.route.queryParams.pipe(take(1)).subscribe((params) => {
          const redirect = params['redirect'];

          if (redirect) {
            this.router.navigate([redirect]);
          } else {
            this.router.navigate(['menu']);
          }
        });
      });
    } catch (error) {
      console.error('Login failed');
      console.error(error);
      this.toastLoginFailed();
      this.SignOut();
    }
  }

  async LinkProfile(provider: AuthProvider) {
    this.auth.useDeviceLanguage();
    try {
      const result = await linkWithPopup(this.auth.currentUser, provider);
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${result.user.uid}`);
      const userData: User = {
        linkedPersonalEmail: true,
      };
      return userRef.set(userData, {
        merge: true,
      });
    } catch (error) {
      console.error('Link profile failed');
      console.error(error);
      this.toastAccountLinkFailed(error);
    }
  }

  async toastLoginFailed() {
    const toast = await this.toastController.create({
      header: 'Ocorreu um erro no seu login',
      message: 'Verifique a sua conexão e tente novamente.',
      icon: 'close-circle',
      position: 'bottom',
      duration: 5000,
      buttons: [
        {
          side: 'end',
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async toastAccountLinkFailed(error: any) {
    let header: string;
    let message: string;
    if (error.code === 'auth/credential-already-in-use') {
      header = 'Esta conta já está vinculada a um usuário';
      message = 'Tente novamente com outra conta ou entre em contato conosco.';
    }
    const toast = await this.toastController.create({
      header: header || 'Ocorreu um erro ao vincular sua conta',
      message: message || 'Verifique a sua conexão e tente novamente.',
      icon: 'close-circle',
      position: 'bottom',
      duration: 5000,
      buttons: [
        {
          side: 'end',
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }

  private SetUserData(user: UserAuth) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  private CompareUserdataVersion(user: UserAuth): Observable<boolean> {
    return getBooleanChanges(this.remoteConfig, 'registerPrompt').pipe(
      take(1),
      trace('remoteconfig'),
      map((registerPrompt) => {
        if (registerPrompt) {
          return this.afs
            .doc<User>(`users/${user.uid}`)
            .get()
            .pipe(
              trace('firestore'),
              map((doc) => {
                if (doc.exists) {
                  const data = doc.data();
                  const userRemoteDataVersion = data.dataVersion;

                  if (data === undefined) {
                    console.error('User data is undefined.');
                    return true;
                  } else if (userRemoteDataVersion && userRemoteDataVersion > this.localDataVersion) {
                    console.debug('DEBUG: Remote user data version is newer than local.');
                    return true;
                  } else if (!userRemoteDataVersion || userRemoteDataVersion !== this.localDataVersion) {
                    console.debug('DEBUG: Remote user data version mismatch. Redirecting to register page.');
                    this.router.navigate(['/ajustes/conta/informacoes-pessoais']);
                    return true;
                  } else {
                    console.debug('DEBUG: Remote user data version matches local.');
                    return false;
                  }
                }
                return true;
              }),
            );
        }
        return null;
      }),
      switchMap((value) => value),
    );
  }

  async getUserUid(manualInput: string): Promise<StringDataReturnType> {
    // Remove spaces from the string
    manualInput = manualInput.replace(/\s/g, '');

    // If string doesn't include "@" and isn't numeric only or is empty, return false
    if (!manualInput.includes('@') || manualInput === '') {
      return { message: 'Os dados inseridos são inválidos', success: false, data: null };
    }

    const getUserUid = httpsCallable(this.functions, 'user_utils-getUserUid');

    return (await getUserUid({ string: manualInput })).data as StringDataReturnType;
  }
}
