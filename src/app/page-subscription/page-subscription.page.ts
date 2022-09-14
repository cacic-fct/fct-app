import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { trace } from '@angular/fire/compat/performance';
import { Timestamp } from '@firebase/firestore-types';
import { formatDate } from '@angular/common';
import { compareAsc, fromUnixTime } from 'date-fns';
import { Observable } from 'rxjs';

import { MajorEventItem } from '../shared/services/major-event';

@Component({
  selector: 'app-page-subscription',
  templateUrl: 'page-subscription.page.html',
  styleUrls: ['page-subscription.page.scss'],
})
export class PageSubscriptionPage {
  majorEvent$: Observable<MajorEventItem>;
  today: Date = new Date();

  constructor(public afs: AngularFirestore, public auth: AngularFireAuth, private router: Router) {
    const id = this.router.url.split('/')[3];
    this.majorEvent$ = this.afs.doc<MajorEventItem>(`majorEvents/${id}`).valueChanges({ idField: 'id' }).pipe(trace('firestore'));
  }

  ngOnInit() {}

  formatDate(date: Date): string {
    let formated = formatDate(date, "EEEE, dd 'de' MMMM 'de' yyyy", 'pt-BR');

    formated = formated.charAt(0).toUpperCase() + formated.slice(1);
    return formated;
  }

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(parseInt(timestamp.seconds.toString()));
  }

  isTodayBetweenDates(date1: Date, date2: Date) {
    const leftCompare = compareAsc(date1, this.today);
    const rightCompare = compareAsc(date2, this.today);

    return leftCompare <= 0 && rightCompare >= 0;
  }
}
