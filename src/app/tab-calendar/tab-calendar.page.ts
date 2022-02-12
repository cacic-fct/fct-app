import { Component } from '@angular/core';
import { KeyValue } from '@angular/common';

// Angular firebase
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

import { GlobalConstantsService } from '../shared/services/global-constants.service';
import { startOfWeek, endOfWeek, addDays, subDays, isSameDay } from 'date-fns';

import { filter, map } from 'rxjs/operators';

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
  selector: 'app-tab-calendar',
  templateUrl: 'tab-calendar.page.html',
  styleUrls: ['tab-calendar.page.scss'],
})
export class TabCalendarPage {
  eventCollection: AngularFirestoreCollection<Event>;
  courses = GlobalConstantsService.courses;
  items: Observable<any>;

  // Today's date
  today = new Date();

  // This is sunday in the calendar
  // Get startofWeek based on today's date
  calendarBaseDate = startOfWeek(this.today, {
    weekStartsOn: 0,
  });

  // Get end of week from today
  calendarEndDate = endOfWeek(this.today, {
    weekStartsOn: 0,
  });

  constructor(firestore: AngularFirestore) {
    /*   this.items = firestore
      .collection('events', (ref) =>
        ref
          .where('date', '>=', this.calendarBaseDate)
          .where('date', '<=', this.calendarEndDate)
      )
      .valueChanges({ idField: 'id' });*/

    this.eventCollection = firestore.collection('events');
    // .snapshotChanges() returns a DocumentChangeAction[], which contains
    // a lot of information about "what happened" with each change. If you want to
    // get the data and the id use the map operator.
    this.items = this.eventCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Event;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  // Function to get items that match day, month and year using filter from rxjs/operators
  getItems(date) {
    return this.items.pipe(
      filter((item) => {
        return isSameDay(item.date, date);
      })
    );
  }

  dow1Char = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Selected calendar date
  active = '';

  // List of days of week and date
  dowList = {
    sunday: { date: Date },
    monday: { date: Date },
    tuesday: { date: Date },
    wednesday: { date: Date },
    thursday: { date: Date },
    friday: { date: Date },
    saturday: { date: Date },
  };

  originalOrder = (
    a: KeyValue<string, {}>,
    b: KeyValue<string, Date>
  ): number => {
    return 0;
  };

  ngAfterViewInit() {
    this.generateCalendar(this.calendarBaseDate);
  }

  prevWeek() {
    this.calendarBaseDate = subDays(this.calendarBaseDate, 7);
    this.generateCalendar(this.calendarBaseDate);
  }

  nextWeek() {
    this.calendarBaseDate = addDays(this.calendarBaseDate, 7);
    this.generateCalendar(this.calendarBaseDate);
  }

  todayClick() {
    this.calendarBaseDate = startOfWeek(this.today, {
      weekStartsOn: 0,
    });
    this.generateCalendar(this.calendarBaseDate);
  }

  itemsDOW;

  // On click, set active class to clicked element
  dateClick(string) {
    if (string.target.id === this.active) {
      return 1;
    }

    // Remove active class from active element
    document.getElementById(this.active).classList.remove('active');

    // Set active to clicked element
    this.active = string.target.id;

    // Add active class to clicked element
    string.target.classList.add('active');

    this.refreshDateFull();

    // Pass items that match clicked date to itemsDOW
    this.itemsDOW = this.getItems(this.dowList[this.active].date);
  }

  refreshDateFull() {
    if (this.active === '') {
      return 1;
    }
    // Set element date-full innerHTML to day of week of active date
    let dowstring = this.dowList[this.active].date.toLocaleDateString('pt-BR', {
      weekday: 'long',
    });

    // Capitalize first letter of dowstring
    dowstring = dowstring.charAt(0).toUpperCase() + dowstring.slice(1);

    let dowday = this.dowList[this.active].date.toLocaleDateString('pt-BR', {
      day: 'numeric',
    });
    let dowmonth = this.dowList[this.active].date.toLocaleDateString('pt-BR', {
      month: 'long',
    });
    let dowyear = this.dowList[this.active].date.toLocaleDateString('pt-BR', {
      year: 'numeric',
    });

    document.getElementById('date-full').innerHTML =
      dowstring + ', ' + dowday + ' de ' + dowmonth + ' de ' + dowyear;
    document.getElementById(this.active).innerHTML;
  }

  generateCalendar(baseDate) {
    if (this.active != '') {
      document.getElementById(this.active).classList.remove('active');
      this.active = '';
    }

    // Copy based date to variable
    let base = new Date(baseDate);

    // Add one day to date
    function addOneDay(date) {
      date.setDate(date.getDate() + 1);
      return date;
    }

    // Get only day from date
    function getDay(date) {
      return date.getDate();
    }

    // YYYY/MM/DD
    let todayISO = this.today.toISOString().slice(0, 10);

    for (let dow in this.dowList) {
      // Get element in DOM
      let dowElement = document.getElementById(dow);

      // Insert calendarBaseDate in dowList object
      this.dowList[dow].date = new Date(base);

      // Insert date in inner html
      dowElement.innerHTML = getDay(base);

      // If today matches YYYY-MM-DD base, set class to active
      if (todayISO == base.toISOString().slice(0, 10)) {
        dowElement.classList.add('active');
        this.active = dow;
        this.itemsDOW = this.getItems(this.dowList[this.active].date);
      }

      // Add one day to calendarBaseDate
      base = addOneDay(base);
    }
    // If not active, set monday as active
    if (this.active === '') {
      document.getElementById('monday').classList.add('active');
      this.active = 'monday';
    }

    // refreshDatefull() pass this.dowList
    this.refreshDateFull();
  }

  filter() {}
}
