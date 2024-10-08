import { AsyncPipe, DatePipe, DecimalPipe, formatDate } from '@angular/common';
import { Component, Input, OnInit, WritableSignal, inject, signal } from '@angular/core';
import {
  IonItem,
  IonList,
  IonItemDivider,
  IonLabel,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonSpinner,
} from '@ionic/angular/standalone';
import { DateService } from 'src/app/shared/services/date.service';
import { EmojiService } from 'src/app/shared/services/emoji.service';
import { InfoModalComponent } from 'src/app/tabs/major-events-display/subscribe/info-modal/info-modal.component';

import { ModalController, ToastController } from '@ionic/angular/standalone';
import { EventItem } from 'src/app/shared/services/event';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { trace } from '@angular/fire/compat/performance';
import { MajorEventItem, MajorEventSubscription } from 'src/app/shared/services/major-event.service';
import { ClickStopPropagationDirective } from 'src/app/shared/directives/click-stop-propagation';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-event-list-form',
  templateUrl: './event-list-form.component.html',
  styleUrls: ['./event-list-form.component.scss'],
  standalone: true,
  imports: [
    ClickStopPropagationDirective,
    FormsModule,
    ReactiveFormsModule,
    InfoModalComponent,
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    IonSpinner,
    IonCheckbox,
    IonIcon,
    IonButton,
    IonLabel,
    IonItemDivider,
    IonList,
    IonItem,
  ],
})
export class EventListFormComponent implements OnInit {
  @Input({ required: true }) majorEvent$!: Observable<MajorEventItem>;
  @Input({ required: true }) majorEventID!: string;
  @Input({ required: true }) isAlreadySubscribed!: boolean | undefined;
  @Input({ required: true }) user$!: Observable<User | null>;
  @Input({ required: true }) maxCourses!: number | undefined;
  @Input({ required: true }) maxLectures!: number | undefined;
  @Input({ required: true }) events$!: Observable<EventItem[]>;
  @Input({ required: true }) mandatoryEvents!: string[];

