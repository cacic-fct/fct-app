// @ts-strict-ignore
import { GlobalConstantsService } from 'src/app/shared/services/global-constants.service';
import { User } from 'src/app/shared/services/user';
import { MajorEventSubscription } from 'src/app/shared/services/major-event.service';
import { EnrollmentTypesService } from 'src/app/shared/services/enrollment-types.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { compareAsc } from 'date-fns';
import { take, map, Observable, switchMap, of } from 'rxjs';

import { MajorEventItem } from 'src/app/shared/services/major-event.service';
import { EventItem } from 'src/app/shared/services/event';
import { ModalController, ToastController } from '@ionic/angular/standalone';

import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { trace } from '@angular/fire/compat/performance';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Firestore, doc, docData, serverTimestamp } from '@angular/fire/firestore';
import { EmojiService } from 'src/app/shared/services/emoji.service';
import { DateService } from 'src/app/shared/services/date.service';
import { Auth, user, User as FirebaseUser } from '@angular/fire/auth';

import {
  IonHeader,
  IonCardContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonIcon,
  IonLabel,
  IonText,
  IonItemDivider,
  IonCheckbox,
  IonProgressBar,
  IonFab,
  IonFabButton,
  IonButton,
  IonSpinner,
  IonSelectOption,
  IonList,
} from '@ionic/angular/standalone';
import { MajorEventInfoSubscriptionComponent } from 'src/app/tabs/major-events-display/subscribe/major-event-info-subscription/major-event-info-subscription.component';
import { EventListFormComponent } from 'src/app/tabs/major-events-display/subscribe/event-list-form/event-list-form.component';

@UntilDestroy()
@Component({
  selector: 'app-subscribe',
  templateUrl: 'subscribe.page.html',
  styleUrls: ['subscribe.page.scss'],
  standalone: true,
  imports: [
    EventListFormComponent,
    MajorEventInfoSubscriptionComponent,
    IonHeader,
    IonCardContent,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonIcon,
    IonLabel,
    IonText,
    IonItemDivider,
    IonCheckbox,
    IonProgressBar,
    IonFab,
    IonFabButton,
    IonButton,
    IonSpinner,
    IonList,
    IonSelectOption,
    ReactiveFormsModule,
    SweetAlert2Module,
    CurrencyPipe,
    AsyncPipe,
    DecimalPipe,
    DatePipe,
    FormsModule,
  ],
})
export class SubscribePage implements OnInit {
  @ViewChild('successSwal')
  private successSwal: SwalComponent;
  @ViewChild('errorSwal')
  private errorSwal: SwalComponent;
  @ViewChild('maxChanged')
  private maxChanged: SwalComponent;
  @ViewChild('alreadySubscribed')
  private alreadySubscribed: SwalComponent;
  @ViewChild('eventNotFound')
  private eventNotFound: SwalComponent;
  @ViewChild('eventOutOfSubscriptionDate')
  private eventOutOfSubscriptionDate: SwalComponent;

  @ViewChild('formComponent')
  private formComponent: EventListFormComponent;

  private auth: Auth = inject(Auth);
  user$: Observable<FirebaseUser> = user(this.auth);

  today: Date = new Date();

  majorEvent$: Observable<MajorEventItem>;

  maxCourses: number;
  maxLectures: number;

  eventsSelected: { [key: string]: EventItem[] } = {
    minicurso: [],
    palestra: [],
  };

  eventGroupMinicursoCount: number = 0;

  opSelected: string;

  paymentStatus: number;

  majorEventID: string;

  isAlreadySubscribed: boolean | undefined;

  private firestore: Firestore = inject(Firestore);

  constructor(
    private route: ActivatedRoute,
    public afs: AngularFirestore,
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController,
    public enrollmentTypes: EnrollmentTypesService,

    public emojiService: EmojiService,
    public dateService: DateService,
  ) {
    this.majorEventID = this.route.snapshot.params['eventID'];

    this.user$
      .pipe(
        take(1),
        switchMap((user) => {
          if (user) {
            const subscriptionDocRef = doc(
              this.firestore,
              `majorEvents/${this.majorEventID}/subscriptions/${user.uid}`,
            );
            return docData(subscriptionDocRef) as Observable<MajorEventSubscription>;
          } else {
            return of(null);
          }
        }),
      )
      .subscribe((subscription) => {
        if (subscription) {
          this.isAlreadySubscribed = true;
        }
      });
  }

