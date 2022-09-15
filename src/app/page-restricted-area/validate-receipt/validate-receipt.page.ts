import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from '@firebase/firestore-types';
import { MajorEventItem } from 'src/app/shared/services/major-event';

interface Subscription {
  time: Timestamp,
  payment: {
    status: number,
    time: Timestamp,
    error?: string,
    price?: number,
    author?: string
  },
  subscriptionType: number,
  subscribedToEvents: Array<string>
};

@Component({
  selector: 'app-validate-receipt',
  templateUrl: './validate-receipt.page.html',
  styleUrls: ['./validate-receipt.page.scss'],
})
export class ValidateReceiptPage implements OnInit {
  public eventId: string;
  public eventName: string;
  public subscriptions: Array<Subscription>;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');

    let eventRef = this.afs
      .collection<MajorEventItem>('majorEvents')
      .doc(this.eventId);

    eventRef.valueChanges().subscribe(data => {
      this.eventName = data.name
    });
    
    eventRef
      .collection<Subscription>('subscriptions', ref => ref.where('payment.status', '==', 1))
      .valueChanges({ idField: 'id' }).subscribe(data => {
        this.subscriptions = data;
      });
  }
}
