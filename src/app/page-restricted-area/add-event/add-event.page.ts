import { IonSelect, ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { MajorEventItem, MajorEventsService } from 'src/app/shared/services/majorEvents.service';
import { addSeconds, format, parseISO } from 'date-fns';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, first, Observable } from 'rxjs';
import * as firestore from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { EventItem } from './../../shared/services/event';
import { Timestamp } from '@firebase/firestore-types';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { ConfirmModalPage } from './confirm-modal/confirm-modal.page';
import { PlacesService } from './../../shared/services/places.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {
  @ViewChild('successSwal') private successSwal: SwalComponent;
  @ViewChild('errorSwal') private errorSwal: SwalComponent;
  @ViewChild('errorMajorEventSwal') private errorMajorEventSwal: SwalComponent;
  @ViewChild('selectPlace', { static: false }) selectPlace: IonSelect;

  courses = CoursesService.courses;
  places = PlacesService.places;
  majorEventsData$: Observable<MajorEventItem[]>;

  collectPresence: boolean = false;
  _collectPresenceSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.collectPresence);
  collectPresence$: Observable<boolean> = this._collectPresenceSubject.asObservable();

  hasDateEnd: boolean = false;
  _hasDateEndSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasDateEnd);
  hasDateEnd$: Observable<boolean> = this._hasDateEndSubject.asObservable();

  dataForm: FormGroup;

  userData: any;
  constructor(
    public formBuilder: FormBuilder,
    private modalController: ModalController,
    public majorEvents: MajorEventsService,
    private afs: AngularFirestore,
    private router: Router,
    private auth: AngularFireAuth
  ) {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const dateISO: string = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
    // TODO: Um evento deve terminar no mesmo dia, considerar a possibilidade do usuário criar um evento às 23:59:59
    const dateISOHourOffset: string = addSeconds(new Date(Date.now() - tzoffset), 1)
      .toISOString()
      .slice(0, -1);
    this.dataForm = this.formBuilder.group(
      {
        course: ['', Validators.required],
        icon: ['', [Validators.required, Validators.pattern(/^\p{Emoji}$/u)]],
        name: ['', Validators.required],
        shortDescription: ['', Validators.maxLength(80)],
        description: '',
        eventStartDate: [dateISO, Validators.required],
        eventEndDate: dateISOHourOffset,
        location: this.formBuilder.group({
          description: '',
          lat: [
            '',
            [
              //Validators.pattern('^(+|-)?(?:90(?:(?:.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:.[0-9]{1,6})?))$')
            ],
          ],
          lon: [
            '',
            [
              //Validators.pattern('^(+|-)?(?:180(?:(?:.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:.[0-9]{1,6})?))$')
            ],
          ],
        }),
        youtubeCode: '',
        public: '',
        button: this.formBuilder.group({
          text: '',
          url: '', // TODO: Verificar se URL inicia-se com http:// ou https://. Caso não, adicionar "https://"
        }),
        inMajorEvent: ['', Validators.required],
        eventType: ['', Validators.required],
        hasDateEndForm: this.hasDateEnd,
        issueCertificate: false,
        // doublePresence: false,
        collectPresenceForm: this.collectPresence,
      },
      {
        validators: [this.validatorLatLong, this.validatorButton, this.validatorDateEnd],
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
        this.auth.user.pipe(first()).subscribe((user) => {
          let majorEvent = this.dataForm.get('inMajorEvent').value;
          if (majorEvent === 'none') {
            majorEvent = null;
          }

          let dateEnd: Timestamp | null;

          if (this.hasDateEnd) {
            dateEnd = firestore.Timestamp.fromDate(new Date(this.dataForm.get('eventEndDate').value));
          } else {
            dateEnd = null;
          }

          let buttonUrl: string = this.dataForm.get('button').get('url').value;

          if (buttonUrl) {
            const pattern = /^((http|https):\/\/)/;
            if (!pattern.test(buttonUrl)) {
              this.dataForm
                .get('button')
                .get('url')
                .setValue('https://' + buttonUrl);
            }
          }

          this.afs
            .collection<EventItem>('events')
            .add({
              course: this.dataForm.get('course').value,
              icon: this.dataForm.get('icon').value,
              name: this.dataForm.get('name').value,
              shortDescription: this.dataForm.get('shortDescription').value,
              description: this.dataForm.get('description').value,
              eventStartDate: firestore.Timestamp.fromDate(new Date(this.dataForm.get('eventStartDate').value)),
              eventEndDate: dateEnd,
              location: {
                description: this.dataForm.get('location.description').value,
                lat: this.dataForm.get('location.lat').value,
                lon: this.dataForm.get('location.lon').value,
              },
              youtubeCode: this.dataForm.get('youtubeCode').value,
              public: this.dataForm.get('public').value,
              button: this.dataForm.get('button').get('url').value
                ? {
                    text: this.dataForm.get('button').get('text').value,
                    url: this.dataForm.get('button').get('url').value,
                  }
                : null,
              inMajorEvent: majorEvent,
              eventType: this.dataForm.get('eventType').value,
              issueCertificate: this.dataForm.get('issueCertificate').value,
              // doublePresence: this.dataForm.get('doublePresence').value,
              collectPresence: this.dataForm.get('collectPresenceForm').value,
              createdBy: user.uid,
              createdOn: firestore.Timestamp.fromDate(new Date()),
            })
            .then((res) => {
              if (majorEvent) {
                const eventId = res.id;
                this.afs
                  .collection('majorEvents')
                  .doc(majorEvent)
                  .update({ events: firestore.arrayUnion(eventId) })
                  .then(() => {
                    this.addEventSuccess();
                  })
                  .catch((err) => {
                    this.errorMajorEventSwal.fire();
                    console.error('Failed to add event ID in majorEvent array', err);
                  });
              } else {
                this.addEventSuccess();
              }
            })
            .catch((err) => {
              this.errorSwal.fire();
              console.error('Failed to write event to Firestore', err);
            });
        });
      }

      return;
    });
  }

  addEventSuccess(): void {
    this.successSwal.fire();
    // Fake delay to let animation finish
    setTimeout(() => {
      this.successSwal.close();
      this.router.navigate(['/area-restrita'], { replaceUrl: true });
    }, 1500);
  }

  async openConfirmModal(): Promise<boolean> {
    const modal = await this.modalController.create({
      component: ConfirmModalPage,
      componentProps: {
        dataForm: this.dataForm,
        hasDateEnd: this.hasDateEnd,
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
    if (control.get('location').get('lat').value == '' && control.get('location').get('lon').value == '') {
      control.get('location').get('lat').removeValidators(Validators.required);
      control.get('location').get('lon').removeValidators(Validators.required);
    }

    if (control.get('location').get('lon').value != '')
      control.get('location').get('lat').addValidators(Validators.required);

    if (control.get('location').get('lat').value != '')
      control.get('location').get('lon').addValidators(Validators.required);

    return null;
  }

  validatorDateEnd(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.get('hasDateEndForm').value) {
      let dateStart = parseISO(control.get('eventStartDate').value);
      let dateEnd = parseISO(control.get('eventEndDate').value);
      if (dateEnd < dateStart) return { dateRange: true };
    }

    return null;
  }

  validatorButton(control: AbstractControl): ValidationErrors | null {
    if (control.get('button').get('text').value != '')
      control.get('button').get('url').addValidators(Validators.required);
    else control.get('button').get('url').removeValidators(Validators.required);

    return null;
  }

  placeChange(ev: any) {
    if (this.places[ev.detail.value] === undefined) return 1;
    this.dataForm
      .get('location')
      .get('description')
      .setValue(
        this.places[ev.detail.value].name +
          (this.places[ev.detail.value].description ? ' - ' + this.places[ev.detail.value].description : '')
      );
    this.dataForm.get('location').get('lat').setValue(this.places[ev.detail.value].lat);
    this.dataForm.get('location').get('lon').setValue(this.places[ev.detail.value].lon);
  }

  collectPresenceChange() {
    this.collectPresence = !this.collectPresence;
    this._collectPresenceSubject.next(this.collectPresence);
  }

  hasDateEndChange() {
    this.hasDateEnd = !this.hasDateEnd;
    this._hasDateEndSubject.next(this.hasDateEnd);
  }

  placeInputKeyDown() {
    this.selectPlace.value = undefined;
  }
}
