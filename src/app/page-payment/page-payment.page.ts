import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { trace } from '@angular/fire/compat/performance';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromUnixTime } from 'date-fns';
@UntilDestroy()
@Component({
  selector: 'app-page-payment',
  templateUrl: './page-payment.page.html',
  styleUrls: ['./page-payment.page.scss'],
})
export class PagePaymentPage implements OnInit {
  paymentsList: any[];

  constructor(public auth: AngularFireAuth, public firestore: AngularFirestore) {
    this.auth.user.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user) {
        this.firestore
          .collection(`users/${user.uid}/majorEventEnrollments`)
          .valueChanges({ idField: 'id' })
          .pipe(untilDestroyed(this), trace('firestore'))
          .subscribe((items: any[]) => {
            this.paymentsList = items.map((item) => {
              return {
                ...item,
                majorEvent: this.firestore
                  .collection('majorEvents')
                  .doc<any>(item.id)
                  .valueChanges()
                  .pipe(trace('firestore')),
              };
            });
          });
      }
    });
  }

  ngOnInit() {}

  getDateFromTimestamp(timestamp: any): Date {
    return fromUnixTime(timestamp.seconds);
  }
}
