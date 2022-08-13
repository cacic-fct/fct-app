import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component, Input, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { WindowService } from '../shared/services/window.service';

import { timer, first } from 'rxjs';

import { ModalController } from '@ionic/angular';

// import firebase/auth
import * as authFirebase from 'firebase/auth';
import { User } from '../shared/services/user';

@Component({
  selector: 'app-page-verify-phone',
  templateUrl: './page-verify-phone.page.html',
  styleUrls: ['./page-verify-phone.page.scss'],
})
export class PageVerifyPhonePage implements OnInit {
  verificationCode: string;
  @Input() phone: string;
  windowRef: any;
  timer: any;
  cooldown: boolean = false;
  attempts: number = 0;
  lastVerificationCode: string;
  invalidCode: boolean = false;
  updatePhone: boolean = false;
  buttonEnabled: boolean = false;

  constructor(
    public auth: AngularFireAuth,
    public afs: AngularFirestore,
    private win: WindowService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.linkOrUpdatePhone();
  }

  linkOrUpdatePhone() {
    this.auth.authState.pipe(first()).subscribe((userState) => {
      this.afs
        .collection('users')
        .doc<User>(userState.uid)
        .valueChanges()
        .pipe(first())
        .subscribe((user) => {
          if (user.phone) {
            this.updatePhone = true;
            this.phoneUpdate(this.phone);
          } else {
            this.phoneLink(this.phone);
          }
        });
    });
  }

  async setTimer() {
    this.attempts++;
    this.windowRef.lastExecution = new Date().getTime();
    this.timer = timer(60000 * this.attempts).subscribe(() => {});
  }

  phoneLink(phone: string) {
    // Wait 1 minute * this.attempts from last execution
    if (this.windowRef.lastExecution && new Date().getTime() - this.windowRef.lastExecution < 60000 * this.attempts) {
      return;
    }

    this.setTimer();

    const fullPhoneNumber = '+55 ' + phone;
    const appVerifier = this.windowRef.recaptchaVerifier;

    this.auth.authState.pipe(first()).subscribe((user) => {
      if (user) {
        authFirebase
          .linkWithPhoneNumber(user, fullPhoneNumber, appVerifier)
          .then((confirmationResult) => {
            // SMS sent
            this.windowRef.confirmationResult = confirmationResult;
            this.buttonEnabled = true;
          })
          .catch((error) => {
            // Error SMS not sent
            console.error(error);
            this.windowRef.lastExecution = null;
            this.modalController.dismiss(false);
          });
      }
    });
  }

  phoneUpdate(phone: string) {
    // Wait (1 minute * this.attempts) from last execution
    if (this.windowRef.lastExecution && new Date().getTime() - this.windowRef.lastExecution < 60000 * this.attempts) {
      return;
    }

    this.setTimer();

    const fullPhoneNumber = '+55 ' + phone;
    const appVerifier = this.windowRef.recaptchaVerifier;

    const provider = new firebase.auth.PhoneAuthProvider();

    provider
      .verifyPhoneNumber(fullPhoneNumber, appVerifier)
      .then((confirmationResult) => {
        this.windowRef.confirmationResult = confirmationResult;
        this.buttonEnabled = true;
      })
      .catch((error) => {
        // Error occurred.
        console.error(error);
      });
  }

  verifyPhone() {
    if (this.verificationCode === this.lastVerificationCode) {
      return;
    }

    if (this.updatePhone) {
      let phoneCredential = firebase.auth.PhoneAuthProvider.credential(
        this.windowRef.confirmationResult,
        this.verificationCode
      );

      this.auth.authState.pipe(first()).subscribe((user) => {
        user
          .updatePhoneNumber(phoneCredential)
          .then(() => {
            this.modalController.dismiss(true);
          })
          .catch((error) => {
            console.error(error);
            this.lastVerificationCode = this.verificationCode;
            this.invalidCode = true;
          });
      });
    } else {
      this.windowRef.confirmationResult
        .confirm(this.verificationCode)
        .then((result) => {
          // User signed in successfully.
          this.modalController.dismiss(true);
          // ...
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          console.error(error);
          this.lastVerificationCode = this.verificationCode;
          this.invalidCode = true;
          // ...
        });
    }
  }

  verificationCodeChange() {
    this.invalidCode = false;
  }
}
