import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Component, Input, OnChanges } from '@angular/core';
import { CoursesService } from 'src/app/shared/services/courses.service';

import { parse } from 'twemoji-parser';

import { fromUnixTime, isSameDay, isSameMonth } from 'date-fns';

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
  selector: 'app-calendar-list-view',
  templateUrl: './calendar-list-view.component.html',
  styleUrls: ['./calendar-list-view.component.scss'],
})
export class CalendarListViewComponent implements OnChanges {
  courses = CoursesService.courses;

  @Input() filter: Array<string>;

  courseFilter$: BehaviorSubject<Array<string> | null>;

  items$: Observable<Event[]>;

  constructor(
    firestore: AngularFirestore,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer
  ) {
    this.courseFilter$ = new BehaviorSubject(null);

    this.items$ = combineLatest([this.courseFilter$]).pipe(
      switchMap(([filter]) => {
        return firestore
          .collection<Event>('events', (ref) => {
            let query: any = ref;
            if (filter.length > 0) {
              query = query.where('course', 'in', filter);
            }
            return query.orderBy('date', 'asc');
          })
          .valueChanges({ idField: 'id' });
      })
    );
  }

  ngOnChanges() {
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

  dayCompare(date1: any, date2: any) {
    return isSameDay(fromUnixTime(date1), fromUnixTime(date2));
  }

  monthCompare(date1: any, date2: any) {
    return isSameMonth(fromUnixTime(date1), fromUnixTime(date2));
  }

  formatDate(date: Date): string {
    let formated = formatDate(date, "EEEE, dd 'de' MMMM 'de' yyyy", 'pt-BR');

    formated = formated.charAt(0).toUpperCase() + formated.slice(1);
    return formated;
  }

  formatMonth(date: Date): string {
    let formated = formatDate(date, "MMMM 'de' yyyy", 'pt-BR');

    formated = formated.charAt(0).toUpperCase() + formated.slice(1);
    return formated;
  }
}
