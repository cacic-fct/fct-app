import { IonSelect, ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { format, parseISO } from 'date-fns';

import { parse as parseDate } from 'date-fns';
import { DomSanitizer } from '@angular/platform-browser';
import { parse } from 'twemoji-parser';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-add-major-event',
  templateUrl: './add-major-event.page.html',
  styleUrls: ['./add-major-event.page.scss'],
})
export class AddMajorEventPage implements OnInit {
  @ViewChild('selectPlace', { static: false }) selectPlace: IonSelect;

  courses = CoursesService.courses;
  dateValue = '';
  dateRange: boolean = true;
  _dateRangeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  dateRange$: Observable<boolean> = this._dateRangeSubject.asObservable();
  priceDiferentiate: boolean = true;
  _priceDiferentiateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  priceDiferentiate$: Observable<boolean> = this._priceDiferentiateSubject.asObservable();

  dataForm: FormGroup = new FormGroup({
    course: new FormControl(''),
    icon: new FormControl(''),
    name: new FormControl(''),
    shortDescription: new FormControl(''),
    description: new FormControl(''),
    dateStart: new FormControl(''),
    dateEnd: new FormControl(''),
    price: new FormControl(''),
    priceDiferentiate: new FormControl(''),
    priceStudents: new FormControl(''),
    priceOtherStudents: new FormControl(''),
    priceProfessors: new FormControl(''),
    accountChavePix: new FormControl(''),
    accountBank: new FormControl(''),
    accountName: new FormControl(''),
    public: new FormControl(''),
    buttonText: new FormControl(''),
    buttonUrl: new FormControl(''),
  });

  userData: any;
  constructor(
    public formBuilder: FormBuilder,
    private modalController: ModalController,
    private sanitizer: DomSanitizer
  ) {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.dataForm = this.formBuilder.group(
      {
        course: ['', Validators.required],
        icon: ['', Validators.required],
        name: ['', Validators.required],
        shortDescription: '',
        description: '',
        dateStart: ['', Validators.required],
        dateEnd: '',
        price: '',
        priceDiferentiate: '',
        priceStudents: '',
        priceOtherStudents: '',
        priceProfessors: '',
        accountChavePix: '',
        accountBank: '',
        accountName: '',
        public: '',
        buttonText: '',
        buttonUrl: '',
      },
      {
        validators: [this.validatorButton, this.validatorPix],
      }
    );
    this.userData.displayName.replace(/%20/g, ' ');
  }

  formatDate(value: string) {
    return format(parseISO(value), 'dd/MM/yyyy HH:mm');
  }

  onSubmit() {
    console.log('submit');
  } // TODO implementar

  validatorButton(control: AbstractControl): ValidationErrors | null {
    if (control.get('buttonText').value != '') control.get('buttonUrl').addValidators(Validators.required);
    else control.get('buttonUrl').removeValidators(Validators.required);

    return null;
  }

  validatorPix(control: AbstractControl): ValidationErrors | null {
    if (control.get('accountChavePix').value != '') {
      control.get('accountBank').addValidators(Validators.required);
      control.get('accountName').addValidators(Validators.required);
    } else {
      control.get('accountBank').removeValidators(Validators.required);
      control.get('accountName').removeValidators(Validators.required);
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

  toUppercase(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

  priceDiferentiateChange() {
    this.priceDiferentiate = !this.priceDiferentiate;
    this._priceDiferentiateSubject.next(this.priceDiferentiate);
  }

  inputNumbersOnly(event) {
    const pattern = /\d/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // Not a number, prevent input
      event.preventDefault();
    }
  }
}
