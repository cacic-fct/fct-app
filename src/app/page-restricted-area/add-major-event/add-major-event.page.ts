import { IonSelect, ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { format, parseISO } from 'date-fns';

import { parse as parseDate } from 'date-fns';
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
  @ViewChild('selectPlace', { static: false }) selectPlace: IonSelect;

  courses = CoursesService.courses;
  dateRange: boolean = true;
  _dateRangeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  dateRange$: Observable<boolean> = this._dateRangeSubject.asObservable();
  priceDifferentiate: boolean = false;
  _priceDifferentiateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  priceDifferentiate$: Observable<boolean> = this._priceDifferentiateSubject.asObservable();
  isEventPaid: boolean = true;
  _isEventPaidSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  isEventPaid$: Observable<boolean> = this._isEventPaidSubject.asObservable();

  dataForm: FormGroup = new FormGroup({
    course: new FormControl('', [Validators.required]),
    icon: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    eventStartDate: new FormControl(new Date().toISOString(), [Validators.required]),
    eventEndDate: new FormControl(new Date().toISOString()),
    subscriptionStartDate: new FormControl(new Date().toISOString()),
    subscriptionEndDate: new FormControl(new Date().toISOString()),
    maxCourses: new FormControl(''),
    maxLectures: new FormControl(''),
    isEventPaidForm: new FormControl(''), // TODO: arrumar isso
    priceSingle: new FormControl(''),
    priceStudents: new FormControl(''),
    priceOtherStudents: new FormControl(''),
    priceProfessors: new FormControl(''),
    accountChavePix: new FormControl(''),
    accountBank: new FormControl(''),
    accountName: new FormControl(''),
    accountDocument: new FormControl('', [this.validateCPFOrCNPJ]),
    accountAgency: new FormControl(''),
    accountNumber: new FormControl(''),
    additionalPaymentInformation: new FormControl(''),
    public: new FormControl(true),
    buttonText: new FormControl(''),
    buttonUrl: new FormControl(''),
  });

  userData: any;
  constructor(
    public formBuilder: FormBuilder,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    private afs: AngularFirestore
  ) {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    let dateISO: string = new Date().toISOString();
    this.dataForm = this.formBuilder.group(
      {
        course: ['', Validators.required],
        name: ['', Validators.required],
        description: '',
        eventStartDate: [new Date().toISOString(), Validators.required],
        eventEndDate: [new Date().toISOString()],
        subscriptionStartDate: [new Date().toISOString(), Validators.required],
        subscriptionEndDate: [new Date().toISOString(), Validators.required],
        maxCourses: '',
        maxLectures: '',
        isEventPaidForm: '',
        priceSingle: '',
        price: '0',
        priceStudents: '0',
        priceOtherStudents: '0',
        priceProfessors: '0',
        accountChavePix: '',
        accountBank: '',
        accountName: '',
        accountDocument: ['', this.validateCPFOrCNPJ],
        accountAgency: '',
        accountNumber: '',
        additionalPaymentInformation: '',
        public: true,
        buttonText: '',
        buttonUrl: '',
      },
      {
        validators: [this.validatorButton, this.requirePaymentDetails],
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

    this.openConfirmModal()
      .then((response) => {
        if (response) {
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

          this.afs.collection('majorEvents').add({
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
            accountChavePix: this.dataForm.get('accountChavePix').value,
            accountBank: this.dataForm.get('accountBank').value,
            accountName: this.dataForm.get('accountName').value,
            accountDocument: this.dataForm.get('accountDocument').value,
            accountAgency: this.dataForm.get('accountAgency').value,
            accountNumber: this.dataForm.get('accountNumber').value,
            additionalPaymentInformation: this.dataForm.get('additionalPaymentInformation').value,
            public: this.dataForm.get('public').value,
            button: this.dataForm.get('buttonUrl').value
              ? {
                  buttonText: this.dataForm.get('buttonText').value,
                  buttonUrl: this.dataForm.get('buttonUrl').value,
                }
              : undefined,
            createdBy: this.userData.displayName,
            createdOn: new Date(),
          });
        }
      })
      .then((success) => {
        alert('Evento cadastrado com sucesso =)');
        window.location.reload();
      })
      .catch((err) => {
        alert(`Falha ao salvar evento\n${err}`);
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
    if (control.get('public').value && control.get('accountChavePix').value === '') {
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

  closeModal() {
    this.modalController.dismiss();
  }

  getEmoji(emoji: string): any {
    if (emoji === undefined) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(parse('❔')[0].url);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(parse(emoji)[0].url);
  }

  getDateFromTimestamp(timestamp: any): Date {
    return parseDate(timestamp, 'dd/MM/yyyy HH:mm', new Date());
  }
  getCourse(course: string): string {
    if (this.courses[course]) {
      return this.courses[course].name;
    }
    return '';
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
    if (event.getModifierState('Meta') || event.getModifierState('Control') || event.getModifierState('Alt')) {
      return;
    }

    if (event.key.length !== 1 || event.key === '\x00') {
      return;
    }

    if ((event.key < '0' || event.key > '9') && event.key !== '.') {
      event.preventDefault();
    }
  }

  validateCPFOrCNPJ(control: AbstractControl): ValidationErrors | null {
    if (control.value.length < 11) {
      return { accountDocument: false };
    } else {
      if (control.value.length === 11) {
        let soma = 0;
        let peso = 10;
        let resto = 0;

        for (let i = 0; i < control.value.length - 2; i++) {
          soma += Number.parseInt(control.value[i]) * peso;
          peso--;
        }
        resto = soma % 11;

        let dv1 = 11 - resto;
        if (dv1 > 9) dv1 = 0;

        soma = 0;
        peso = 11;
        for (let i = 0; i < control.value.length - 2; i++) {
          soma += Number.parseInt(control.value[i]) * peso;
          peso--;
        }
        soma += dv1 * peso;

        resto = soma % 11;

        let dv2 = 11 - resto;
        if (dv2 > 9) dv2 = 0;

        if (
          Number.parseInt(control.value[control.value.length - 2]) !== dv1 ||
          Number.parseInt(control.value[control.value.length - 1]) !== dv2
        )
          return { accountDocument: false };
      } else if (control.value.length === 14) {
        let soma = 0;
        let resto = 0;
        let dv1 = 0;
        let dv2 = 0;
        let peso = 0;

        peso = 5;
        for (let i = 0; i < control.value.length - 2; i++) {
          soma += Number.parseInt(control.value[i]) * peso;
          peso--;

          if (peso === 1) peso = 9;
        }

        resto = soma % 11;
        dv1 = 11 - resto;
        if (dv1 > 9) dv1 = 0;

        soma = 0;
        resto = 0;
        peso = 6;
        for (let i = 0; i < control.value.length - 1; i++) {
          soma += Number.parseInt(control.value[i]) * peso;
          peso--;

          if (peso === 1) peso = 9;
        }

        resto = soma % 11;
        dv2 = 11 - resto;

        if (dv2 > 9) dv2 = 0;

        if (
          Number.parseInt(control.value[control.value.length - 2]) !== dv1 ||
          Number.parseInt(control.value[control.value.length - 1]) !== dv2
        )
          return { accountDocument: false };
      }
    }

    return null;
  }

  validMoney(event, key) {
    const cleanMoney = event.target.value
      // Remove anything that isn't valid in a number
      .replace(/[^\d-.]/g, '')
      // Remove all dashes unless it is the first character
      .replace(/(?!^)-/g, '')
      // Remove all periods unless it is the last one
      .replace(/\.(?=.*\.)/g, '');

    this.dataForm.get(key).setValue(cleanMoney);
  }
}
