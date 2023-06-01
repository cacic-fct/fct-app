import { NavController, ToastController } from '@ionic/angular';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { trace } from '@angular/fire/compat/performance';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, Observable, take, combineLatest } from 'rxjs';
import { EventItem } from 'src/app/shared/services/event';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MajorEventItem, MajorEventSubscription } from 'src/app/shared/services/major-event.service';

import {
  Firestore,
  collection,
  doc,
  docData,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayRemove,
  DocumentReference,
  DocumentData,
} from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';

interface EventInfo {
  name: string;
}

@UntilDestroy()
@Component({
  selector: 'app-confirm-attendance',
  templateUrl: './confirm-attendance.html',
  styleUrls: ['./confirm-attendance.scss'],
})
export class ConfirmAttendancePage implements OnInit {
  private firestore: Firestore = inject(Firestore);

  eventID: string;
  dataForm: FormGroup;
  eventInfo$: Observable<EventInfo>;
  private eventDocRef: DocumentReference<DocumentData>;
  private eventDocData: Observable<EventItem>;
  private isSubEvent: boolean | undefined;
  private majorEventDocRef: DocumentReference<DocumentData> | undefined;
  private majorEventDoc: Observable<MajorEventItem> | undefined;
  private isPaid: boolean | undefined;
  private attendanceCode: string | undefined;
  @ViewChild('swalConfirm') private swalConfirm!: SwalComponent;
  @ViewChild('swalNotFound') private swalNotFound!: SwalComponent;
  @ViewChild('swalNotOnTime') private swalNotOnTime!: SwalComponent;
  @ViewChild('swalAlreadyConfirmed') private swalAlreadyConfirmed!: SwalComponent;

  private auth: Auth = inject(Auth);
  user$ = user(this.auth);

