// @ts-strict-ignore
import { EventItem, EventSubscription } from 'src/app/shared/services/event';
import { Timestamp } from '@firebase/firestore-types';
import { MajorEventItem, MajorEventSubscription } from '../../shared/services/major-event.service';
import { Component, inject, OnInit } from '@angular/core';
import { map, Observable, switchMap, combineLatest } from 'rxjs';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';

import { trace } from '@angular/fire/compat/performance';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EnrollmentTypesService } from '../../shared/services/enrollment-types.service';
import { DateService } from 'src/app/shared/services/date.service';
import { Auth, user } from '@angular/fire/auth';
import { CurrencyPipe, DatePipe, AsyncPipe } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonIcon,
  IonContent,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar,
  IonButton,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonCard,
  IonText,
  IonSpinner,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-subscribe',
  templateUrl: './my-attendances.page.html',
  styleUrls: ['./my-attendances.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonRouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonProgressBar,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonText,
    IonSpinner,
    CurrencyPipe,
    DatePipe,
    AsyncPipe,
  ],
})
export class MyAttendancesPage implements OnInit {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);

  subscriptions$!: Observable<Subscription[]>;
  eventSubscriptions$!: Observable<EventSubscriptionLocal[]>;

  today: Date = new Date();

  constructor(
    public afs: AngularFirestore,
    public enrollmentTypes: EnrollmentTypesService,
    public dateService: DateService
  ) {
    this.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user) {
        this.subscriptions$ = this.afs
          .collection<Subscription>(`users/${user.uid}/majorEventSubscriptions`)
          .valueChanges({ idField: 'id' })
          .pipe(
            untilDestroyed(this),
            trace('firestore'),
            map((subscriptions) => {
              return subscriptions.map((subscription) => {
                return {
                  id: subscription.id,
                  userData: this.afs
                    .doc<MajorEventSubscription>(`majorEvents/${subscription.id}/subscriptions/${user.uid}`)
                    .valueChanges(),
                  majorEvent: this.afs
                    .doc<MajorEventItem>(`majorEvents/${subscription.id}`)
                    .valueChanges({ idField: 'id' }),
                };
              });
            })
          );

        this.eventSubscriptions$ = this.afs
          .collection<EventSubscriptionLocal>(`users/${user.uid}/eventSubscriptions`)
          .valueChanges({ idField: 'id' })
          .pipe(
            trace('firestore'),
            map((subscriptions) => {
              const arrayOfEvents: Observable<EventItem>[] = subscriptions.map((subscription) => {
                return this.afs.doc<EventItem>(`events/${subscription.id}`).valueChanges({ idField: 'id' });
              });

              let observableArrayOfEvents: Observable<EventItem[]> = combineLatest(arrayOfEvents);

              observableArrayOfEvents = observableArrayOfEvents.pipe(
                map((events) => {
                  return events.sort((a, b) => {
                    return a.eventStartDate.seconds - b.eventStartDate.seconds;
                  });
                })
              );

              return observableArrayOfEvents.pipe(
                map((events) => {
                  return events.map((event) => {
                    return {
                      id: event.id,
                      event: event,
                      userData: this.afs
                        .doc<EventSubscription>(`events/${event.id}/subscriptions/${user.uid}`)
                        .valueChanges(),
                    };
                  });
                })
              );
            }),
            switchMap((observable) => observable)
          );
      }
    });
  }

  ngOnInit() {}

  isInSubscriptionPeriod(endDateTimestamp: Timestamp): boolean {
    if (endDateTimestamp) {
      const endDate = this.dateService.getDateFromTimestamp(endDateTimestamp);
      return this.today < endDate;
    }
    return false;
  }

  isPastEvent(endDateTimestamp: Timestamp): boolean {
    if (endDateTimestamp) {
      const endDate = this.dateService.getDateFromTimestamp(endDateTimestamp);
      return this.today > endDate;
    }
    return false;
  }

  getCardType(majorEvent: MajorEventItem, subscription: MajorEventSubscription): number {
    const eventEndDate = this.dateService.getDateFromTimestamp(majorEvent.eventEndDate);
    if (this.today > eventEndDate && subscription.payment.status === 2) return -1;
    return subscription.payment.status;
  }
}

interface Subscription {
  id?: string;
  reference?: DocumentReference<MajorEventSubscription>;
  userData?: Observable<MajorEventSubscription>;
  majorEvent?: Observable<MajorEventItem>;
}

export interface EventSubscriptionLocal {
  id?: string;
  reference?: DocumentReference<any>;
  userData?: Observable<EventSubscription>;
  event?: EventItem;
}
