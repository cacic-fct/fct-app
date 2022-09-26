import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Router } from '@angular/router';
import { Timestamp } from '@firebase/firestore-types';
import { formatDate } from '@angular/common';
import { fromUnixTime, format, parseISO } from 'date-fns';

import { MajorEventItem } from '../../shared/services/major-event';
import { EventItem } from '../../shared/services/event';

@Component({
  selector: 'app-page-confirm-subscription',
  templateUrl: 'page-confirm-subscription.page.html',
  styleUrls: ['page-confirm-subscription.page.scss'],
})
export class PageConfirmSubscriptionPage implements OnInit {
  @ViewChild('successSwal') private successSwal: SwalComponent;
  @ViewChild('errorSwal') private errorSwal: SwalComponent;

  console = console;
  today: Date = new Date();

  events$ = {};
  majorEvent$: MajorEventItem;
  countMinicursos$: number;
  countPalestras$: number;
  qntdMinicursosChecked$: string;
  qntdPalestrasChecked$: string;
  subscriptionTypeSelected$: string;
  subscribedToEvents: string[] = [];

  constructor(public afs: AngularFirestore, public auth: AngularFireAuth, private router: Router) {
    const state = this.router.getCurrentNavigation().extras.state;

    this.majorEvent$ = state.majorEvent;
    this.countMinicursos$ = state.countMinicursos;
    this.countPalestras$ = state.countPalestras;
    this.qntdMinicursosChecked$ = state.qntdMinicursosChecked;
    this.qntdPalestrasChecked$ = state.qntdPalestrasChecked;
    this.subscriptionTypeSelected$ = state.subscriptionTypeSelected;

    state.eventsSelected.map((item: EventItem) => {
      const date = format(item.eventStartDate.toDate(), 'yyyy-MM-dd');
      if (this.events$[date]) this.events$[date].push(item);
      else this.events$[date] = [item];
      this.subscribedToEvents.push(item.id);
    });
  }

  ngOnInit() {}

  adjustNumber(num: number): string {
    return ('00' + num).slice(-2);
  }

  countCheckeds(e: any) {
    const { checked, name } = e.currentTarget;
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

  onSubmit() {
    this.auth.user.subscribe((user) => {
      try {
        this.afs
          .collection(`majorEvents/${this.majorEvent$.id}/subscriptions`)
          .doc(user.uid)
          .set({
            time: new Date(),
            payment: {
              status: 0,
              time: new Date(),
            },
            subscriptionType: Number(this.subscriptionTypeSelected$),
            subscribedToEvents: this.subscribedToEvents,
          });

        this.subscribedToEvents.map((eventId) => {
          this.afs.collection(`events/${eventId}/subscriptions`).doc(user.uid).set({
            time: new Date(),
          });

          this.afs
            .collection(`users/${user.uid}/subscriptions`)
            .doc(eventId)
            .set({
              reference: `events/${eventId}/subscriptions/${user.uid}`,
            });
        });

        this.afs
          .collection(`users/${user.uid}/subscriptions`)
          .doc(this.majorEvent$.id)
          .set({
            reference: `majorEvents/${this.majorEvent$.id}/subscriptions/${user.uid}`,
          });

        this.successSwal.fire();

        setTimeout(() => {
          this.successSwal.close();
          this.router.navigate(['/eventos'], { replaceUrl: true });
        }, 1500);
      } catch (error) {
        this.errorSwal.fire();
        console.error('Failed to write majorEvent to Firestore', error);
      }
    });
  }
}
