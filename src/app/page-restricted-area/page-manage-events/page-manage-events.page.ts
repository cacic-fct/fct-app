import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { trace } from '@angular/fire/compat/performance';
import { addYears, endOfMonth, fromUnixTime, parseISO, startOfMonth } from 'date-fns';
import { BehaviorSubject, combineLatest, first, map, Observable, switchMap } from 'rxjs';
import { EventItem } from 'src/app/shared/services/event';
import { Timestamp } from '@firebase/firestore-types';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { MajorEventItem } from 'src/app/shared/services/major-event.service';

@Component({
  selector: 'app-page-manage-events',
  templateUrl: './page-manage-events.page.html',
  styleUrls: ['./page-manage-events.page.scss'],
})
export class PageManageEvents implements OnInit {
  today: Date = new Date();
  currentMonth: string = this.today.toISOString();
  currentMonth$: BehaviorSubject<string | null> = new BehaviorSubject(this.currentMonth);
  events$: Observable<EventItem[]>;
  constructor(private afs: AngularFirestore, public courses: CoursesService) {}

  ngOnInit() {
    this.events$ = combineLatest([this.currentMonth$]).pipe(
      switchMap(([date]) => {
        return this.afs
          .collection<EventItem>('events', (ref) => {
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

  public getMajorEventName$(majorEventId: string): Observable<string> {
    return this.afs
      .collection<MajorEventItem>('majorEvents')
      .doc(majorEventId)
      .valueChanges()
      .pipe(
        first(),
        map(majorEvent => majorEvent.name)
      );
  }
}
