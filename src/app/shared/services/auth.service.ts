import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '../services/user';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { ModalController, ToastController } from '@ionic/angular';
import { GlobalConstantsService } from './global-constants.service';
import { AngularFireRemoteConfig } from '@angular/fire/compat/remote-config';
import { first, Observable } from 'rxjs';
import { trace } from '@angular/fire/compat/performance';
import { PageVerifyPhonePage } from 'src/app/page-verify-phone/page-verify-phone.page';

import * as firebaseAuth from 'firebase/auth';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Injectable()
export class AuthService {
  userData: firebase.User;
  dataVersion = GlobalConstantsService.userDataVersion;

  constructor(
    public auth: AngularFireAuth,
    public router: Router,
    public afs: AngularFirestore,
    public ngZone: NgZone,
    public modalController: ModalController,
    public remoteConfig: AngularFireRemoteConfig,
    public toastController: ToastController,
    private fns: AngularFireFunctions
  ) {
    this.auth.authState.pipe(trace('auth')).subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
        this.CompareUserdataVersion(this.userData);
      } else {
        localStorage.removeItem('user');
      }
    });
  }

  async SignOut() {
    await this.auth.signOut();
    localStorage.removeItem('user');
  }

  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  GoogleLink() {
    return this.LinkProfile(new firebase.auth.GoogleAuthProvider());
  }

  async anonAuth() {
    try {
      await this.auth.signInAnonymously();
      console.log('Signed in');
    } catch (error) {
      console.error(error);
    }
  }

  async AuthLogin(provider: firebase.auth.AuthProvider) {
    this.auth.useDeviceLanguage();
    try {
      this.auth.signInWithPopup(provider).then((result) => {
        this.SetUserData(result.user);
        this.router.navigate(['/menu']);
      });
    } catch (error) {
      console.error('Login failed');
      console.error(error);
      this.toastLoginFailed();
      this.SignOut();
    }
  }

  async LinkProfile(provider: firebase.auth.AuthProvider) {
    this.auth.useDeviceLanguage();
    try {
      const result = await (await this.auth.currentUser).linkWithPopup(provider);
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
      this.toastLoginFailed();
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

  SetUserData(user: firebase.User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      fullName: user.email.includes('@unesp.br') ? user.displayName : '',
      photoURL: user.photoURL,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  CompareUserdataVersion(user: firebase.User) {
    this.remoteConfig.booleans.registerPrompt.pipe(first(), trace('remoteconfig')).subscribe((registerPrompt) => {
      if (registerPrompt) {
        this.afs
          .doc<User>(`users/${user.uid}`)
          .valueChanges()
          .pipe(trace('firestore'))
          .subscribe((data) => {
            if (data === undefined) {
              return;
            }
            if (!data.dataVersion || data.dataVersion !== this.dataVersion) {
              this.router.navigate(['/register']);
            }
          });
      }
    });
  }

  async verifyPhoneModal(phone: string): Promise<boolean> {
    const modal = await this.modalController.create({
      component: PageVerifyPhonePage,
      componentProps: {
        phone: phone,
      },
    });

    await modal.present();

    return modal.onDidDismiss().then((data) => {
      if (data) {
        return new Promise<boolean>((resolve) => {
          resolve(true);
        });
      }
      return new Promise<boolean>((resolve) => {
        resolve(false);
      });
    });
  }

  async phoneUnlink() {
    firebaseAuth.unlink(this.userData, firebase.auth.PhoneAuthProvider.PROVIDER_ID);
  }
  getUserUid(manualInput: string): { message?: string; status?: boolean; uid?: string } | Observable<any> {
    // Remove spaces from the string
    manualInput = manualInput.replace(/\s/g, '');

    // Check if input has only one '+' and numbers
    const isNumeric: boolean = manualInput.match(/^\+?\d+$/) ? true : false;

    // If string doesn't include "@" and isn't numeric only or is empty, return false
    if ((!manualInput.includes('@') && !isNumeric) || manualInput === '') {
      return { message: 'Os dados inseridos são inválidos', status: false };
    }

    if (isNumeric) {
      if (manualInput.length < 11 || manualInput.length > 14) {
        return { message: 'O número de telefone deve ter entre 11 e 14 dígitos', status: false };
      }

      // If string is numeric only and has length of 11, add country code
      if (manualInput.length === 11) {
        manualInput = `+55${manualInput}`;
      } else if (manualInput.length === 13) {
        manualInput = `+${manualInput}`;
      }
    }

    const getUserUid = this.fns.httpsCallable('getUserUid');

    return getUserUid({ string: manualInput });
  }

  instanceOfResponse(object: any): object is Response {
    return 'message' in object;
  }
}

interface Response {
  status: boolean;
  message: string;
}
