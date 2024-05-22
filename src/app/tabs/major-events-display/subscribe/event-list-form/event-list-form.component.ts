import { AsyncPipe, DatePipe, DecimalPipe, formatDate } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
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

import { ModalController } from '@ionic/angular/standalone';
import { EventItem } from 'src/app/shared/services/event';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, take } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { trace } from '@angular/fire/compat/performance';
import { MajorEventSubscription } from 'src/app/shared/services/major-event.service';

@Component({
  selector: 'app-event-list-form',
  templateUrl: './event-list-form.component.html',
  styleUrls: ['./event-list-form.component.scss'],
  standalone: true,
  imports: [
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
  @Input({ required: true }) majorEventID!: string;
  @Input({ required: true }) isAlreadySubscribed!: boolean;
  @Input({ required: true }) user$!: Observable<User>;

  events$: Observable<EventItem[]>;
  eventList: EventItem[] = [];
  isEventScheduleBeingChecked: boolean = false;
  dataForm: FormGroup;

  private firestore: Firestore = inject(Firestore);

  constructor(
    private modalController: ModalController,
    public emojiService: EmojiService,
    public dateService: DateService,
    private formBuilder: FormBuilder,
  ) {
    this.dataForm = this.formBuilder.group({});

    const eventsCollection = collection(this.firestore, `events`);

    const eventsCollection$ = collectionData(eventsCollection, { idField: 'id' }) as Observable<EventItem[]>;

    this.events$ = eventsCollection$.pipe(
      map((events: EventItem[]) => {
        return events.map((eventItem) => {
          this.eventList.push(eventItem);

          // If there are no slots available, add event to form with disabled selection
          if (
            !eventItem.slotsAvailable ||
            eventItem.slotsAvailable <= 0 ||
            // If event has already started, disable it
            this.dateService.getDateFromTimestamp(eventItem.eventStartDate) < this.today
          ) {
            this.dataForm.addControl(eventItem.id!, this.formBuilder.control({ value: null, disabled: true }));
          } else {
            this.dataForm.addControl(eventItem.id!, this.formBuilder.control(null));
          }

          // Autoselects and disables palestras
          // Used during SECOMPP when palestras are mandatory
          if (eventItem.eventType === 'palestra') {
            this.dataForm.get(eventItem.id!)?.setValue(true);
            this.dataForm.get(eventItem.id!)?.disable();
          }

          if (this.isAlreadySubscribed) {
            this.selectAlreadySubscribed();
          }
          return eventItem;
        });
      }),
    );
  }

  selectAlreadySubscribed() {
    // If user is already subscribed, auto select event
    this.user$.pipe(take(1), trace('auth')).subscribe((user) => {
      if (user) {
        const subscriptionDocRef = doc(this.firestore, `majorEvents/${this.majorEventID}/subscriptions/${user.uid}`);
        const subscriptionData = docData(subscriptionDocRef) as Observable<MajorEventSubscription>;

        subscriptionData.pipe(take(1)).subscribe((subscription) => {
          if (subscription) {
            subscription.subscribedToEvents.forEach((eventID) => {
              this.dataForm.get(eventID)?.setValue(true);
            });
          }
        });
      }
    });
  }

  ngOnInit() {}

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

  selectFromGroup(event: EventItem) {
    if (!event.id) {
      return;
    }

    // If event has been selected
    if (this.dataForm.get(event.id)?.value) {
      // Select other events from the same group
      if (event.eventGroup?.groupEventIDs) {
        event.eventGroup.groupEventIDs.forEach((eventFromGroup) => {
          if (eventFromGroup === event.id) {
            return;
          }
          this.dataForm.get(eventFromGroup)?.setValue(true);
        });
      }
    } else {
      // Unselect other events from the same group
      if (event.eventGroup?.groupEventIDs) {
        event.eventGroup.groupEventIDs.forEach((eventFromGroup) => {
          if (eventFromGroup === event.id) {
            return;
          }
          this.dataForm.get(eventFromGroup)?.setValue(false);
        });
      }
    }
  }

  formatDate(date: Date): string {
    let formated = formatDate(date, "EEEE, dd 'de' MMMM 'de' yyyy", 'pt-BR');

    formated = formated.charAt(0).toUpperCase() + formated.slice(1);
    return formated;
  }

  // pushEvent(eventFromGroup: string) {
  //   const eventItem = this.eventSchedule.find((event) => event.id === eventFromGroup);
  //   // Check if event is already in array
  //   if (this.eventsSelected[eventItem.eventType].some((e) => e.id === eventItem.id)) {
  //     return;
  //   }
  //   this.eventsSelected[eventItem.eventType].push(eventItem);
  // }

  // filterEvent(eventFromGroup: string) {
  //   const eventItem = this.eventSchedule.find((event) => event.id === eventFromGroup);
  //   this.eventsSelected[eventItem.eventType] = this.eventsSelected[eventItem.eventType].filter(
  //     (event) => event.id !== eventItem.id,
  //   );
  // }

  countCheckeds(e: any, event: EventItem) {
    const checked: boolean = e.currentTarget.checked;
    const name: string = e.currentTarget.name;

    if (checked) {
      // TODO: Não funciona mais em grupo de eventos por conta da alteração do Ionic
      if (event.slotsAvailable <= 0) {
        this.dataForm.get(event.id).setValue(false);
        this.filterEvent(event.id);
        this.dataForm.get(event.id).disable();
        return;
      }

      switch (name) {
        case 'minicurso':
          if (this.eventsSelected['minicurso'].length - this.eventGroupMinicursoCount < this.maxCourses) {
            this.eventsSelected['minicurso'].push(event);
          } else {
            this.dataForm.get(event.id).setValue(false);
            this.presentLimitReachedToast('minicursos', this.maxCourses.toString());
            return;
          }

          if (event.eventGroup?.groupEventIDs) {
            event.eventGroup.groupEventIDs.forEach((eventFromGroup) => {
              if (eventFromGroup === event.id) {
                return;
              }

              this.eventGroupMinicursoCount++;
              this.dataForm.get(eventFromGroup).setValue(true);
              this.pushEvent(eventFromGroup);
            });
          }

          return;

        case 'palestra':
          if (this.eventsSelected['palestra'].length < this.maxLectures) {
            this.eventsSelected['palestra'].push(event);
          } else {
            this.dataForm.get(event.id).setValue(false);
            this.presentLimitReachedToast('palestras', this.maxLectures.toString());
          }
          return;

        default:
          if (!(name in this.eventsSelected)) {
            this.eventsSelected[name] = [];
          }

          this.eventsSelected[name].push(event);
          return;
      }
    } else {
      if (this.eventsSelected[name].some((e) => e.id === event.id)) {
        switch (name) {
          case 'minicurso':
            this.eventsSelected['minicurso'] = this.eventsSelected['minicurso'].filter((e) => e.id !== event.id);

            if (event.eventGroup?.groupEventIDs) {
              event.eventGroup.groupEventIDs.forEach((eventFromGroup) => {
                if (eventFromGroup === event.id) {
                  return;
                }

                this.eventGroupMinicursoCount--;
                this.dataForm.get(eventFromGroup).setValue(false);
                this.filterEvent(eventFromGroup);
              });
            }
            return;

          default:
            this.eventsSelected[name] = this.eventsSelected[name].filter((e) => e.id !== event.id);
            return;
        }
      }
    }
  }

  checkForScheduleConflict(e, eventItem: EventItem) {
    if (this.isEventScheduleBeingChecked) {
      return;
    }

    this.isEventScheduleBeingChecked = true;
    // This doesn't unselect the event if it's already selected, it only disables it

    const checked: boolean = e.currentTarget.checked;

    const eventIndex = this.eventList.findIndex((e) => e.id === eventItem.id);

    const eventItemStartDate = this.dateService.getDateFromTimestamp(eventItem.eventStartDate);
    const eventItemEndDate = this.dateService.getDateFromTimestamp(eventItem.eventEndDate);

    if (checked) {
      // For every event after eventIndex
      for (let i = eventIndex + 1; i < this.eventList.length; i++) {
        const eventIterationStartDate = this.dateService.getDateFromTimestamp(this.eventList[i].eventStartDate);
        const eventIterationEndDate = this.dateService.getDateFromTimestamp(this.eventList[i].eventEndDate);
        // If event doesn't overlap or if it's itself, break
        if (
          eventItemStartDate >= eventIterationEndDate ||
          eventItemEndDate <= eventIterationStartDate ||
          eventItem.id === this.eventList[i].id
        ) {
          break;
        }
        // If event overlaps, disable it

        if (this.eventList[i].eventGroup?.groupEventIDs) {
          this.eventList[i].eventGroup?.groupEventIDs.forEach((event) => {
            this.dataForm.get(event).disable();
          });
        } else {
          this.dataForm.get(this.eventList[i].id).disable();
          this.dataForm.get(this.eventList[i].id).setValue(null);
        }
      }

      // For every event before eventIdex
      for (let i = eventIndex - 1; i >= 0; i--) {
        const eventIterationStartDate = this.dateService.getDateFromTimestamp(this.eventList[i].eventStartDate);
        const eventIterationEndDate = this.dateService.getDateFromTimestamp(this.eventList[i].eventEndDate);

        // If event doesn't overlap or if it's itself, break
        if (
          eventItemStartDate >= eventIterationEndDate ||
          eventItemEndDate <= eventIterationStartDate ||
          eventItem.id === this.eventList[i].id
        ) {
          break;
        }

        // If event overlaps, disable it

        if (this.eventList[i].eventGroup?.groupEventIDs) {
          this.eventList[i].eventGroup.groupEventIDs.forEach((event) => {
            this.dataForm.get(event).disable();
          });
        } else {
          this.dataForm.get(this.eventList[i].id).disable();
          this.dataForm.get(this.eventList[i].id).setValue(null);
        }
      }
    } else {
      // For every event after eventIndex
      for (let i = eventIndex + 1; i < this.eventList.length; i++) {
        const eventIterationStartDate = this.dateService.getDateFromTimestamp(this.eventList[i].eventStartDate);

        // If event doesn't overlap, break
        if (eventIterationStartDate >= eventItemEndDate) {
          break;
        }

        // If event overlaps, enable it

        /* Keeps event disabled if it's a palestra.
                 Used during SECOMPP22 where palestras were mandatory*/
        if (this.eventList[i].eventType !== 'palestra') {
          if (this.eventList[i].slotsAvailable > 0) {
            if (this.eventList[i].eventGroup?.groupEventIDs) {
              this.eventList[i].eventGroup.groupEventIDs.forEach((event) => {
                this.dataForm.get(event).enable();
              });
            } else {
              this.dataForm.get(this.eventList[i].id).enable();
            }
          }
        }
      }

      // For every event before eventIdex
      for (let i = eventIndex - 1; i >= 0; i--) {
        const eventIterationEndDate = this.dateService.getDateFromTimestamp(this.eventList[i].eventEndDate);

        // If event doesn't overlap, break
        if (eventIterationEndDate <= eventItemStartDate) {
          break;
        }

        // If event overlaps, enable it

        if (this.eventList[i].eventType !== 'palestra') {
          if (this.eventList[i].eventGroup?.groupEventIDs) {
            this.eventList[i].eventGroup.groupEventIDs.forEach((event) => {
              this.dataForm.get(event).enable();
            });
          } else {
            this.dataForm.get(this.eventList[i].id).enable();
          }
        }
      }
    }
    this.isEventScheduleBeingChecked = false;
  }
}
