import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { AlertController } from '@ionic/angular';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

import { format, parseISO, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-page-register',
  templateUrl: './page-register.page.html',
  styleUrls: ['./page-register.page.scss'],
})
export class PageRegisterPage implements OnInit {
  dataVersion = '0.1.0';
  userData: any;
  dobInput: string;
  router: Router;
  minDate: string;
  maxDate: string;
  mailTo: string;
  dataForm: FormGroup = new FormGroup({
    academicID: new FormControl(''),
    dob: new FormControl(''),
    phone: new FormControl(''),
  });

  constructor(
    public authService: AuthService,
    public alertController: AlertController,
    public formBuilder: FormBuilder,
    public afs: AngularFirestore
  ) {}

  ngOnInit() {
    // Max calendar date is today -16 years
    this.minDate = '1900-01-01';
    this.maxDate = format(
      new Date().setFullYear(new Date().getFullYear() - 16),
      'yyyy-MM-dd'
    );
    this.userData = JSON.parse(localStorage.getItem('user'));

    this.mailTo =
      'mailto:cacic.fct@gmail.com?subject=%5BFCT-App%5D%20Sem%20n%C3%BAmero%20de%20celular&body=Ol%C3%A1%2C%20CACiC!%0D%0A%0D%0AEu%20n%C3%A3o%20possuo%20n%C3%BAmero%20de%20celular.%0D%0AVoc%C3%AAs%20podem%20liberar%20o%20cadastro%20para%20mim%3F%0D%0A%0D%0AObrigado!%0D%0A%0D%0A%3D%3D%3D%3D%3D%3D%3D%20N%C3%A3o%20escreva%20abaixo%20dessa%20linha%20e%20n%C3%A3o%20remova%20as%20informa%C3%A7%C3%B5es%20%3D%3D%3D%3D%3D%3D%3D%0D%0Auid%3A%20' +
      this.userData.uid.replace(/%20/g, ' ') +
      '%0D%0Anome%3A%20' +
      this.userData.displayName.replace(/%20/g, ' ') +
      '%0D%0Ae-mail%20institucional%3A%20' +
      this.userData.email.replace(/%20/g, ' ') +
      '%0D%0A';
    this.dataForm = this.formBuilder.group({
      academicID: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      dob: ['', [Validators.required, this.dateValidate]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(()?[1-9]{2}())? ?([2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$'
          ),
        ],
      ],
    });
  }

  formatDate(value: string) {
    return format(parseISO(value), 'dd/MM/yyyy');
  }

  formatPhone() {
    // Format phoneNumber value to '00 00000-0000'
    let phoneNumber = this.dataForm.value.phone;
    phoneNumber = phoneNumber.replace(/\D/g, '');
    phoneNumber = phoneNumber.replace(/^(\d{2})(\d)/g, '$1 $2');
    phoneNumber = phoneNumber.replace(/(\d)(\d{4})$/, '$1-$2');
    this.dataForm.controls.phone.setValue(phoneNumber);
  }

  dateValidate(control: FormControl) {
    const parsedDate = parse(control.value, 'P', new Date(), { locale: ptBR });

    // If date is invalid
    if (!isValid(parsedDate)) {
      return { error: parsedDate };
    }

    // If user is younger than 16 years, return error
    if (new Date().getFullYear() - parsedDate.getFullYear() < 16) {
      return { error: 'User is younger than 16 years' };
    }

    return null;
  }

  onSubmit() {
    if (!this.dataForm.valid) {
      return;
    }
  }
}
