import { Component } from '@angular/core';
import { KeyValue } from '@angular/common';

import {
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  isSameDay,
  getDate,
  format,
  isSameWeek,
} from 'date-fns';

import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-tab-calendar',
  templateUrl: 'tab-calendar.page.html',
  styleUrls: ['tab-calendar.page.scss'],
})
export class TabCalendarPage {
  // Selected calendar date
  active: string;
  fullDate: string;

  // Today's date
  today = new Date();

  dow1Char = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

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

  // This is sunday in the calendar
  // Get startofWeek based on today's date
  calendarBaseDate = startOfWeek(this.today, {
    weekStartsOn: 0,
  });

  // Get end of week from today
  calendarEndDate = endOfWeek(this.today, {
    weekStartsOn: 0,
  });

  constructor() {
    this.active = format(this.today, 'eeee').toLowerCase();
    this.generateCalendarData();
  }

  ngOnInit() {}

  originalOrder = (a: KeyValue<any, any>, b: KeyValue<any, any>): number => {
    return 0;
  };

  prevWeek(): void {
    this.calendarBaseDate = subDays(this.calendarBaseDate, 7);
    this.generateCalendarData();
  }

  nextWeek(): void {
    this.calendarBaseDate = addDays(this.calendarBaseDate, 7);
    this.generateCalendarData();
  }

  todayClick(): number {
    if (isSameDay(this.today, this.dowList[this.active].date)) {
      return 1;
    }

    this.calendarBaseDate = startOfWeek(this.today, {
      weekStartsOn: 0,
    });
    this.generateCalendarData();
  }

  dateSelector(): void {
    // If calendarBaseDate is from this week
    if (isSameWeek(this.calendarBaseDate, this.today)) {
      // Dateclick today's date
      this.dateClick(format(this.today, 'eeee').toLowerCase());
    } else {
      this.dateClick('sunday');
    }
    this.fullDate = this.formatDate();
  }

  // On click, set active class to clicked element
  dateClick(string: string): void {
    this.active = string;
    this.fullDate = this.formatDate();
  }

  formatDate(): string {
    let formated = format(
      this.dowList[this.active]?.date,
      "EEEE, dd 'de' MMMM 'de' yyyy",
      {
        locale: ptBR,
      }
    );

    formated = formated.charAt(0).toUpperCase() + formated.slice(1);
    return formated;
  }

  generateCalendarData(): void {
    let i = 0;
    for (let dow in this.dowList) {
      this.dowList[dow].date = addDays(this.calendarBaseDate, i);
      i++;
    }
    this.dateSelector();
  }

  getDayFromDate(date: Date): number {
    return getDate(date);
  }

  // Set array depending on selected items
  filter() {}
}