  ngOnInit() {
    this.afs
      .collection('majorEvents')
      .doc(this.majorEventID)
      .get()
      .pipe(untilDestroyed(this), trace('firestore'))
      .subscribe((document) => {
        // If majorEventID is not valid, redirect
        if (!document.exists) {
          this.eventNotFound.fire();
          setTimeout(() => {
            this.router.navigate(['eventos']);
            this.eventNotFound.close();
          }, 1000);
        } else {
          // If majorEventID is valid, check if subscriptions are open
          const majorEvent = document.data() as MajorEventItem;
          if (this.dateService.getDateFromTimestamp(majorEvent.eventEndDate) < this.today) {
            this.router.navigate(['eventos']);

            this.eventOutOfSubscriptionDate.fire();
            setTimeout(() => {
              this.router.navigate(['eventos']);
              this.eventOutOfSubscriptionDate.close();
            }, 1000);
          }
        }
      });

    // Check if user has receipt validated
    // If they have, they can't edit their subscription
    this.user$.pipe(take(1), trace('auth')).subscribe((user) => {
      if (user) {
        this.afs
          .doc<MajorEventSubscription>(`majorEvents/${this.majorEventID}/subscriptions/${user.uid}`)
          .valueChanges({ idField: 'id' })
          .pipe(take(1), trace('firestore'))
          .subscribe((subscription) => {
            if (subscription?.payment) {
              if (subscription.payment.status === 2) {
                this.alreadySubscribed.fire();
                this.router.navigate(['/eventos'], { replaceUrl: true });

                setTimeout(() => {
                  this.alreadySubscribed.close();
                }, 1000);
              } else {
                this.paymentStatus = subscription.payment.status;

                if (subscription.subscriptionType) {
                  this.opSelected = subscription.subscriptionType.toString();
                }
              }
            }
          });
      }
    });

    this.majorEvent$ = this.afs
      .doc<MajorEventItem>(`majorEvents/${this.majorEventID}`)
      .valueChanges({ idField: 'id' })
      .pipe(trace('firestore'));

    this.majorEvent$.pipe(untilDestroyed(this)).subscribe((majorEvent) => {
      if (this.maxCourses && this.maxCourses !== majorEvent.maxCourses) {
        this.maxChanged.fire();
        this.router.navigateByUrl('/eventos/inscricao', { skipLocationChange: true }).then(() => {
          this.router.navigate([`/eventos/inscricao/${this.majorEventID}`]);
        });
      }

      if (this.maxLectures && this.maxLectures !== majorEvent.maxLectures) {
        this.maxChanged.fire();
        this.router.navigateByUrl('/eventos/inscricao', { skipLocationChange: true }).then(() => {
          this.router.navigate([`/eventos/inscricao/${this.majorEventID}`]);
        });
      }

      this.maxCourses = majorEvent.maxCourses;
      this.maxLectures = majorEvent.maxLectures;
    });
  }

  goToConfirmSubscription() {
    this.router.navigateByUrl('/eventos/confirmar-inscricao', {
      state: {
        eventsSelected: this.eventsSelected,
        majorEvent: this.majorEvent$,
      },
    });
  }

