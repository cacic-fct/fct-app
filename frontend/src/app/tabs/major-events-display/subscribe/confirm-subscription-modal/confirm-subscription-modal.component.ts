import { Component, Input, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, formatDate } from '@angular/common';

import { MajorEventItem } from '../../../../shared/services/major-event.service';
import { EventItem } from '../../../../shared/services/event';
import { ModalController } from '@ionic/angular/standalone';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { EnrollmentTypesService } from 'src/app/shared/services/enrollment-types.service';

import { EmojiService } from '../../../../shared/services/emoji.service';
import { DateService } from 'src/app/shared/services/date.service';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonCardHeader,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonItemDivider,
  IonProgressBar,
  IonList,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { MajorEventInfoSubscriptionComponent } from 'src/app/tabs/major-events-display/subscribe/major-event-info-subscription/major-event-info-subscription.component';

@Component({
  selector: 'app-confirm-subscription-modal',
  templateUrl: './confirm-subscription-modal.component.html',
  styleUrls: ['./confirm-subscription-modal.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonCardHeader,
    IonCardContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonItemDivider,
    IonProgressBar,
    IonList,
    IonCardTitle,
    SweetAlert2Module,
    AsyncPipe,
    CurrencyPipe,
    DecimalPipe,
    DatePipe,
    MajorEventInfoSubscriptionComponent,
  ],
})
export class ConfirmModalComponent {
  @Input() majorEvent$!: Observable<MajorEventItem>;
  @Input() eventsSelected!: string[];
  @Input() minicursosCount!: number;
  @Input() palestrasCount!: number;
  @Input() subscriptionType!: string;
  @Input() events$!: Observable<EventItem[]>;

  displayEvents$: Observable<EventItem[]>;

  private eventsSelected$ = new BehaviorSubject<string[]>(this.eventsSelected);

  firestore = inject(Firestore);

  constructor(
    private modalController: ModalController,
    public enrollmentTypes: EnrollmentTypesService,
    public emojiService: EmojiService,
    public dateService: DateService
  ) {
    // Check if developer forgot to pass required inputs
    if (this.majorEvent$ === undefined) {
      throw new Error('majorEvent$ is required');
    } else if (this.eventsSelected === undefined) {
      throw new Error('eventsSelected is required');
    } else if (this.minicursosCount === undefined) {
      throw new Error('minicursosCount is required');
    } else if (this.palestrasCount === undefined) {
      throw new Error('palestrasCount is required');
    } else if (this.subscriptionType === undefined) {
      throw new Error('subscriptionType is required');
    } else if (this.events$ === undefined) {
      throw new Error('events$ is required');
    }

    this.displayEvents$ = combineLatest([this.events$, this.eventsSelected$]).pipe(
      map(([events, selectedIds]) => {
        return events.filter((event) => selectedIds.includes(event.id!));
      })
    );
  }

  formatDate(date: Date): string {
    let formated = formatDate(date, "EEEE, dd 'de' MMMM 'de' yyyy", 'pt-BR');

    formated = formated.charAt(0).toUpperCase() + formated.slice(1);
    return formated;
  }

  onSubmit() {
    this.modalController.dismiss(true);
  }

  closeModal() {
    this.modalController.dismiss(false);
  }
}
