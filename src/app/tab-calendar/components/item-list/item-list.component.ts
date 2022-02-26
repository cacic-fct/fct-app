import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Component, Input, OnChanges } from '@angular/core';
import { CoursesService } from 'src/app/shared/services/courses.service';

import { startOfDay, endOfDay, fromUnixTime, getDate } from 'date-fns';

import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs/operators';

export interface Event {
  name: string;
  icon: string;
  course: number;
  date: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
}
@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnChanges {
  courses = CoursesService.courses;

  @Input() date: Date;
  @Input() course: string;

  dateFilter$: BehaviorSubject<Date | null>;
  courseFilter$: BehaviorSubject<string | null>;

  items$: Observable<Event[]>;

  constructor(firestore: AngularFirestore, private navCtrl: NavController) {
    this.dateFilter$ = new BehaviorSubject(null);
    this.courseFilter$ = new BehaviorSubject(null);

    this.items$ = combineLatest([this.dateFilter$, this.courseFilter$]).pipe(
      switchMap(([date, course]) => {
        return firestore
          .collection<Event>('events', (ref) => {
            let query: any = ref;
            if (date) {
              query = query
                .where('date', '>=', startOfDay(date))
                .where('date', '<=', endOfDay(date));
            }
            if (course) {
              query = query.where('course', '==', '12');
            }
            return query.orderBy('date', 'asc');
          })
          .valueChanges({ idField: 'id' });
      })
    );
  }

  ngOnChanges() {
    this.dateFilter$.next(this.date);
    this.courseFilter$.next(this.course);
  }

  public openItem(item: any): void {
    this.navCtrl.navigateForward(['calendario/evento', item.id], {
      state: { item: item },
    });
  }

  getDateFromTimestamp(timestamp: any): Date {
    return fromUnixTime(timestamp);
  }

  // Convert emoji string to utf-8 code
  getEmoji(emoji: string): string {
    return emoji
      .split('-')
      .map((str) => String.fromCodePoint(parseInt(str, 16)))
      .join('');
  }

  // Emoji to codepoint
  getEmojiCode(emoji: string): string {
    if (emoji === undefined) {
      return '❔'.codePointAt(0).toString(16);
    }
    return emoji.codePointAt(0).toString(16);
  }
}
