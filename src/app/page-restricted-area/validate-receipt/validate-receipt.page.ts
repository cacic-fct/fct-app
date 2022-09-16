import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from '@firebase/firestore-types';
import { fromUnixTime } from 'date-fns';
import { Observable, map, first } from 'rxjs';
import { MajorEventItem } from 'src/app/shared/services/major-event';
import { User } from 'src/app/shared/services/user';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { trace } from '@angular/fire/compat/performance';

@UntilDestroy()
@Component({
  selector: 'app-validate-receipt',
  templateUrl: './validate-receipt.page.html',
  styleUrls: ['./validate-receipt.page.scss'],
})
export class ValidateReceiptPage implements OnInit {
  public eventId: string;
  public eventName$: Observable<string>;
  public subscriptions$: Observable<Subscription[]>;
  public imgBaseHref: string;

  constructor(private route: ActivatedRoute, private afs: AngularFirestore) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');

    const eventRef = this.afs.collection('majorEvents').doc<MajorEventItem>(this.eventId);

    this.eventName$ = eventRef.valueChanges().pipe(map((event) => event.name));

    this.subscriptions$ = eventRef
      .collection<Subscription>('subscriptions', (ref) => ref.where('payment.status', '==', 1))
      .valueChanges({ idField: 'id' })
      .pipe(
        untilDestroyed(this),
        trace('firestore'),
        map((subscription) => {
          return subscription.map((sub) => {
            return {
              ...sub,
              userDisplayName: this.userNameByID(sub.id),
            };
          });
        })
      );

    this.imgBaseHref = [this.eventId, 'payment-receipts'].join('/');
  }

  imgURL(receiptId: string): string {
    return [this.imgBaseHref, receiptId].join('/');
  }

  userNameByID(userId: string): Observable<string> {
    return this.afs
      .collection('users')
      .doc<User>(userId)
      .valueChanges()
      .pipe(
        first(),
        map((user) => user.displayName)
      );
  }

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }
}

interface Subscription {
  id: string;
  userDisplayName: Observable<string>;
  time: Timestamp;
  payment: {
    status: number;
    time: Timestamp;
    error?: string;
    price?: number;
    author?: string;
  };
  subscriptionType: number;
  subscribedToEvents: Array<string>;
}
