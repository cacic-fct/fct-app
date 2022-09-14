import { ConfirmModalPage } from './confirm-modal/confirm-modal.page';
import { PlacesService } from './../../shared/services/places.service';
import { IonSelect, ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { MajorEventItem, MajorEventsService } from 'src/app/shared/services/majorEvents.service';
import { addHours, format, parseISO } from 'date-fns';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import * as firestore from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { EventItem } from './../../shared/services/event';

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
    const dateISOHourOffset: string = addHours(new Date(Date.now() - tzoffset), 1)
      .toISOString()
      .slice(0, -1);
    this.dataForm = this.formBuilder.group(
      {
        course: ['', Validators.required],
        icon: ['', [Validators.required, Validators.pattern(/^\p{Emoji}$/u)]],
        name: ['', Validators.required],
        shortDescription: ['', Validators.maxLength(80)],
        description: '',
        date: [dateISO, Validators.required],
        dateEnd: dateISOHourOffset,
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
        doublePresence: false,
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
        this.auth.user.subscribe((user) => {
          const data = {
            ...this.dataForm.value,
            createdBy: user.uid,
            createdOn: new Date(),
          };

          Object.keys(data).forEach((key) => {
            if (data[key] == '') delete data[key];
          });
          data.date = parseISO(data.date);
          if (data.hasDateEnd) data.dateEnd = parseISO(data.dateEnd);
          else delete data.dateEnd;

          delete data.hasDateEnd;

          const majorEvent = data.inMajorEvent;
          if (majorEvent === 'none') delete data.inMajorEvent;

          this.afs
            .collection('events')
            .add(data)
            .then((res) => {
              if (majorEvent !== 'none') {
                const eventId = res.id;
                this.afs
                  .collection('majorEvents')
                  .doc(majorEvent)
                  .update({ events: firestore.arrayUnion(eventId) })
                  .then(() => {
                    this.router.navigate(['area-restrita'], { replaceUrl: true });
                  });
              } else {
                this.router.navigate(['area-restrita'], { replaceUrl: true });
              }
            });
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
      let dateStart = parseISO(control.get('date').value);
      let dateEnd = parseISO(control.get('dateEnd').value);
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
