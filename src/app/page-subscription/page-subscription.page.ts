import { EnrollmentTypesService } from './../shared/services/enrollment-types.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as firestore from 'firebase/firestore';
import { Timestamp } from '@firebase/firestore-types';
import { formatDate } from '@angular/common';
import { fromUnixTime, isSameDay, compareAsc } from 'date-fns';
import { combineLatest, first, map, Observable, switchMap } from 'rxjs';

import { MajorEventItem } from '../shared/services/major-event';
import { EventItem } from '../shared/services/event';
import { ModalController, ToastController } from '@ionic/angular';

import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { trace } from '@angular/fire/compat/performance';
@UntilDestroy()
@Component({
  selector: 'app-page-subscription',
  templateUrl: 'page-subscription.page.html',
  styleUrls: ['page-subscription.page.scss'],
})
export class PageSubscriptionPage implements OnInit {
  @ViewChild('successSwal')
  private successSwal: SwalComponent;
  @ViewChild('errorSwal')
  private errorSwal: SwalComponent;
  @ViewChild('maxChanged')
  private maxChanged: SwalComponent;
  @ViewChild('alreadySubscribed')
  private alreadySubscribed: SwalComponent;
  @ViewChild('eventNotFound')
  private eventNotFound: SwalComponent;

  today: Date = new Date();

  majorEvent$: Observable<MajorEventItem>;
  events$: Observable<EventItem[]>;

  maxCourses: number;
  maxLectures: number;

  eventsSelected = {
    minicurso: [],
    palestra: [],
  };

  opSelected: string;

  majorEventID = this.route.snapshot.params.eventID;

  constructor(
    public afs: AngularFirestore,
    public auth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private toastController: ToastController,
    public enrollmentTypes: EnrollmentTypesService
  ) {}

  ngOnInit() {
    // If majorEventID is not valid, redirect
    this.afs
      .collection('majorEvents')
      .doc(this.majorEventID)
      .get()
      .pipe(untilDestroyed(this), trace('firestore'))
      .subscribe((document) => {
        if (!document.exists) {
          this.eventNotFound.fire();
          setTimeout(() => {
            this.router.navigate(['eventos']);
            this.eventNotFound.close();
          }, 1000);
        }
      });

    // Check if user is already subscribed
    this.auth.user.pipe(first()).subscribe((user) => {
      if (user) {
        this.afs
          .doc<Subscription>(`users/${user.uid}/majorEventSubscriptions/${this.majorEventID}`)
          .valueChanges({ idField: 'id' })
          .pipe(first(), trace('firestore'))
          .subscribe((subscription) => {
            if (subscription.reference) {
              this.alreadySubscribed.fire();
              this.router.navigate(['/eventos'], { replaceUrl: true });

              setTimeout(() => {
                this.alreadySubscribed.close();
              }, 1000);
            }
          });
      }
    });

    this.majorEvent$ = this.afs
      .doc<MajorEventItem>(`majorEvents/${this.majorEventID}`)
      .valueChanges({ idField: 'id' })
      .pipe(trace('firestore'));

    this.events$ = this.majorEvent$.pipe(
      map((majorEvent) => {
        return majorEvent.events.map((event) => {
          return this.afs.doc<EventItem>(`events/${event}`).valueChanges({ idField: 'id' });
        });
      }),
      switchMap((events) => combineLatest(events))
    );

    this.majorEvent$.pipe(untilDestroyed(this)).subscribe((majorEvent) => {
      if (this.maxCourses && this.maxCourses !== majorEvent.maxCourses) {
        this.maxChanged.fire();
        this.router.navigateByUrl('/eventos/inscricao', { skipLocationChange: true }).then(() => {
          this.router.navigate([`/eventos/inscricao/${this.majorEventID}`]);
        });
      }

      if (this.maxLectures && this.maxLectures !== majorEvent.maxLectures) {
        this.maxChanged.fire();
        this.router.navigateByUrl('/eventos/inscricao', { skipLocationChange: true }).then(() => {
          this.router.navigate([`/eventos/inscricao/${this.majorEventID}`]);
        });
      }

      this.maxCourses = majorEvent.maxCourses;
      this.maxLectures = majorEvent.maxLectures;
    });
  }

  countCheckeds(e: any, event: EventItem) {
    const checked: boolean = e.currentTarget.checked;
    const name: string = e.currentTarget.name;

    if (this.eventsSelected[name]) {
      if (checked) {
        switch (name) {
          case 'minicurso':
            if (this.eventsSelected[name].length < this.maxCourses) {
              this.eventsSelected[name].push(event);
            } else {
              e.currentTarget.checked = false;
              this.presentLimitReachedToast('minicursos', this.maxCourses.toString());
            }
            break;
          case 'palestra':
            if (this.eventsSelected[name].length < this.maxLectures) {
              this.eventsSelected[name].push(event);
            } else {
              e.currentTarget.checked = false;
              this.presentLimitReachedToast('palestras', this.maxLectures.toString());
            }
            break;
        }
      } else {
        this.eventsSelected[name].splice(this.eventsSelected[name].indexOf(event), 1);
      }
    }
  }

