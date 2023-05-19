// @ts-strict-ignore
import { MajorEventItem } from 'src/app/shared/services/major-event.service';
import { User } from '../../../../shared/services/user';
import { EventItem } from '../../../../shared/services/event';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { serverTimestamp, increment } from '@angular/fire/firestore';
import { MajorEventSubscription } from '../../../../shared/services/major-event.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { Observable, map, take, combineLatest } from 'rxjs';
import { trace } from '@angular/fire/compat/performance';
import { DateService } from 'src/app/shared/services/date.service';
import { Auth, user } from '@angular/fire/auth';

@UntilDestroy()
@Component({
  selector: 'app-page-manage-subscription',
  templateUrl: './page-manage-subscription.page.html',
  styleUrls: ['./page-manage-subscription.page.scss'],
})
export class PageManageSubscriptionPage implements OnInit {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);

  subscriptionID = this.route.snapshot.paramMap.get('subscriptionID');
  majorEventID = this.route.snapshot.paramMap.get('eventID');

  subscription$: Observable<MajorEventSubscription>;

  userData$: Observable<User>;

  eventsUserIsSubscribedTo$: Observable<EventItem[]>;

  eventsUserAttended = [];
  eventsUserAttendedNotPaying = [];

  constructor(private route: ActivatedRoute, private afs: AngularFirestore, public dateService: DateService) {}

  ngOnInit() {
    this.userData$ = this.afs.doc<User>(`users/${this.subscriptionID}`).valueChanges().pipe(untilDestroyed(this));

    this.subscription$ = this.afs
      .doc<MajorEventSubscription>(`majorEvents/${this.majorEventID}/subscriptions/${this.subscriptionID}`)
      .valueChanges()
      .pipe(untilDestroyed(this));

    this.subscription$.subscribe((data) => {
      let tempArray: Observable<EventItem>[] = [];

      data.subscribedToEvents.map((event) => {
        tempArray.push(this.afs.doc<EventItem>(`events/${event}`).valueChanges().pipe(take(1), trace('firestore')));
      });

      let observableArrayOfEvents = combineLatest(tempArray);

      observableArrayOfEvents = observableArrayOfEvents.pipe(
        map((events) => {
          return events.sort((a, b) => {
            return a.eventStartDate.toMillis() - b.eventStartDate.toMillis();
          });
        })
      );

      this.eventsUserIsSubscribedTo$ = observableArrayOfEvents;
    });

    // TODO: Refactor me
    // Get all events of this major event
    this.afs
      .doc<MajorEventItem>(`majorEvents/${this.majorEventID}`)
      .get()
      .subscribe((doc) => {
        const data = doc.data();

        // For every event of this major event, check if user document is in the attendance collection
        data.events.forEach((event) => {
          this.afs
            .doc(`events/${event}/attendance/${this.subscriptionID}`)
            .get()
            .subscribe((doc) => {
              if (doc.exists) {
                this.eventsUserAttended.push(event);
              } else {
                this.afs
                  .doc(`events/${event}/non-paying-attendance/${this.subscriptionID}`)
                  .get()
                  .subscribe((doc) => {
                    if (doc.exists) {
                      this.eventsUserAttendedNotPaying.push(event);
                    }
                  });
              }
            });
        });
      });
  }

  forceEventEdit() {
    this.user$.subscribe((user) => {
      this.afs
        .doc<MajorEventSubscription>(`majorEvents/${this.majorEventID}/subscriptions/${this.subscriptionID}`)
        .get()
        .subscribe((doc) => {
          const data = doc.data();
          if (data.payment.status !== 2) {
            return;
          }
          data.subscribedToEvents.forEach((event) => {
            this.afs.doc<EventItem>(`events/${event}/subscriptions/${this.subscriptionID}`).delete();
            this.afs.doc<EventItem>(`events/${event}`).update({
              // @ts-ignore
              slotsAvailable: increment(1),
              // @ts-ignore
              numberOfSubscriptions: increment(-1),
            });
          });

          this.afs.doc(`majorEvents/${this.majorEventID}/subscriptions/${this.subscriptionID}`).update({
            'payment.status': 1,
            'payment.validationAuthor': user.uid,
            'payment.validationTime': serverTimestamp(),
          });
        });
    });
  }
}
