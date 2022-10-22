import { Component, OnInit } from '@angular/core';
import { addYears, endOfMonth, parseISO, startOfMonth } from 'date-fns';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { MajorEventItem } from 'src/app/shared/services/major-event.service';
import { trace } from '@angular/fire/compat/performance';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { DatesService } from 'src/app/shared/services/dates.service';

@Component({
  selector: 'app-page-manage-major-events',
  templateUrl: './page-manage-major-events.page.html',
  styleUrls: ['./page-manage-major-events.page.scss'],
})
export class PageManageMajorEventsPage implements OnInit {
  today: Date = new Date();
  currentMonth: string = this.today.toISOString();
  currentMonth$: BehaviorSubject<string | null> = new BehaviorSubject(this.currentMonth);
  majorEvents$: Observable<MajorEventItem[]>;

  constructor(private afs: AngularFirestore, public courses: CoursesService, public dates: DatesService) {}

  ngOnInit() {
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

  getLimitDate(): string {
    return addYears(this.today, 1).toISOString();
  }

  onMonthChange() {
    this.currentMonth$.next(this.currentMonth);
  }
}
