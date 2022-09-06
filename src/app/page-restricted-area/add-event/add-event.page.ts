import { PlacesService } from './../../shared/services/places.service';
import { IonSelect, ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { MajorEventsService } from 'src/app/shared/services/majorEvents.service';
import { format, parseISO } from 'date-fns';
import { DomSanitizer } from '@angular/platform-browser';
import { parse } from 'twemoji-parser';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {
  @ViewChild('selectPlace', { static: false }) selectPlace: IonSelect;

  courses = CoursesService.courses;
  places = PlacesService.places;
  enableDateEnd = false;

  dataForm: FormGroup = new FormGroup({
    course: new FormControl(''),
    icon: new FormControl(''),
    name: new FormControl(''),
    shortDescription: new FormControl(''),
    description: new FormControl(''),
    date: new FormControl(''),
    dateEnd: new FormControl(''),
    locationDescription: new FormControl(''),
    locationLat: new FormControl(''),
    locationLon: new FormControl(''),
    youtubeCode: new FormControl(''),
    public: new FormControl(''),
    buttonText: new FormControl(''),
    buttonUrl: new FormControl(''),
    inMajorEvent: new FormControl(''),
  });

  userData: any;
  constructor(
    public formBuilder: FormBuilder,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    public majorEvents: MajorEventsService,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.dataForm = this.formBuilder.group(
      {
        course: ['', Validators.required],
        icon: ['', Validators.required],
        name: ['', Validators.required],
        shortDescription: ['', Validators.maxLength(80)],
        description: '',
        date: [new Date().toISOString(), Validators.required],
        dateEnd: '',
        locationDescription: '',
        locationLat: [
          '',
          [
            //Validators.pattern('^(+|-)?(?:90(?:(?:.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:.[0-9]{1,6})?))$')
          ],
        ],
        locationLon: [
          '',
          [
            //Validators.pattern('^(+|-)?(?:180(?:(?:.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:.[0-9]{1,6})?))$')
          ],
        ],
        youtubeCode: '',
        public: '',
        buttonText: '',
        buttonUrl: '',
        inMajorEvent: '',
      },
      {
        validators: [this.validatorLatLong, this.validatorButton, this.validatorDateEnd],
      }
    );
    this.userData.displayName.replace(/%20/g, ' ');
  }

  formatDate(value: string) {
    return format(parseISO(value), 'dd/MM/yyyy HH:mm');
  }

  onSubmit() {
    // TODO this.dataForm.invalid tem que ser checado antes de abrir o modal de confirmação.
    if (this.dataForm.invalid) return;
    const data = this.dataForm.value;
    Object.keys(data).forEach((key) => {
      if (data[key] == '') delete data[key];
    });
    data.date = parseISO(data.date);
    if (this.enableDateEnd) data.dateEnd = parseISO(data.dateEnd);
    else delete data.dateEnd;
    this.afs
      .collection('events')
      .add(data)
      .then((res) => {
        this.closeModal();
        this.router.navigate(['area-restrita'], { replaceUrl: true });
      });
  }

  validatorLatLong(control: AbstractControl): ValidationErrors | null {
    if (control.get('locationLat').value == '' && control.get('locationLon').value == '') {
      control.get('locationLat').removeValidators(Validators.required);
      control.get('locationLon').removeValidators(Validators.required);
    }

    if (control.get('locationLon').value != '') control.get('locationLat').addValidators(Validators.required);

    if (control.get('locationLat').value != '') control.get('locationLon').addValidators(Validators.required);

    return null;
  }

  validatorDateEnd(): ValidationErrors | null {
    // TODO como fazer a verificação data de término >= data de início
    if (this.enableDateEnd) {
      let dateStart = parseISO(this.dataForm.value.date);
      let dateEnd = parseISO(this.dataForm.value.dateEnd);
      if (dateEnd >= dateStart) return null;
      else return { message: 'Data de término deve ser posterior a data de início.' };
    }
  }

  validatorButton(control: AbstractControl): ValidationErrors | null {
    if (control.get('buttonText').value != '') control.get('buttonUrl').addValidators(Validators.required);
    else control.get('buttonUrl').removeValidators(Validators.required);

    return null;
  }

  closeModal() {
    this.modalController.dismiss();
  }

  placeChange(ev: any) {
    if (this.places[ev.detail.value] === undefined) return 1;
    this.dataForm
      .get('locationDescription')
      .setValue(
        this.places[ev.detail.value].name +
          (this.places[ev.detail.value].description ? ' - ' + this.places[ev.detail.value].description : '')
      );
    this.dataForm.get('locationLat').setValue(this.places[ev.detail.value].lat);
    this.dataForm.get('locationLon').setValue(this.places[ev.detail.value].lon);
  }

  placeInputKeyDown() {
    this.selectPlace.value = undefined;
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

  getDateFromTimestamp(isoString: string): Date {
    return parseISO(isoString);
  }
  getCourse(course: string): string {
    if (this.courses[course]) {
      return this.courses[course].name;
    }
    return '';
  }
}
