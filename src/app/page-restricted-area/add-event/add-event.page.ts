import { ConfirmModalPage } from './confirm-modal/confirm-modal.page';
import { PlacesService } from './../../shared/services/places.service';
import { IonSelect, ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { MajorEventItem, MajorEventsService } from 'src/app/shared/services/majorEvents.service';
import { format, parseISO } from 'date-fns';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {
  @ViewChild('selectPlace', { static: false }) selectPlace: IonSelect;

  courses = CoursesService.courses;
  places = PlacesService.places;
  majorEventsData$: Observable<MajorEventItem[]>;
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
        icon: ['', Validators.required, Validators.pattern(/^\p{Emoji}$/u)],
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
        buttonUrl: '', // TODO: Verificar se URL inicia-se com http:// ou https://. Caso não, adicionar "https://"
        inMajorEvent: '',
      },
      {
        validators: [this.validatorLatLong, this.validatorButton],
      }
    );
    this.userData.displayName.replace(/%20/g, ' ');
    this.majorEventsData$ = this.majorEvents.getFutureMajorEvents();
  }

  formatDate(value: string) {
    return format(parseISO(value), 'dd/MM/yyyy HH:mm');
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      return;
    }
    this.openConfirmModal().then((response) => {
      if (response) {
        console.log('response', response);
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
            this.router.navigate(['area-restrita'], { replaceUrl: true });
          });
      }

      return;
    });
  }

  async openConfirmModal(): Promise<boolean> {
    const modal = await this.modalController.create({
      component: ConfirmModalPage,
      componentProps: {
        dataForm: this.dataForm,
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
}
