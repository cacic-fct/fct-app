import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
