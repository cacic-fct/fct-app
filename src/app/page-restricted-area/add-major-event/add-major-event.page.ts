import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { format, parseISO, addHours } from 'date-fns';

import { DomSanitizer } from '@angular/platform-browser';
import { parse } from 'twemoji-parser';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MajorEventItem } from 'src/app/shared/services/major-event';

import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-add-major-event',
  templateUrl: './add-major-event.page.html',
  styleUrls: ['./add-major-event.page.scss'],
})
export class AddMajorEventPage implements OnInit {
  @ViewChild('successSwal') private successSwal: SwalComponent;
  @ViewChild('errorSwal') private errorSwal: SwalComponent;

  courses = CoursesService.courses;
  dateRange: boolean = true;
  _dateRangeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.dateRange);
  dateRange$: Observable<boolean> = this._dateRangeSubject.asObservable();
  priceDifferentiate: boolean = true;
  _priceDifferentiateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.priceDifferentiate);
  priceDifferentiate$: Observable<boolean> = this._priceDifferentiateSubject.asObservable();
  isEventPaid: boolean = true;
  _isEventPaidSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isEventPaid);
  isEventPaid$: Observable<boolean> = this._isEventPaidSubject.asObservable();

  // TODO: Verificar se escrever isso duas vezes é necessário ou se estamos reproduzindo código desnecessário em todos os formulários já criados
  dataForm: FormGroup = new FormGroup({
    course: new FormControl(''),
    icon: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
    eventStartDate: new FormControl(''),
    eventEndDate: new FormControl(''),
    subscriptionStartDate: new FormControl(''),
    subscriptionEndDate: new FormControl(''),
    maxCourses: new FormControl(''),
    maxLectures: new FormControl(''),
    isEventPaidForm: new FormControl(''),
    priceSingle: new FormControl(''),
    priceStudents: new FormControl(''),
    priceOtherStudents: new FormControl(''),
    priceProfessors: new FormControl(''),
    accountChavePix: new FormControl(''),
    accountBank: new FormControl(''),
    accountName: new FormControl(''),
    accountDocument: new FormControl(''),
    accountAgency: new FormControl(''),
    accountNumber: new FormControl(''),
    additionalPaymentInformation: new FormControl(''),
    public: new FormControl(''),
    buttonText: new FormControl(''),
    buttonUrl: new FormControl(''),
  });

  userData: any;
  constructor(
    public formBuilder: FormBuilder,
    private modalController: ModalController,
    private afs: AngularFirestore,
    private router: Router,
    private auth: AngularFireAuth
  ) {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    const tzoffset: number = new Date().getTimezoneOffset() * 60000;
    const dateISO: string = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
    const dateISOHourOffset: string = addHours(new Date(Date.now() - tzoffset), 1)
      .toISOString()
      .slice(0, -1);

    this.dataForm = this.formBuilder.group(
      {
        course: ['', Validators.required],
        name: ['', Validators.required],
        description: '',
        eventStartDate: [dateISO, Validators.required],
        eventEndDate: [dateISOHourOffset],
        subscriptionStartDate: [dateISO, Validators.required],
        subscriptionEndDate: [dateISOHourOffset, Validators.required],
        maxCourses: '',
        maxLectures: '',
        isEventPaidForm: this.isEventPaid,
        priceSingle: '',
        priceStudents: '',
        priceOtherStudents: '',
        priceProfessors: '',
        accountChavePix: '',
        accountBank: '',
        accountName: '',
        accountDocument: '',
        accountAgency: '',
        accountNumber: '',
        additionalPaymentInformation: '',
        public: true,
        buttonText: '',
        buttonUrl: '',
      },
      {
        validators: [this.validatorButton, this.requirePaymentDetails, this.validateCPFOrCNPJ],
      }
    );
    this.userData.displayName.replace(/%20/g, ' ');
  }

  formatDate(value: string) {
    return format(parseISO(value), 'dd/MM/yyyy HH:mm');
  }

  onSubmit() {
    if (!this.dataForm.valid) {
      return false;
    }

    this.openConfirmModal().then((response) => {
      if (!response) {
        return;
      }
      let price: MajorEventItem['price'];

      if (this.isEventPaid) {
        if (this.priceDifferentiate) {
          price = {
            priceStudents: this.dataForm.get('priceStudents').value,
            priceOtherStudents: this.dataForm.get('priceOtherStudents').value,
            priceProfessors: this.dataForm.get('priceProfessors').value,
          };
        } else {
          price = {
            priceSingle: this.dataForm.get('priceSingle').value,
          };
        }
      } else {
        price.isFree = true;
      }

      let buttonUrl = this.dataForm.get('buttonUrl').value;

      if (buttonUrl) {
        if (!buttonUrl.test('^https?://(.*)')) {
          this.dataForm.setValue({ ...this.dataForm.value, buttonUrl: 'https://' + buttonUrl });
        }
      }

      this.auth.user.subscribe((user) => {
        this.afs
          .collection('majorEvents')
          .add({
            course: this.dataForm.get('course').value,
            name: this.dataForm.get('name').value,
            description: this.dataForm.get('description').value,
            eventStartDate: this.dataForm.get('eventStartDate').value,
            eventEndDate: this.dateRange ? this.dataForm.get('eventEndDate').value : undefined,
            maxCourses: this.dataForm.get('maxCourses').value,
            maxLectures: this.dataForm.get('maxLectures').value,
            subscriptionStartDate: this.dataForm.get('subscriptionStartDate').value,
            subscriptionEndDate: this.dataForm.get('subscriptionEndDate').value,
            price: price,
            paymentInfo: {
              chavePix: this.dataForm.get('accountChavePix').value,
              bankName: this.dataForm.get('accountBank').value,
              name: this.dataForm.get('accountName').value,
              document: this.dataForm.get('accountDocument').value,
              agency: this.dataForm.get('accountAgency').value,
              accountNumber: this.dataForm.get('accountNumber').value,
              additionalPaymentInformation: this.dataForm.get('additionalPaymentInformation').value,
            },
            public: this.dataForm.get('public').value,
            button: this.dataForm.get('buttonUrl').value
              ? {
                  text: this.dataForm.get('buttonText').value,
                  url: this.dataForm.get('buttonUrl').value,
                }
              : undefined,
            createdBy: user.uid,
            createdOn: new Date(),
          })
          .then(() => {
            this.successSwal.fire();
            // Fake delay to let animation finish
            setTimeout(() => {
              this.successSwal.close();
              this.router.navigate(['/area-restrita'], { replaceUrl: true });
            }, 1500);
          })
          .catch((err) => {
            this.errorSwal.fire();
            console.error('Failed to write majorEvent to Firestore', err);
          });
      });
    });
  }

  validatorButton(control: AbstractControl): ValidationErrors | null {
    if (control.get('buttonText').value != '') {
      control.get('buttonUrl').addValidators([Validators.required]);
    } else {
      control.get('buttonUrl').removeValidators([Validators.required]);
    }

    return null;
  }

  requirePaymentDetails(control: AbstractControl): ValidationErrors | null {
    if (
      control.get('isEventPaidForm').value === true &&
      (control.get('accountChavePix').value != '' || control.get('accountNumber').value != '')
    ) {
      control.get('accountBank').addValidators(Validators.required);
      control.get('accountName').addValidators(Validators.required);
      control.get('accountDocument').addValidators(Validators.required);
      control.get('accountAgency').addValidators(Validators.required);
      control.get('accountNumber').addValidators(Validators.required);
    } else {
      control.get('accountBank').removeValidators(Validators.required);
      control.get('accountName').removeValidators(Validators.required);
      control.get('accountDocument').removeValidators(Validators.required);
      control.get('accountAgency').removeValidators(Validators.required);
      control.get('accountNumber').removeValidators(Validators.required);
    }

    return null;
  }

  dateRangeChange() {
    this.dateRange = !this.dateRange;
    this._dateRangeSubject.next(this.dateRange);
  }

  priceDifferentiateChange() {
    this.priceDifferentiate = !this.priceDifferentiate;
    this._priceDifferentiateSubject.next(this.priceDifferentiate);
  }

  isEventPaidChange() {
    this.isEventPaid = !this.isEventPaid;
    this._isEventPaidSubject.next(this.isEventPaid);
    this.dataForm.controls['accountDocument'].updateValueAndValidity();
  }

  inputNumbersOnly(event) {
    const pattern = /\d/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // Not a number, prevent input
      event.preventDefault();
    }
  }

  async openConfirmModal(): Promise<boolean> {
    const modal = await this.modalController.create({
      component: ConfirmModalComponent,
      componentProps: {
        dataForm: this.dataForm,
        dateRange: this.dateRange,
        isEventPaid: this.isEventPaid,
      },
      showBackdrop: true,
    });
    await modal.present();

    return modal.onDidDismiss().then((data) => {
      if (data.data) {
        return new Promise<boolean>((resolve) => {
          resolve(true);
        });
      }
      return new Promise<boolean>((resolve) => {
        resolve(false);
      });
    });
  }

  inputCurrency(event) {
    if ((event.key < '0' || event.key > '9') && event.key !== '.' && event.key !== ',') {
      event.preventDefault();
    }
  }

  validateCPFOrCNPJ = (control: AbstractControl): ValidationErrors | null => {
    if (this.isEventPaid === true) {
      let cpfOrCnpj = control.value;

      if (cpfOrCnpj.length < 11) {
        return { accountDocument: false };
      } else {
        if (cpfOrCnpj.length === 11) {
          // If CPF is 000.000.000-00, 111.111.111-11, etc, return false
          if (/^(.)\1*$/.test(cpfOrCnpj)) {
            return { accountDocument: false };
          }
          let soma = 0;
          let peso = 10;
          let resto = 0;

          for (let i = 0; i < cpfOrCnpj.length - 2; i++) {
            soma += Number.parseInt(control.value[i]) * peso;
            peso--;
          }
          resto = soma % 11;

          let dv1 = 11 - resto;
          if (dv1 > 9) dv1 = 0;

          soma = 0;
          peso = 11;
          for (let i = 0; i < cpfOrCnpj.length - 2; i++) {
            soma += Number.parseInt(cpfOrCnpj[i]) * peso;
            peso--;
          }
          soma += dv1 * peso;

          resto = soma % 11;

          let dv2 = 11 - resto;
          if (dv2 > 9) dv2 = 0;

          if (
            Number.parseInt(cpfOrCnpj[cpfOrCnpj.length - 2]) !== dv1 ||
            Number.parseInt(cpfOrCnpj[cpfOrCnpj.length - 1]) !== dv2
          )
            return { accountDocument: false };
        } else if (cpfOrCnpj.length === 14) {
          let soma = 0;
          let resto = 0;
          let dv1 = 0;
          let dv2 = 0;
          let peso = 0;

          peso = 5;
          for (let i = 0; i < cpfOrCnpj.length - 2; i++) {
            soma += Number.parseInt(cpfOrCnpj[i]) * peso;
            peso--;

            if (peso === 1) peso = 9;
          }

          resto = soma % 11;
          dv1 = 11 - resto;
          if (dv1 > 9) dv1 = 0;

          soma = 0;
          resto = 0;
          peso = 6;
          for (let i = 0; i < cpfOrCnpj.length - 1; i++) {
            soma += Number.parseInt(cpfOrCnpj[i]) * peso;
            peso--;

            if (peso === 1) peso = 9;
          }

          resto = soma % 11;
          dv2 = 11 - resto;

          if (dv2 > 9) dv2 = 0;

          if (
            Number.parseInt(cpfOrCnpj[cpfOrCnpj.length - 2]) !== dv1 ||
            Number.parseInt(cpfOrCnpj[cpfOrCnpj.length - 1]) !== dv2
          )
            return { accountDocument: false };
        }
      }
    }
    return null;
  };

  validatePrice(event, key) {
    const cleanMoney = event.target.value
      // Remove anything that isn't valid in a number
      .replace(/[^\d.,]/g, '')
      // Replace all commas with periods
      .replace(/,/g, '.')
      // Remove all periods unless it is the last one
      .replace(/\.(?=.*\.)/g, '');
    this.dataForm.get(key).setValue(cleanMoney);
  }
}
