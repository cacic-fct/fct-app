import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@firebase/firestore-types';
import { formatDate } from '@angular/common';
import { fromUnixTime, isSameDay } from 'date-fns';

import { MajorEventItem } from '../../shared/services/major-event';
import { EventItem } from '../../shared/services/event';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { EnrollmentTypesService } from 'src/app/shared/services/enrollment-types.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {
  @Input() majorEvent$: Observable<MajorEventItem>;
  @Input() eventsSelected: EventItem[];
  @Input() minicursosCount: number;
  @Input() palestrasCount: number;
  @Input() subscriptionType: string;

  constructor(
    public afs: AngularFirestore,
    public auth: AngularFireAuth,
    private modalController: ModalController,
    public enrollmentTypes: EnrollmentTypesService
  ) {}

  ngOnInit() {}

  formatDate(date: Date): string {
    let formated = formatDate(date, "EEEE, dd 'de' MMMM 'de' yyyy", 'pt-BR');

    formated = formated.charAt(0).toUpperCase() + formated.slice(1);
    return formated;
  }

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }

  onSubmit() {
    this.modalController.dismiss(true);
  }

  closeModal() {
    this.modalController.dismiss(false);
  }

  dayCompare(date1: Timestamp, date2: Timestamp): boolean {
    return isSameDay(fromUnixTime(date1.seconds), fromUnixTime(date2.seconds));
  }
}
