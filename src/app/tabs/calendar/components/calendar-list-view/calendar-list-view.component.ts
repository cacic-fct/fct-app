// @ts-strict-ignore
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Component, Input, OnChanges, OnInit, inject } from '@angular/core';
import { DateService } from 'src/app/shared/services/date.service';

import { startOfDay, startOfWeek, sub } from 'date-fns';

import { ToastController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { formatDate } from '@angular/common';

import { EventItem } from 'src/app/shared/services/event';
import { trace } from '@angular/fire/compat/performance';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  orderBy,
  DocumentData,
  Query,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-calendar-list-view',
  templateUrl: './calendar-list-view.component.html',
  styleUrls: ['./calendar-list-view.component.scss'],
})
export class CalendarListViewComponent implements OnInit, OnChanges {
  private firestore: Firestore = inject(Firestore);

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

  constructor(private toastController: ToastController, public dateService: DateService) {}

  ngOnInit() {
    this.dateFilter$.next(this.baseDate);

    this.items$ = combineLatest([this.courseFilter$, this.dateFilter$]).pipe(
      switchMap(([filter, date]) => {
        const collectionRef = collection(this.firestore, 'events');
        let q: Query<DocumentData>;

        if (date) {
          q = query(collectionRef, where('eventStartDate', '>=', this.baseDate), orderBy('eventStartDate', 'asc'));
        }

        if (filter['courses'].length > 0) {
          q = query(collectionRef, where('course', 'in', filter['courses']));
        }

        return collectionData(q, { idField: 'id' }).pipe(trace('firestore')) as Observable<EventItem[]>;
      })
    );
  }

  ngOnChanges() {
    this.courseFilter$.next(this.filter);
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
