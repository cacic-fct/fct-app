import { User } from 'src/app/shared/services/user';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { AlertController } from '@ionic/angular';

import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { GlobalConstantsService } from '../shared/services/global-constants.service';

import { trace } from '@angular/fire/compat/performance';

import { Mailto, NgxMailtoService } from 'ngx-mailto';

import { AngularFireAuth } from '@angular/fire/compat/auth';

import { first, Observable, BehaviorSubject } from 'rxjs';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserTrackingService } from '@angular/fire/compat/analytics';
import { WindowService } from '../shared/services/window.service';

import firebase from 'firebase/compat/app';

@UntilDestroy()
@Component({
  selector: 'app-page-register',
  templateUrl: './page-register.page.html',
  styleUrls: ['./page-register.page.scss'],
})
export class PageRegisterPage implements OnInit {
  @ViewChild('mySwal')
  private mySwal: SwalComponent;
  windowRef: any;

  dataVersion: string = GlobalConstantsService.userDataVersion;
  userData: any;
  dataForm: FormGroup = new FormGroup({
    academicID: new FormControl(''),
    dob: new FormControl(''),
    phone: new FormControl(''),
    cpf: new FormControl(''),
  });

  _isUnespSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isUnesp$: Observable<boolean> = this._isUnespSubject.asObservable();

  constructor(
    public authService: AuthService,
    public alertController: AlertController,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore,
    public router: Router,
    public auth: AngularFireAuth,
    private mailtoService: NgxMailtoService,
    private win: WindowService
  ) {
    this.userData = JSON.parse(localStorage.getItem('user'));

    this.dataForm = this.formBuilder.group({
      // Validator doesn't update when value changes programatically
      // https://github.com/angular/angular/issues/30616
      academicID: ['' /*[Validators.required, Validators.pattern('^[0-9]{9}$')]*/],
      phone: ['', Validators.required],
      cpf: ['', this.validarCPF.bind(this)],
      fullName: '',
    });
  }

  ngOnInit() {
    this.afs
      .collection('users')
      .doc<User>(this.userData.uid)
      .valueChanges()
      .pipe(first(), trace('firestore'))
      .subscribe((user) => {
        if (user.email.includes('@unesp.br')) {
          this._isUnespSubject.next(true);
          this.dataForm.removeValidators(Validators.required);
        } else {
          this.dataForm.addValidators(Validators.required);
        }
        this.dataForm.controls.academicID.setValue(user.academicID);
        this.dataForm.controls.phone.setValue(user.phone);
        this.dataForm.controls.cpf.setValue(user.cpf);
      });

    this.userData.uid.replace(/%20/g, ' ') +
      '%0D%0Anome%3A%20' +
      this.userData.displayName.replace(/%20/g, ' ') +
      '%0D%0Ae-mail%20institucional%3A%20' +
      this.userData.email.replace(/%20/g, ' ') +
      '%0D%0A';

    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
    });
  }

  onSubmit() {
    if (!this.dataForm.valid) {
      return;
    }

    this.afs
      .collection('users')
      .doc<User>(this.userData.uid)
      .valueChanges()
      .pipe(first())
      .subscribe(async (user) => {
        if (user.phone && user.phone === this.dataForm.value.phone) {
          this.submitUserData(user);
          return;
        }

        this.authService.verifyPhoneModal(this.dataForm.value.phone).then((response) => {
          if (response) {
            this.submitUserData(user);
          }
          return;
        });
      });
  }

  submitUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const userData = {
      academicID: this.dataForm.value.academicID,
      phone: this.dataForm.value.phone,
      dataVersion: this.dataVersion,
      cpf: this.dataForm.value.cpf,
    };
    userRef.set(userData, {
      merge: true,
    });

    this.mySwal.fire();
    // Fake delay to let animation finish
    setTimeout(() => {
      this.mySwal.close();
      this.router.navigate(['/menu']);
    }, 1500);
  }

  formatPhone() {
    // Format phoneNumber value to '00 00000-0000'
    let phoneNumber = this.dataForm.value.phone;
    phoneNumber = phoneNumber.replace(/\D/g, '');
    phoneNumber = phoneNumber.replace(/^(\d{2})(\d)/g, '$1 $2');
    phoneNumber = phoneNumber.replace(/(\d)(\d{4})$/, '$1-$2');
    this.dataForm.controls.phone.setValue(phoneNumber);
  }

  formatCPF() {
    // Format cpf value to '000.000.000-00'
    let cpf = this.dataForm.value.cpf;
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.dataForm.controls.cpf.setValue(cpf);
  }

  validarCPF(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value;

    if (this.validateCPF(cpf)) {
      return null;
    }
    return { error: 'CPF inválido' };
  }

  validateCPF(cpf: string): boolean {
    if (!cpf) {
      return false;
    }

    // Remove . and -
    cpf = cpf.replace(/\.|-/g, '');

    // If CPF is 000.000.000-00, 111.111.111-11, etc, return false
    if (/^(.)\1*$/.test(cpf)) {
      return false;
    }

    let sum: number = 0;
    let rest: number;
    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest == 10 || rest == 11) rest = 0;
    if (rest != parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    rest = (sum * 10) % 11;
    if (rest == 10 || rest == 11) rest = 0;
    if (rest != parseInt(cpf.substring(10, 11))) return false;
    return true;
  }

  mailto(): void {
    const mailto: Mailto = {
      receiver: 'cacic.fct@gmail.com',
      subject: '[FCT-App] Validar meu cadastro',
      body: `Olá!\nEu não possuo (ESPECIFIQUE: CPF/celular), vocês poderiam validar o meu cadastro?\n\n=== Não apague os dados abaixo ===\nE-mail: ${this.userData.email}\nuid: ${this.userData.uid}\n`,
    };
    this.mailtoService.open(mailto);
  }
}
