import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GlobalConstantsService } from 'src/app/shared/services/global-constants.service';

import {
  getTime,
  startOfDay,
  endOfDay,
  fromUnixTime,
  getUnixTime,
} from 'date-fns';

import { NavController } from '@ionic/angular';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map, switchMap } from 'rxjs/operators';

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
  courses = GlobalConstantsService.courses;

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
            return query;
          })
          .valueChanges();
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

  // Unix timestamp to date
  unixToDate(unix: number): Date {
    return new Date(unix * 1000);
  }
}
