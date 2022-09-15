import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from '@firebase/firestore-types';
import { fromUnixTime } from 'date-fns';
import { Observable, map, first } from 'rxjs';
import { MajorEventItem } from 'src/app/shared/services/major-event';
import { User } from 'src/app/shared/services/user';

interface Subscription {
  id: string;
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

    let eventRef = this.afs.collection<MajorEventItem>('majorEvents').doc(this.eventId);

    this.eventName$ = eventRef.valueChanges().pipe(map((event) => event.name));

    this.subscriptions$ = eventRef
      .collection<Subscription>('subscriptions', (ref) => ref.where('payment.status', '==', 1))
      .valueChanges({ idField: 'id' })
      .pipe(first());

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
