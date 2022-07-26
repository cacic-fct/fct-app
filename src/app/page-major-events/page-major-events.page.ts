import { EnrollmentTypesService } from './../shared/services/enrollment-types.service';
import { Timestamp } from '@firebase/firestore-types';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { compareAsc, fromUnixTime } from 'date-fns';
import { Time } from '@angular/common';

@Component({
  selector: 'app-page-major-events',
  templateUrl: './page-major-events.page.html',
  styleUrls: ['./page-major-events.page.scss'],
})
export class PageMajorEventsPage implements OnInit {
  majorEvents: majorEvent[];
  today: Date = new Date();
  enrollmentTypes: EnrollmentTypesService;

  constructor(public afs: AngularFirestore) {
    this.afs
      .collection<majorEvent>('majorEvents', (ref) => ref.where('enrollmentDateEnd', '>=', this.today))
      .valueChanges({ idField: 'id' })
      .subscribe((items) => {
        this.majorEvents = items;
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
