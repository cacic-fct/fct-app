import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/shared/services/courses.service';
import { parse } from 'twemoji-parser';
import { fromUnixTime, isSameDay, isSameMonth, startOfDay, startOfWeek, sub } from 'date-fns';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { EventItem } from 'src/app/shared/services/events.service';
import { trace } from '@angular/fire/compat/performance';
import { Timestamp } from '@firebase/firestore-types';
import { DatesService } from 'src/app/shared/services/dates.service';

@Component({
  selector: 'app-calendar-list-view',
  templateUrl: './calendar-list-view.component.html',
  styleUrls: ['./calendar-list-view.component.scss'],
})
export class CalendarListViewComponent implements OnInit, OnChanges {
  courses = CoursesService.courses;

  @Input() filter: {
    courses: Array<string>;
  };

  courseFilter$: BehaviorSubject<{
    courses: Array<string>;
  } | null> = new BehaviorSubject(null);
  dateFilter$: BehaviorSubject<Date | null> = new BehaviorSubject(null);

  loadOlderCount: number = 0;

  items$: Observable<EventItem[]>;

  baseDate: Date = startOfDay(new Date());

  constructor(
    private afs: AngularFirestore,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private toastController: ToastController,
    public dates: DatesService
  ) {}

  ngOnInit() {
    this.dateFilter$.next(this.baseDate);

    this.items$ = combineLatest([this.courseFilter$, this.dateFilter$]).pipe(
      switchMap(([filter, date]) => {
        return this.afs
          .collection<EventItem>('events', (ref) => {
            let query: any = ref;
            if (date) {
              query = query.where('eventStartDate', '>=', this.baseDate);
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
    this.courseFilter$.next(this.filter);
  }

  public openItem(item: any): void {
    this.navCtrl.navigateForward(['calendario/evento', item.id], {
      state: { item: item },
    });
  }

  getEmoji(emoji: string): any {
    if (emoji === undefined || !/^\p{Emoji}|\p{Emoji_Modifier}$/u.test(emoji)) {
      // TODO: validar apenas 1 emoji
      return this.sanitizer.bypassSecurityTrustResourceUrl(parse('❔')[0].url);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(parse(emoji)[0].url);
  }

  dayCompare(date1: Timestamp, date2: Timestamp): boolean {
    return isSameDay(fromUnixTime(date1.seconds), fromUnixTime(date2.seconds));
  }

  monthCompare(date1: Timestamp, date2: Timestamp): boolean {
    return isSameMonth(fromUnixTime(date1.seconds), fromUnixTime(date2.seconds));
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

  loadOlderEvents() {
    if (this.loadOlderCount == 0) {
      this.baseDate = startOfWeek(this.baseDate);
    }

    if (this.loadOlderCount > 3) {
      return;
    }

    this.loadOlderCount += 1;
    this.presentToast();
    this.baseDate = sub(this.baseDate, { weeks: 1 });
    this.dateFilter$.next(this.baseDate);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      header: 'Procurando por eventos mais antigos...',
      message: 'De até ' + this.loadOlderCount + (this.loadOlderCount == 1 ? ' semana ' : ' semanas ') + 'atrás',
      icon: 'search',
      position: 'bottom',
      duration: 1000,
      buttons: [],
    });
    toast.present();
  }
}