  async presentLimitReachedToast(type: string, max: string) {
    const toast = await this.toastController.create({
      header: `Limite atingido`,
      message: `Você pode escolher até ${max} ${type}`,
      icon: 'alert-circle-outline',
      position: 'bottom',
      duration: 5000,
      buttons: [
        {
          side: 'end',
          text: 'OK',
          role: 'cancel',
        },
      ],
    });

    toast.present();
  }

  dayCompare(date1: Timestamp, date2: Timestamp): boolean {
    return isSameDay(fromUnixTime(date1.seconds), fromUnixTime(date2.seconds));
  }

  formatDate(date: Date): string {
    let formated = formatDate(date, "EEEE, dd 'de' MMMM 'de' yyyy", 'pt-BR');

    formated = formated.charAt(0).toUpperCase() + formated.slice(1);
    return formated;
  }

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }

  // Ununsed
  isBetweenDates(date1: Date, date2: Date, dateToCompare: Date): boolean {
    return compareAsc(date1, dateToCompare) === -1 && compareAsc(dateToCompare, date2) === -1;
  }

  goToConfirmSubscription() {
    this.router.navigateByUrl('/eventos/confirmar-inscricao', {
      state: {
        eventsSelected: this.eventsSelected,
        majorEvent: this.majorEvent$,
      },
    });
  }

  onSubmit() {
    if (
      this.eventsSelected['minicurso'].length + this.eventsSelected['palestra'].length === 0 ||
      this.opSelected === undefined
    ) {
      return;
    }

    this.openConfirmModal().then((response) => {
      if (!response) {
        return;
      }

      this.auth.user.pipe(first()).subscribe((user) => {
        if (user) {
          this.afs
            .doc<Subscription>(`users/${user.uid}/majorEventSubscriptions/${this.majorEventID}`)
            .valueChanges({ idField: 'id' })
            .pipe(first(), trace('firestore'))
            .subscribe((subscription) => {
              console.log(subscription.reference);
              if (!subscription.reference) {
                // Merge eventsSelected arrays
                const eventsSelected = Object.values(this.eventsSelected).reduce((acc, val) => acc.concat(val), []);

                // Create array with event IDs from eventsSelected
                const eventsSelectedID = eventsSelected.map((event) => event.id);

                const now: Timestamp = firestore.Timestamp.fromDate(new Date());

                this.afs
                  .collection(`majorEvents/${this.majorEventID}/subscriptions`)
                  .doc(user.uid)
                  .set({
                    subscriptionType: Number.parseInt(this.opSelected),
                    subscribedToEvents: eventsSelectedID,
                    time: now,
                    payment: {
                      status: 0,
                      time: now,
                      author: user.uid,
                    },
                  })
                  .then(() => {
                    this.afs
                      .collection(`users/${user.uid}/majorEventSubscriptions`)
                      .doc(this.majorEventID)
                      .set({
                        reference: `majorEvents/${this.majorEventID}/subscriptions/${user.uid}`,
                      })
                      .then(() => {
                        this.successSwal.fire();
                        setTimeout(() => {
                          this.successSwal.close();
                          this.router.navigate(['/eventos'], { replaceUrl: true });
                        }, 2000);
                      });
                  })
                  .catch((error) => {
                    console.error(error);
                    this.errorSwal.fire();
                  });

                setTimeout(() => {
                  this.successSwal.close();
                  this.router.navigate(['/eventos'], { replaceUrl: true });
                }, 1500);
              } else {
                this.alreadySubscribed.fire();
                this.router.navigate(['/eventos'], { replaceUrl: true });

                setTimeout(() => {
                  this.alreadySubscribed.close();
                }, 1000);
              }
            });
        }
      });
    });
  }

  async openConfirmModal(): Promise<boolean> {
    const eventsSelected: EventItem[] = Object.values(this.eventsSelected).reduce((acc, val) => acc.concat(val), []);

    eventsSelected.sort((a, b) => {
      return compareAsc(this.getDateFromTimestamp(a.eventStartDate), this.getDateFromTimestamp(b.eventStartDate));
    });

    const modal = await this.modalController.create({
      component: ConfirmModalComponent,
      componentProps: {
        majorEvent$: this.majorEvent$,
        eventsSelected: eventsSelected,
        minicursosCount: this.eventsSelected.minicurso.length,
        palestrasCount: this.eventsSelected.palestra.length,
        subscriptionType: this.opSelected,
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
}

interface Subscription {
  id?: string;
  reference?: DocumentReference<any>;
}
