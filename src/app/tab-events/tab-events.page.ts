import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { trace } from '@angular/fire/compat/performance';
import { Timestamp } from '@firebase/firestore-types';
import { first } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { compareAsc, fromUnixTime } from 'date-fns';

@UntilDestroy()
@Component({
  selector: 'app-tab-events',
  templateUrl: 'tab-events.page.html',
  styleUrls: ['tab-events.page.scss'],
})
export class TabEventsPage {
  majorEvents: majorEvent[];
  today: Date = new Date();

  constructor(public afs: AngularFirestore, public auth: AngularFireAuth) {
    this.auth.authState.pipe(first()).subscribe((user) => {
      this.afs.collection<majorEvent>('majorEvents', (ref) => {
        return user ? (
          ref.where('subscriptionDateEnd', '>=', this.today)
        ) : (
          ref.where('subscriptionDateEnd', '>=', this.today).where('public', '==', true)
        )
      })
      .valueChanges({ idField: 'id' })
      .pipe(untilDestroyed(this), trace('firestore'))
      .subscribe((items) => {
        console.log(items)
        this.majorEvents = items;
      })
    });
  }

  ngOnInit() {}

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }

  compareDate(date1: Date, date2: Date) {
    return compareAsc(date1, date2) === -1;
  }

  isObject(item: any) {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
  }

  isNumber(item: any) {
    return typeof item === 'number';
  }
}

interface majorEvent {
  price?: any;
  id: string;
  name: string;
  description?: string;
  enrollmentDateStart: Timestamp;
  enrollmentDateEnd: Timestamp;
  eventDateStart: Timestamp;
  eventDateEnd?: Timestamp;
}
