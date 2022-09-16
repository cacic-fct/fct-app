import { Component } from '@angular/core';
import { startOfMonth, endOfMonth, format, parseISO, fromUnixTime, addYears } from 'date-fns';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { MajorEventItem } from 'src/app/shared/services/major-event';
import { Timestamp } from '@firebase/firestore-types';
import { trace } from '@angular/fire/compat/performance';
import { CoursesService } from 'src/app/shared/services/courses.service';

@Component({
  selector: 'app-page-list-major-events',
  templateUrl: './page-list-major-events.page.html',
  styleUrls: ['./page-list-major-events.page.scss'],
})
export class PageListMajorEventsPage {
  today: Date = new Date();
  currentMonth: string = this.today.toISOString();
  currentMonth$: BehaviorSubject<string | null> = new BehaviorSubject(this.currentMonth);
  majorEvents$: Observable<MajorEventItem[]>;

  constructor(private afs: AngularFirestore, public courses: CoursesService) {
    this.majorEvents$ = combineLatest([this.currentMonth$]).pipe(
      switchMap(([date]) => {
        return this.afs
          .collection<MajorEventItem>('majorEvents', (ref) => {
            let query: any = ref;
            query = query
              .where('eventStartDate', '<=', endOfMonth(parseISO(date)))
              .where('eventStartDate', '>=', startOfMonth(parseISO(date)));
            return query;
          })
          .valueChanges({ idField: 'id' })
          .pipe(trace('firestore'));
      })
    );
  }

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }

  getLimitDate(): string {
    return addYears(this.today, 1).toISOString();
  }

  onMonthChange() {
    this.currentMonth$.next(this.currentMonth);
  }
}
