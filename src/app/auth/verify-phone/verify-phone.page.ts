import { Component, inject, Input, OnInit } from '@angular/core';

import {
  Auth,
  authState,
  updatePhoneNumber,
  linkWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
} from '@angular/fire/auth';

import { WindowService } from '../../shared/services/window.service';

import { timer, take, interval, Subscription, Observable } from 'rxjs';

import { ModalController } from '@ionic/angular';

import { User } from 'src/app/shared/services/user';

import { Mailto, MailtoService } from 'src/app/shared/services/mailto.service';

import { add } from 'date-fns';
import { trace } from '@angular/fire/compat/performance';

import { Firestore, collection, doc, docData } from '@angular/fire/firestore';

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.page.html',
  styleUrls: ['./verify-phone.page.scss'],
})
export class VerifyPhonePage implements OnInit {
  @Input() phone!: string;

  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);

  private firestore: Firestore = inject(Firestore);

  verificationCode: string | undefined;
  windowRef: Window &
    typeof globalThis & {
      recaptchaVerifier: RecaptchaVerifier;
      canExecuteAgainOn: Date;
      confirmationResult: any;
      lastExecutionPhone: string;
    };
  cooldown: boolean = false;
  attempts: number = 0;
  lastVerificationCode: string | undefined;
  invalidCode: boolean = false;
  updatePhone: boolean = false;
  buttonEnabled: boolean = false;
  phoneAlreadyRegistered: boolean = false;

  timeDifference: number | undefined;
  countdownSeconds: number | undefined;
  countdownMinutes: number | undefined;
  countdown: Subscription | undefined;

  timerSubscription: Subscription | undefined;

  constructor(
    private win: WindowService,
    public modalController: ModalController,
    private mailtoService: MailtoService
  ) {
    // @ts-ignore
    this.windowRef = this.win.windowRef;
  }

  ngOnInit() {
    this.linkOrUpdatePhone();
  }

  linkOrUpdatePhone() {
    if (this.isOnCooldown()) {
      this.countdown = interval(1_000).subscribe(() => {
        this.getTimeDifference();
      });
      return;
    }

    this.setTimer();

    this.authState$.pipe(take(1), trace('auth')).subscribe((userState) => {
      if (!userState) {
        return;
      }

      const usersColRef = collection(this.firestore, 'users');
      const userDataDocRef = doc(usersColRef, userState.uid);
      const userDataDoc = docData(userDataDocRef) as Observable<User>;

      userDataDoc.pipe(take(1), trace('firestore')).subscribe((user) => {
        if (user.phone) {
          this.updatePhone = true;
          this.phoneUpdate(this.phone);
        } else {
          this.phoneLink(this.phone);
        }
      });
    });
  }

  setTimer() {
    const minutes: number = Math.pow(2, this.attempts);
    if (this.countdown) {
      this.countdown.unsubscribe();
    }

    this.cooldown = true;
    this.attempts += 1;

    this.windowRef.canExecuteAgainOn = add(new Date(), {
      minutes: minutes,
    });

    this.countdown = interval(1000).subscribe(() => {
      this.getTimeDifference();
    });

    this.timerSubscription = timer(minutes * 60_000)
      .pipe(take(1))
      .subscribe(() => {
        this.cooldown = false;
        this.windowRef.recaptchaVerifier = new RecaptchaVerifier(
          'resend-sms',
          {
            size: 'invisible',
          },
          this.auth
        );

        if (this.countdown) {
          this.countdown.unsubscribe();
        }
      });
  }

  isOnCooldown(): boolean {
    if (this.windowRef.canExecuteAgainOn) {
      if (new Date() < this.windowRef.canExecuteAgainOn) {
        this.cooldown = true;
        return true;
      }
    }

    return false;
  }

  phoneLink(phone: string) {
    const fullPhoneNumber = '+55 ' + phone;
    const appVerifier = this.windowRef.recaptchaVerifier;

    this.authState$.pipe(take(1)).subscribe((user) => {
      if (user) {
        linkWithPhoneNumber(user, fullPhoneNumber, appVerifier)
          .then((confirmationResult) => {
            // SMS sent
            this.windowRef.confirmationResult = confirmationResult;
            this.buttonEnabled = true;
          })
          .catch((error) => {
            // Error SMS not sent
            console.error(error);
            this.modalController.dismiss(null);
          });
      }
    });
  }

  phoneUpdate(phone: string) {
    const fullPhoneNumber = '+55 ' + phone;
    const appVerifier = this.windowRef.recaptchaVerifier;

    const provider = new PhoneAuthProvider(this.auth);

    provider
      .verifyPhoneNumber(fullPhoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent
        this.windowRef.confirmationResult = confirmationResult;
        this.buttonEnabled = true;
      })
      .catch((error) => {
        // Error SMS not sent
        console.error(error);
      });
  }

  verifyPhone() {
    if (this.verificationCode === this.lastVerificationCode) {
      return;
    }

    if (this.updatePhone && this.verificationCode) {
      let phoneCredential = PhoneAuthProvider.credential(this.windowRef.confirmationResult, this.verificationCode);

      this.authState$.pipe(take(1)).subscribe((user) => {
        if (!user) {
          return;
        }

        updatePhoneNumber(user, phoneCredential);

        updatePhoneNumber(user, phoneCredential)
          .then(() => {
            // User signed in successfully.
            this.modalController.dismiss({ data: true });
          })
          .catch((error) => {
            // User couldn't sign in
            if (error.code === 'auth/invalid-verification-code') {
              console.error(error);
              this.lastVerificationCode = this.verificationCode;
              this.invalidCode = true;
            } else if (error.code === 'auth/account-exists-with-different-credential') {
              console.error(error);
              this.phoneAlreadyRegistered = true;
            }
          });
      });
    } else {
      this.windowRef.confirmationResult
        .confirm(this.verificationCode)
        .then(() => {
          // User signed in successfully.
          this.modalController.dismiss({ data: true });
        })
        .catch((error: any) => {
          console.error(error);
          // User couldn't sign in
          if (error.code === 'auth/invalid-verification-code') {
            this.lastVerificationCode = this.verificationCode;
            this.invalidCode = true;
          } else if (error.code === 'auth/account-exists-with-different-credential') {
            this.phoneAlreadyRegistered = true;
          }
        });
    }
  }

  verificationCodeChange() {
    this.invalidCode = false;
  }

  closeModal() {
    this.windowRef.lastExecutionPhone = this.phone;
    this.modalController.dismiss(null);
  }

  // Attribution: Mwiza Kumwenda
  // https://javascript.plainenglish.io/implement-a-countdown-timer-with-rxjs-in-angular-3852f21a4ea0
  private getTimeDifference() {
    this.timeDifference = this.windowRef.canExecuteAgainOn.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference: number) {
    this.countdownSeconds = Math.floor((timeDifference / 1000) % 60);
    this.countdownMinutes = Math.floor((timeDifference / (1000 * 60)) % 60);
  }

  mailto(): void {
    const userData = JSON.parse(localStorage.getItem('user')!);
    const mailto: Mailto = {
      receiver: 'cacic.fct@gmail.com',
      subject: '[FCT-App] Celular já registrado',
      body: `Olá!\nRecebi a mensagem de que meu celular já pertence a outra conta. Vocês podem me ajudar?\n\n=== Não apague os dados abaixo ===\nE-mail: ${userData.email}\nuid: ${userData.uid}\nCelular: ${this.phone}`,
    };
    this.mailtoService.open(mailto);
  }
}
