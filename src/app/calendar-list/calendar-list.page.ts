import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Component, Input, OnChanges } from '@angular/core';
import { CoursesService } from 'src/app/shared/services/courses.service';

// Import parse from twemoji-parser
import { parse } from 'twemoji-parser';

import {
  startOfDay,
  endOfDay,
  fromUnixTime,
  getDate,
  isSameDay,
} from 'date-fns';

import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

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
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.page.html',
  styleUrls: ['./calendar-list.page.scss'],
})
export class CalendarListPage implements OnChanges {
  courses = CoursesService.courses;

  @Input() date: Date;
  @Input() filter: Array<string>;

  dateFilter$: BehaviorSubject<Date | null>;
  courseFilter$: BehaviorSubject<Array<string> | null>;

  items$: Observable<Event[]>;

  constructor(
    firestore: AngularFirestore,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer
  ) {
    this.dateFilter$ = new BehaviorSubject(null);
    this.courseFilter$ = new BehaviorSubject(null);

    this.items$ = combineLatest([this.dateFilter$, this.courseFilter$]).pipe(
      switchMap(([date, filter]) => {
        return firestore
          .collection<Event>('events', (ref) => {
            return ref;
          })
          .valueChanges({ idField: 'id' });
      })
    );
  }

  ngOnChanges() {
    this.dateFilter$.next(this.date);
    this.courseFilter$.next(this.filter);
  }

  public openItem(item: any): void {
    this.navCtrl.navigateForward(['calendario/evento', item.id], {
      state: { item: item },
    });
  }

  getDateFromTimestamp(timestamp: any): Date {
    return fromUnixTime(parseInt(timestamp.seconds));
  }

  getEmoji(emoji: string): any {
    if (emoji === undefined) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(parse('❔')[0].url);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(parse(emoji)[0].url);
  }

  dateCompare(date1: any, date2: any) {
    return isSameDay(fromUnixTime(date1), fromUnixTime(date2));
  }

  formatDate(date: Date): string {
    let formated = formatDate(date, "EEEE, dd 'de' MMMM 'de' yyyy", 'pt-BR');

    formated = formated.charAt(0).toUpperCase() + formated.slice(1);
    return formated;
  }
}