  constructor(
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private navController: NavController,
    private router: Router,
    private toastController: ToastController
  ) {
    this.eventID = this.route.snapshot.params.eventID;
    this.dataForm = this.formBuilder.group({
      code: ['', [Validators.required, this.codeValidator]],
    });

    const eventsColRef = collection(this.firestore, 'events');
    this.eventDocRef = doc(eventsColRef, this.eventID);
    this.eventDocData = docData(this.eventDocRef) as Observable<EventItem>;

    // Check if user is already registered
    this.user$.pipe(take(1), trace('auth')).subscribe((user) => {
      if (!user) {
        return;
      }

      const attendanceColRef = collection(this.firestore, `events/${this.eventID}/attendance`);
      const nonPayingAttendanceColRef = collection(this.firestore, `events/${this.eventID}/non-paying-attendance`);
      const payingAttendanceDocRef = doc(attendanceColRef, user.uid);
      const nonPayingAttendanceDocRef = doc(nonPayingAttendanceColRef, user.uid);

      const payingAttendance = docData(payingAttendanceDocRef).pipe(map((doc) => doc.exists));
      const nonPayingAttendance = docData(nonPayingAttendanceDocRef).pipe(map((doc) => doc.exists));

      const evaluateBool: Observable<boolean> = combineLatest([payingAttendance, nonPayingAttendance]).pipe(
        map(([paying, nonPaying]) => paying || nonPaying)
      );

      evaluateBool.subscribe((isAttendanceAlreadyCollected) => {
        if (isAttendanceAlreadyCollected) {
          this.swalAlreadyConfirmed.fire();
          setTimeout(() => {
            this.swalAlreadyConfirmed.close();
            this.navController.back();
          }, 2000);
        }
      });
    });

    this.eventDocData.pipe(take(1), trace('firestore')).subscribe((eventItem) => {
      if (!eventItem) {
        this.swalNotFound.fire();
        setTimeout(() => {
          this.router.navigate(['/menu']);
          this.swalNotFound.close();
        }, 2000);
      }

      if (!eventItem.attendanceCollectionStart || eventItem.attendanceCollectionEnd) {
        this.swalNotOnTime.fire();
        setTimeout(() => {
          this.router.navigate(['/menu']);
          this.swalNotOnTime.close();
        }, 2000);
      }

      this.attendanceCode = eventItem.attendanceCode;

      if (eventItem.inMajorEvent) {
        // If it is a subEvent, then check to see if the majorEvent
        // is paid or free.
        this.isSubEvent = true;
        // majorEvent reference
        const majorEventsColRef = collection(this.firestore, 'majorEvents');
        this.majorEventDocRef = doc(majorEventsColRef, eventItem.inMajorEvent);

        this.majorEventDoc = docData(this.majorEventDocRef) as Observable<MajorEventItem>;
        // Checking if majorEvent is paid
        // This should be constant
        this.majorEventDoc.pipe(take(1)).subscribe((majorEvent) => {
          if (majorEvent.price.isFree) {
            this.isPaid = false;
          } else {
            this.isPaid = true;
          }
        });
      } else {
        this.isSubEvent = false;
      }
    });

    this.eventInfo$ = this.eventDocData.pipe(
      trace('firestore'),
      untilDestroyed(this),
      map((event) => ({
        name: event.name,
      }))
    );

    // When the code is valid, automatically submit.
    this.dataForm
      .get('code')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value == this.attendanceCode) {
          this.onSubmit();
        }
      });
  }

  ngOnInit() {}

  async errorToast() {
    const toast = await this.toastController.create({
      message: 'Ocorreu um erro. Por favor, tente novamente.',
      duration: 2000,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }

  codeValidator = (formControl: AbstractControl): { [key: string]: boolean } | null => {
    if (!this.attendanceCode) {
      return { codeLoading: true };
    }
    if (formControl.value == this.attendanceCode) {
      return null;
    } else {
      return { wrongCode: true };
    }
  };

  onSubmit() {
    this.user$.pipe(take(1), trace('auth')).subscribe((user) => {
      if (this.dataForm.invalid || !user) {
        return;
      }

      if (this.isSubEvent === undefined || this.isPaid === undefined) {
        return;
      }

      const userID = user.uid;

      const isPaymentNecessary: boolean = this.isSubEvent && this.isPaid;

      try {
        if (isPaymentNecessary) {
          if (!this.majorEventDoc || !this.majorEventDocRef) {
            return;
          }

          const majorEventSubscriptionsColRef = collection(this.majorEventDocRef, 'subscriptions');

          const userSubscriptionDocRef = doc(majorEventSubscriptionsColRef, userID);
          const userSubscriptionDoc$ = docData(userSubscriptionDocRef) as Observable<MajorEventSubscription>;

          // Check if user payment status = 2
          userSubscriptionDoc$.pipe(take(1), trace('firestore')).subscribe((subscriptionItem) => {
            if (subscriptionItem.payment.status == 2) {
              // Escrevendo na coleção 'attendance'
              const attendanceColRef = collection(this.eventDocRef, 'attendance');
              const userIDDocRef = doc(attendanceColRef, userID);

              setDoc(userIDDocRef, {
                time: serverTimestamp(),
              });
            } else {
              // Escrevendo na coleção 'non-paying-attendance'
              const nonPayingAttendanceColRef = collection(this.eventDocRef, 'non-paying-attendance');
              const userIDDocRef = doc(nonPayingAttendanceColRef, userID);

              setDoc(userIDDocRef, {
                time: serverTimestamp(),
              });
            }
          });
        } else {
          const attendanceColRef = collection(this.eventDocRef, 'attendance');
          const userIDDocRef = doc(attendanceColRef, userID);

          // Escrevendo na coleção 'attendance'
          setDoc(userIDDocRef, {
            time: serverTimestamp(),
          });
        }

        const userDocRef = doc(collection(this.firestore, 'users'), userID);

        updateDoc(userDocRef, {
          'pending.onlineAttendance': arrayRemove(this.eventID),
        }).then(() => {
          setTimeout(() => {
            this.swalConfirm.fire();
            setTimeout(() => {
              this.swalConfirm.close();
              this.navController.back();
            }, 1500);
          }, 1500);
        });
      } catch (error) {
        this.dataForm.get('code')?.enable();
        this.errorToast();
        console.error(error);
      }
    });
  }
}