  eventList: EventItem[] = [];
  isEventScheduleBeingChecked = false;
  today: Date = new Date();
  public dataForm: FormGroup;
  private firestore: Firestore = inject(Firestore);
  public readonly amountOfUncategorizedSelected: WritableSignal<number> = signal(0);
  public readonly amountOfCoursesSelected: WritableSignal<number> = signal(0);
  public readonly amountOfLecturesSelected: WritableSignal<number> = signal(0);
  public readonly totalAmountOfEventsSelected: WritableSignal<number> = signal(0);

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    public emojiService: EmojiService,
    public dateService: DateService,
    private formBuilder: FormBuilder,
  ) {
    addIcons({
      alertCircleOutline,
    });

    this.dataForm = this.formBuilder.group({});
  }

  ngOnInit() {
    // Do this every time the events change
    this.events$.pipe(untilDestroyed(this)).subscribe((events) => {
      this.eventList = events;
      events.forEach((event) => {
        if (event.id && !this.dataForm.contains(event.id)) {
          this.dataForm.addControl(event.id, this.formBuilder.control(null));
        }
      });
    });

    // Only do this once
    this.events$.pipe(take(1)).subscribe((events) => {
      this.autoSelectMandatory(this.mandatoryEvents);

      if (this.isAlreadySubscribed) {
        this.selectAlreadySubscribed();
      }

      events.forEach((eventItem) => {
        // If there are no slots available, disable event
        if (
          !eventItem.slotsAvailable ||
          eventItem.slotsAvailable <= 0 ||
          // Or if event has already started, disable it
          this.dateService.getDateFromTimestamp(eventItem.eventStartDate) < this.today
        ) {
          this.blockEventGroup([eventItem]);
        }
      });
    });
  }

  selectAlreadySubscribed() {
    // If user is already subscribed, auto select events
    this.user$.pipe(take(1), trace('auth')).subscribe((user) => {
      if (user) {
        const subscriptionDocRef = doc(this.firestore, `majorEvents/${this.majorEventID}/subscriptions/${user.uid}`);
        const subscriptionData = docData(subscriptionDocRef) as Observable<MajorEventSubscription>;

        subscriptionData.pipe(take(1)).subscribe((subscription) => {
          if (subscription) {
            subscription.subscribedToEvents.forEach((eventID) => {
              if (!this.dataForm.get(eventID)) {
                throw new Error(`Event ${eventID} is in the subscription but not present in the form`);
              }

              const event = this.eventList.find((event) => event.id === eventID);

              if (!event) {
                throw new Error(`Event ${eventID} is in the subscription but not present in the event list`);
              }

              if (this.mandatoryEvents.includes(eventID)) {
                // If event is mandatory, skip as it has already been selected on ngOnInit
                return;
              }

              this.dataForm.get(eventID)!.setValue(true);

              const conflicts = this.checkConflicts(eventID);
              this.blockEventGroup(conflicts);

              // If event is part of a group, but not the main event, don't count it
              if (event.eventGroup && event.eventGroup.mainEventID !== eventID) {
                return;
              }

              this.incrementAmountOfEventsSelected(event);
            });
          }
        });
      }
    });
  }

  incrementAmountOfEventsSelected(event: EventItem | string) {
    if (typeof event === 'string') {
      // ts-expect-error - Type will be checked below
      event = this.eventList.find((e) => e.id === event) || null;
    }

    if (!event) {
      return;
    }

    // ts-expect-error - Type was checked above
    switch (event.eventType) {
      case 'minicurso':
        console.debug('DEBUG: incrementAmountOfEventsSelected: Incrementing amount of courses selected');
        this.amountOfCoursesSelected.update((value) => value + 1);
        this.totalAmountOfEventsSelected.update((value) => value + 1);
        break;
      case 'palestra':
        console.debug('DEBUG: incrementAmountOfEventsSelected: Incrementing amount of lectures selected');
        this.amountOfLecturesSelected.update((value) => value + 1);
        this.totalAmountOfEventsSelected.update((value) => value + 1);
        break;
      default:
        console.debug('DEBUG: incrementAmountOfEventsSelected: Incrementing amount of uncategorized selected');
        this.amountOfUncategorizedSelected.update((value) => value + 1);
        this.totalAmountOfEventsSelected.update((value) => value + 1);
        break;
    }
  }

  decrementAmountOfEventsSelected(event: EventItem) {
    switch (event.eventType) {
      case 'minicurso':
        console.debug('DEBUG: decrementAmountOfEventsSelected: Decrementing amount of courses selected');
        this.amountOfCoursesSelected.update((value) => value - 1);
        this.totalAmountOfEventsSelected.update((value) => value - 1);
        break;
      case 'palestra':
        console.debug('DEBUG: decrementAmountOfEventsSelected: Decrementing amount of lectures selected');
        this.amountOfLecturesSelected.update((value) => value - 1);
        this.totalAmountOfEventsSelected.update((value) => value - 1);
        break;
      default:
        console.debug('DEBUG: decrementAmountOfEventsSelected: Decrementing amount of uncategorized selected');
        this.amountOfUncategorizedSelected.update((value) => value - 1);
        this.totalAmountOfEventsSelected.update((value) => value - 1);
        break;
    }
  }

  autoSelectMandatory(mandatoryList: string[]) {
    if (mandatoryList.length === 0) {
      console.debug('DEBUG: autoSelectMandatory: No events are mandatory');
      return;
    }

    mandatoryList.forEach((eventId) => {
      if (!this.dataForm.get(eventId)) {
        throw new Error(`Event ${eventId} is mandatory but not present in the form`);
      }
      console.debug('DEBUG: autoSelectMandatory: Event is mandatory:', eventId);
      const conflicts = this.checkConflicts(eventId);

      if (conflicts.length > 0) {
        console.debug('DEBUG: autoSelectMandatory: Event', eventId, 'conflicts:', conflicts);
      }

      this.blockEventGroup(conflicts);
      this.incrementAmountOfEventsSelected(eventId);

      this.dataForm.get(eventId)!.setValue(true);
      this.dataForm.get(eventId)!.disable();
    });
  }

  async showEventInfo(event: EventItem) {
    const modal = await this.modalController.create({
      component: InfoModalComponent,
      componentProps: {
        event: event,
      },
      showBackdrop: true,
    });
    await modal.present();
  }

  selectFromGroup(event: EventItem, startedBy: string) {
    console.debug('DEBUG: selectFromGroup():', event, 'started by', startedBy);
    if (!event.id) {
      return;
    }

    // If there are no slots available, disable event
    // TODO: should enable again if more slots become available, but should also check for conflicts
    if (
      !event.slotsAvailable ||
      event.slotsAvailable <= 0 ||
      // Or if event has already started, disable it
      this.dateService.getDateFromTimestamp(event.eventStartDate) < this.today
    ) {
      this.blockEventGroup([event]);
      return;
    }

    // If event has been selected
    if (this.dataForm.get(event.id)?.value) {
      // If max amount of courses has been selected, unselect event
      if (
        this.maxCourses !== undefined &&
        this.maxCourses !== null &&
        event.eventType === 'minicurso' &&
        this.amountOfCoursesSelected() >= this.maxCourses
      ) {
        this.dataForm.get(event.id)?.setValue(false);
        this.presentLimitReachedToast('minicursos', this.maxCourses.toString());
        return;
      } else if (
        this.maxLectures !== undefined &&
        this.maxLectures !== null &&
        event.eventType === 'palestra' &&
        this.amountOfLecturesSelected() >= this.maxLectures
      ) {
        this.presentLimitReachedToast('palestras', this.maxLectures.toString());
        this.dataForm.get(event.id)?.setValue(false);
        return;
      }

      const conflicts = this.checkConflicts(event.id);
      this.blockEventGroup(conflicts);

      // Select other events from the same group
      if (event.eventGroup?.groupEventIDs) {
        event.eventGroup.groupEventIDs.forEach((eventFromGroup) => {
          if (eventFromGroup === event.id) {
            this.incrementAmountOfEventsSelected(event);
            return;
          }
          this.dataForm.get(eventFromGroup)?.setValue(true);

          const conflicts = this.checkConflicts(eventFromGroup);
          this.blockEventGroup(conflicts);
        });
      } else {
        this.incrementAmountOfEventsSelected(event);
      }
      // If event has been unselected
    } else {
      const conflicts = this.checkConflicts(event.id);
      this.unblockEventGroup(conflicts);

      // Unselect other events from the same group
      if (event.eventGroup?.groupEventIDs) {
        event.eventGroup.groupEventIDs.forEach((eventFromGroup) => {
          if (eventFromGroup === event.id) {
            this.decrementAmountOfEventsSelected(event);
            return;
          }

          this.dataForm.get(eventFromGroup)?.setValue(false);

          const conflicts = this.checkConflicts(eventFromGroup);
          this.unblockEventGroup(conflicts);
        });
      } else {
        this.decrementAmountOfEventsSelected(event);
      }
    }
  }

  checkConflicts(selectedEventId: string): EventItem[] {
    const selectedEvent = this.eventList.find((event) => event.id === selectedEventId);
    const conflicts: EventItem[] = [];

    if (selectedEvent) {
      this.eventList.forEach((event) => {
        if (this.isConflict(selectedEvent, event)) {
          console.debug('DEBUG: Conflict found:', selectedEvent.name, 'with', event.name);
          conflicts.push(event);
        }
      });
    }
    return conflicts;
  }

  blockEventGroup(conflicts: EventItem[]) {
    conflicts.forEach((conflict) => {
      if (conflict.eventGroup?.groupEventIDs) {
        conflict.eventGroup.groupEventIDs.forEach((eventFromGroup) => {
          this.dataForm.get(eventFromGroup)?.disable();
          this.dataForm.get(eventFromGroup)?.setValue(false);
        });
      } else {
        if (conflict.id) {
          this.dataForm.get(conflict.id)?.disable();
          this.dataForm.get(conflict.id)?.setValue(false);
        }
      }
    });
  }

  unblockEventGroup(conflicts: EventItem[]) {
    conflicts.forEach((conflict) => {
      if (conflict.eventGroup?.groupEventIDs) {
        conflict.eventGroup.groupEventIDs.forEach((eventFromGroup) => {
          this.dataForm.get(eventFromGroup)?.enable();
        });
      } else {
        if (conflict.id) {
          this.dataForm.get(conflict.id)?.enable();
        }
      }
    });
  }

  isConflict(event1: EventItem, event2: EventItem): boolean {
    const event1StartDate = this.dateService.getDateFromTimestamp(event1.eventStartDate);
    const event2StartDate = this.dateService.getDateFromTimestamp(event2.eventStartDate);

    // If event doesn't have end date, consider it the same as start date
    let event1EndDate = event1StartDate;
    let event2EndDate = event2StartDate;

    if (event1.eventEndDate && event2.eventEndDate) {
      event1EndDate = this.dateService.getDateFromTimestamp(event1.eventEndDate);
      event2EndDate = this.dateService.getDateFromTimestamp(event2.eventEndDate);
    }

    return (
      event1.id !== event2.id &&
      ((event1StartDate <= event2EndDate && event1EndDate >= event2StartDate) ||
        (event2StartDate <= event1EndDate && event2EndDate >= event1StartDate))
    );
  }

  formatDate(date: Date): string {
    let formated = formatDate(date, "EEEE, dd 'de' MMMM 'de' yyyy", 'pt-BR');

    formated = formated.charAt(0).toUpperCase() + formated.slice(1);
    return formated;
  }

  /**
   * If item was clicked, do the same as if the checkbox was clicked
   * @param eventItem
   * @returns
   */
  itemClick(eventItem: EventItem): void {
    const eventID = eventItem.id;
    if (!eventID) {
      return;
    }
    const formEvent = this.dataForm.get(eventID);
    console.debug('DEBUG: itemClick():', eventItem);

    if (!formEvent || formEvent?.disabled) {
      this.presentDisabledToast(eventID);
      return;
    }

    formEvent.setValue(!formEvent.value);

    this.selectFromGroup(eventItem, 'itemClick');
  }

  async presentLimitReachedToast(type: string, max: string) {
    const toast = await this.toastController.create({
      header: `Limite atingido`,
      message: `Você pode escolher até ${max} ${type}`,
      icon: 'alert-circle-outline',
      position: 'bottom',
      duration: 5000,
      buttons: [
        {
          side: 'end',
          text: 'OK',
          role: 'cancel',
        },
      ],
    });

    toast.present();
  }

  async presentDisabledToast(eventID: string) {
    let header = `Evento indisponível`;
    let message = `Confira o número de vagas ou se há choque de horário`;

    if (this.mandatoryEvents.includes(eventID)) {
      header = `Evento obrigatório`;
      message = `Você não pode desmarcar este evento`;
    }

    const toast = await this.toastController.create({
      header: header,
      message: message,
      icon: 'alert-circle-outline',
      position: 'bottom',
      duration: 2000,
      buttons: [
        {
          side: 'end',
          text: 'OK',
          role: 'cancel',
        },
      ],
    });

    toast.present();
  }
}
