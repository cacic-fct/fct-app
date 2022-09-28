import { Timestamp } from '@firebase/firestore-types';
import { Router } from '@angular/router';
import { MajorEventItem, MajorEventSubscription } from './../shared/services/major-event';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';
import { AngularFirestore, DocumentReference, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { trace } from '@angular/fire/compat/performance';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromUnixTime } from 'date-fns';
@UntilDestroy()
@Component({
  selector: 'app-page-subscriptions',
  templateUrl: './page-subscriptions.page.html',
  styleUrls: ['./page-subscriptions.page.scss'],
})
export class PageSubscriptionsPage implements OnInit {
  subscriptions$: Observable<Subscription[]>;

  constructor(public afs: AngularFirestore, public auth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    this.auth.user.pipe(untilDestroyed(this)).subscribe((user) => {
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
                  userData: subscription.reference.get().then((doc) => {
                    return doc.data();
                  }),
                  majorEvent: this.afs
                    .doc<MajorEventItem>(`majorEvents/${subscription.id}`)
                    .valueChanges({ idField: 'id' }),
                };
              });
            })
          );
      }
    });
  }

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }
  isInTheSubscriptionPeriod(endDateTimestamp: Timestamp): boolean {
    if (endDateTimestamp) {
      const now = new Date(); // Maybe it should get the current date from the server.
      const endDate = fromUnixTime(endDateTimestamp.seconds);
      return now < endDate;
    }
    return false;
  }
  isPastEvent(endDateTimestamp: Timestamp): boolean {
    if (endDateTimestamp) {
      const now = new Date(); // Maybe it should get the current date from the server.
      const endDate = fromUnixTime(endDateTimestamp.seconds);
      return now > endDate;
    }
    return false;
  }

  getCardType(majorEvent: MajorEventItem, subscription: MajorEventSubscription): number {
    const now = new Date();
    const eventEndDate = fromUnixTime(majorEvent.eventEndDate.seconds);
    if (now > eventEndDate && subscription.payment.status === 2) return -1;
    return subscription.payment.status;
  }

  getSubscriptionSubtitle(subscriptionType: number, price: number): string {
    const formattedPrice = price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    switch (subscriptionType) {
      case 0:
        return `Aluno da Unesp - ${formattedPrice}`;
      case 1:
        return `Aluno de outra instituição - ${formattedPrice}`;
      case 2:
        return `Professor e/ou profissional - ${formattedPrice}`;
      default:
        return `Público em geral - ${formattedPrice}`;
    }
  }
}

interface Subscription {
  id?: string;
  reference?: DocumentReference<MajorEventSubscription>;
  userData?: Promise<MajorEventSubscription>;
  majorEvent?: Observable<MajorEventItem>;
}
