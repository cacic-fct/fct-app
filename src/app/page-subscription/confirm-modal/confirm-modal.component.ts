import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Router } from '@angular/router';
import { Timestamp } from '@firebase/firestore-types';
import { formatDate } from '@angular/common';
import { fromUnixTime, format, parseISO } from 'date-fns';

import { MajorEventItem } from '../../shared/services/major-event';
import { EventItem } from '../../shared/services/event';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {
  @Input() majorEvent$: Observable<MajorEventItem>;
  @Input() eventsSelected: string[];
  @Input() minicursosCount: number;
  @Input() palestrasCount: number;
  @Input() subscriptionType: string;

  @ViewChild('successSwal') private successSwal: SwalComponent;
  @ViewChild('errorSwal') private errorSwal: SwalComponent;

  console = console;
  today: Date = new Date();

  events$ = {};

  countMinicursos$: number;
  countPalestras$: number;
  qntdMinicursosChecked$: string;
  qntdPalestrasChecked$: string;
  subscriptionTypeSelected$: string;
  subscribedToEvents: string[] = [];

  constructor(public afs: AngularFirestore, public auth: AngularFireAuth, private modalController: ModalController) {}

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
    this.modalController.dismiss(true);
  }

  closeModal() {
    this.modalController.dismiss(false);
  }
}