  async presentSelectSubscriptionToast() {
    const toast = await this.toastController.create({
      header: `Selecione o tipo de inscrição`,
      message: `No início da página, logo abaixo das informações do evento.`,
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

  onSubmit() {
    const dataForm = this.formComponent.dataForm;
    const amountOfEventsSelected = this.formComponent.totalAmountOfEventsSelected;

    if (amountOfEventsSelected === 0) {
      return;
    }

    this.majorEvent$.pipe(take(1)).subscribe((majorEvent) => {
      this.openConfirmModal().then((response) => {
        if (!response) {
          return;
        }

        let price: number;
        if (majorEvent.price.single) {
          this.opSelected = 'single';
        } else {
          if (this.opSelected === undefined) {
            return;
          }
        }

        switch (this.opSelected) {
          case '0':
            price = majorEvent.price.students;
            break;
          case '1':
            price = majorEvent.price.otherStudents;
            break;
          case '2':
            price = majorEvent.price.professors;
            break;
          case 'single':
            price = majorEvent.price.single;
            break;
          default:
            return;
        }

        this.user$.pipe(take(1)).subscribe((user) => {
          if (user) {
            this.afs
              .doc<Subscription>(`users/${user.uid}/majorEventSubscriptions/${this.majorEventID}`)
              .valueChanges({ idField: 'id' })
              .pipe(take(1), trace('firestore'))
              .subscribe((subscription) => {
                if (this.paymentStatus !== 2) {
                  // Merge eventsSelected arrays
                  const eventsSelected = Object.values(this.eventsSelected).reduce((acc, val) => acc.concat(val), []);

                  // Create array with event IDs from eventsSelected
                  const eventsSelectedID = eventsSelected.map((event) => event.id);

                  let status: number = 0;

                  if (this.paymentStatus !== undefined) {
                    switch (this.paymentStatus) {
                      case 1:
                        // User already sent payment proof, keep status as "pending verification"
                        status = 1;
                        break;
                      case 3:
                        // User had payment proof denied, keep status as "pending resending proof"
                        status = 3;
                        break;
                      case 4:
                      case 5:
                        // If user has already paid,
                        // but subscription was denied due to insufficient slots or schedule conflict,
                        // set status to "pending verification"
                        status = 1;
                        break;
                      case null:
                        status = null;
                        break;
                      default:
                        status = 0;
                        break;
                    }
                  }

                  let subscriptionType: number = Number.parseInt(this.opSelected);

                  if (isNaN(subscriptionType)) {
                    subscriptionType = null;
                  }

                  this.afs
                    .collection(`majorEvents/${this.majorEventID}/subscriptions`)
                    .doc<MajorEventSubscription>(user.uid)
                    .get()
                    .subscribe((doc) => {
                      if (status === 0) {
                        this.afs
                          .collection(`majorEvents/${this.majorEventID}/subscriptions`)
                          .doc<MajorEventSubscription>(user.uid)
                          .set({
                            subscriptionType: subscriptionType,
                            subscribedToEvents: eventsSelectedID,
                            // @ts-ignore
                            time: serverTimestamp(),
                            payment: {
                              price: price,
                              status: status,
                              // @ts-ignore
                              time: serverTimestamp(),
                              author: user.uid,
                            },
                          });
                      } else {
                        this.afs
                          .collection(`majorEvents/${this.majorEventID}/subscriptions`)
                          .doc<MajorEventSubscription>(user.uid)
                          .update({
                            subscriptionType: subscriptionType,
                            subscribedToEvents: eventsSelectedID,
                            payment: {
                              price: price,
                              status: status,
                              // @ts-ignore
                              time: serverTimestamp(),
                              author: user.uid,
                            },
                          });
                      }

                      this.afs
                        .collection(`users/${user.uid}/majorEventSubscriptions`)
                        .doc(this.majorEventID)
                        .set({
                          reference: this.afs.doc(`majorEvents/${this.majorEventID}/subscriptions/${user.uid}`).ref,
                        })
                        .then(() => {
                          this.successSwal.fire();
                          setTimeout(() => {
                            this.successSwal.close();
                            if (
                              this.paymentStatus === 1 ||
                              this.paymentStatus === 4 ||
                              this.paymentStatus === 5 ||
                              price === 0
                            ) {
                              this.router.navigate(['/inscricoes'], { replaceUrl: true });
                            } else {
                              this.router.navigate(['/inscricoes/pagar', this.majorEventID], {
                                replaceUrl: true,
                              });
                            }
                          }, 2000);
                        });
                    });
                } else {
                  this.alreadySubscribed.fire();
                  this.router.navigate(['/eventos'], { replaceUrl: true });

                  setTimeout(() => {
                    this.alreadySubscribed.close();
                  }, 1000);
                }
              });
          }
        });
      });
    });

    return;
  }

  async openConfirmModal(): Promise<boolean> {
    const eventsSelected: EventItem[] = Object.values(this.eventsSelected).reduce((acc, val) => acc.concat(val), []);

    eventsSelected.sort((a, b) => {
      return compareAsc(
        this.dateService.getDateFromTimestamp(a.eventStartDate),
        this.dateService.getDateFromTimestamp(b.eventStartDate),
      );
    });

    const modal = await this.modalController.create({
      component: ConfirmModalComponent,
      componentProps: {
        majorEvent$: this.majorEvent$,
        eventsSelected: eventsSelected,
        minicursosCount: this.eventsSelected['minicurso'].length - this.eventGroupMinicursoCount,
        palestrasCount: this.eventsSelected['palestra'].length,
        subscriptionType: this.opSelected,
      },
      showBackdrop: true,
    });
    await modal.present();

    return modal.onDidDismiss().then((data) => {
      if (data.data) {
        return new Promise<boolean>((resolve) => {
          resolve(true);
        });
      }
      return new Promise<boolean>((resolve) => {
        resolve(false);
      });
    });
  }

  async processingToast() {
    const toast = await this.toastController.create({
      message: 'Processando...',
      duration: 1000,
      position: 'bottom',
      icon: 'hourglass-outline',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }
}

interface Subscription {
  id?: string;
  reference?: DocumentReference<any>;
}
