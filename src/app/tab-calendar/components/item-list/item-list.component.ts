// @ts-strict-ignore
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/shared/services/courses.service';

import { startOfDay, endOfDay, fromUnixTime } from 'date-fns';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs/operators';

import { EventItem } from 'src/app/shared/services/event';
import { trace } from '@angular/fire/compat/performance';

import { Timestamp } from '@firebase/firestore-types';
import { EmojiService } from './../../../shared/services/emoji.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit, OnChanges {
  courses = CoursesService.courses;

  @Input() date: Date;
  @Input() filter: {
    courses: Array<string>;
  };

  dateFilter$: BehaviorSubject<Date | null> = new BehaviorSubject(null);
  courseFilter$: BehaviorSubject<{
    courses: Array<string>;
  } | null> = new BehaviorSubject(null);

  items$: Observable<EventItem[]>;

  constructor(private afs: AngularFirestore, public emojiService: EmojiService) {}

  ngOnInit() {
    this.items$ = combineLatest([this.dateFilter$, this.courseFilter$]).pipe(
      switchMap(([date, filter]) => {
        return this.afs
          .collection<EventItem>('events', (ref) => {
            let query: any = ref;
            if (date) {
              query = query
                .where('eventStartDate', '>=', startOfDay(date))
                .where('eventStartDate', '<=', endOfDay(date));
            }
            if (filter['courses'].length > 0) {
              query = query.where('course', 'in', filter['courses']);
            }

            return query.orderBy('eventStartDate', 'asc');
          })
          .valueChanges({ idField: 'id' })
          .pipe(trace('firestore'));
      })
    );
  }

  ngOnChanges() {
    this.dateFilter$.next(this.date);
    this.courseFilter$.next(this.filter);
  }

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }
}
