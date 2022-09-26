import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Timestamp } from '@firebase/firestore-types';
import { formatDate } from '@angular/common';
import { fromUnixTime, format, parseISO } from 'date-fns';
import { first } from 'rxjs';

import { MajorEventItem } from '../shared/services/major-event';
import { EventItem } from '../shared/services/event';

@Component({
  selector: 'app-page-subscription',
  templateUrl: 'page-subscription.page.html',
  styleUrls: ['page-subscription.page.scss'],
})
export class PageSubscriptionPage implements OnInit {
  console = console;
  today: Date = new Date();

  countMinicursos$: number = 0;
  countPalestras$: number = 0;

  qntdMinicursosChecked$: string = '00';
  qntdPalestrasChecked$: string = '00';

  majorEvent$: MajorEventItem;
  events$ = {};
  eventsSelected: EventItem[] = [];

  opSelected: string;

  constructor(public afs: AngularFirestore, public auth: AngularFireAuth, private router: Router) {
    const id = this.router.url.split('/')[3];
    this.events$ = {};

    this.afs
      .doc<MajorEventItem>(`majorEvents/${id}`)
      .valueChanges({ idField: 'id' })
      .pipe(first())
      .subscribe((item) => {
        this.majorEvent$ = item;
        item.events.forEach((eventId) => {
          this.afs
            .doc<EventItem>(`events/${eventId}`)
            .valueChanges({ idField: 'id' })
            .pipe(first())
            .subscribe((event) => this.formatAndSaveEvent(event));
        });
      });
  }

  ngOnInit() {}

  adjustNumber(num: number): string {
    return ('00' + num).slice(-2);
  }

  countCheckeds(e: any, event: any) {
    const { checked, name } = e.currentTarget;

    if (checked) this.eventsSelected.push(event);
    else this.eventsSelected = this.eventsSelected.filter(item => JSON.stringify(item) !== JSON.stringify(event));

    let countMinicursos = document.querySelectorAll('[name="minicurso"][value="on"]').length;
    let countPalestras = document.querySelectorAll('[name="palestra"][value="on"]').length;

    const current = checked ? 1 : -1;
    if (name === 'palestra') countPalestras += current;
    else countMinicursos += current;

    this.qntdMinicursosChecked$ = this.adjustNumber(countMinicursos);
    this.qntdPalestrasChecked$ = this.adjustNumber(countPalestras);
  }

  formatAndSaveEvent(event: EventItem) {
    event.time = this.getIntervalHours(event.eventStartDate, event.eventEndDate);
    const date = format(event.eventStartDate.toDate(), 'yyyy-MM-dd');

    if (this.events$[date]) this.events$[date].push(event);
    else this.events$[date] = [event];

    if (event.eventType === 'minicurso') this.countMinicursos$++;
    else this.countPalestras$++;
  }

  getIntervalHours(date1: Timestamp, date2: Timestamp): string {
    const hour1 = format(date1.toDate(), 'HH:mm');
    const hour2 = format(date2.toDate(), 'HH:mm');
    return `${hour1} às ${hour2}`;
  }

  formatDate(date: string): string {
    let formated = formatDate(parseISO(date), "EEEE, dd 'de' MMMM 'de' yyyy", 'pt-BR');

    formated = formated.charAt(0).toUpperCase() + formated.slice(1);
    return formated;
  }

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(parseInt(timestamp.seconds.toString()));
  }

  goToConfirmSubscription() {
    this.router.navigateByUrl('/eventos/confirmar-inscricao', {
      state: {
        eventsSelected: this.eventsSelected,
        majorEvent: this.majorEvent$,
        countMinicursos: this.countMinicursos$,
        countPalestras: this.countPalestras$,
        qntdMinicursosChecked: this.qntdMinicursosChecked$,
        qntdPalestrasChecked: this.qntdPalestrasChecked$,
        subscriptionTypeSelected: this.opSelected,
      },
    });
  }
}
