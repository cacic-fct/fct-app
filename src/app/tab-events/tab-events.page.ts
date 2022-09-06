import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { trace } from '@angular/fire/compat/performance';
import { Timestamp } from '@firebase/firestore-types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { compareAsc, fromUnixTime } from 'date-fns';

import { EventItem } from '../shared/services/major-event';

@UntilDestroy()
@Component({
  selector: 'app-tab-events',
  templateUrl: 'tab-events.page.html',
  styleUrls: ['tab-events.page.scss'],
})
export class TabEventsPage {
  majorEvents: EventItem[];
  today: Date = new Date();

  constructor(public afs: AngularFirestore, public auth: AngularFireAuth) {
    this.afs.collection<EventItem>('majorEvents', (ref) => {
      return ref.orderBy('subscriptionDateEnd', 'asc')
    })
    .valueChanges({ idField: 'id' })
    .pipe(untilDestroyed(this), trace('firestore'))
    .subscribe((items) => {
      this.majorEvents = items;
    })
  }

  ngOnInit() {}

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }

  isTodayBetweenDates(date1: Date, date2: Date) {
    const leftCompare = compareAsc(date1, this.today)
    const rightCompare = compareAsc(date2, this.today)

    return (leftCompare == -1 || leftCompare === 0) && (rightCompare === 1 || rightCompare === 0)
  }

  isObject(item: any) {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
  }

  isNumber(item: any) {
    return typeof item === 'number';
  }
}
