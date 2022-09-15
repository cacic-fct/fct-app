import { Component, OnInit } from '@angular/core';
import { startOfMonth, endOfMonth, addDays, format, parseISO, fromUnixTime } from 'date-fns';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { MajorEventItem } from 'src/app/shared/services/major-event';
import { Timestamp } from '@firebase/firestore-types';
import { trace } from '@angular/fire/compat/performance';
import { CoursesService } from 'src/app/shared/services/courses.service';

@Component({
  selector: 'app-page-list-major-events',
  templateUrl: './page-list-major-events.page.html',
  styleUrls: ['./page-list-major-events.page.scss'],
})
export class PageListMajorEventsPage implements OnInit {
  itemsCollection: AngularFirestoreCollection<MajorEventItem>;
  item: MajorEventItem;
  currentDay: string = new Date().toISOString();
  majorEvents$: Observable<MajorEventItem[]>;

  constructor(private afs: AngularFirestore, public courses: CoursesService) {
    this.majorEvents$ = this.afs
      .collection<MajorEventItem>('majorEvents', (ref) => {
        let query: any = ref;
        query = query
          .where('eventStartDate', '<=', endOfMonth(parseISO(this.currentDay)))
          .where('eventStartDate', '>=', startOfMonth(parseISO(this.currentDay)));
        console.log(parseISO(this.currentDay));
        return query;
      })
      .valueChanges({ idField: 'id' })
      .pipe(trace('firestore'));
  }

  ngOnInit() {}

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }

  getLimitDate(): string {
    return addDays(new Date(), 365).toISOString();
  }
}

// firebase emulators:start --project fct-pp --import=./emulator-data --export-on-exit
