import { User } from 'src/app/shared/services/user';
import { EventItem } from 'src/app/shared/services/events.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { increment, serverTimestamp } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MajorEventSubscription } from 'src/app/shared/services/major-event.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { combineLatest, map, Observable, take } from 'rxjs';
import { trace } from '@angular/fire/compat/performance';
import { DatesService } from 'src/app/shared/services/dates.service';

@UntilDestroy()
@Component({
  selector: 'app-page-manage-subscription',
  templateUrl: './page-manage-subscription.page.html',
  styleUrls: ['./page-manage-subscription.page.scss'],
})
export class PageManageSubscriptionPage implements OnInit {
  subscriptionID = this.route.snapshot.paramMap.get('subscriptionID');
  majorEventID = this.route.snapshot.paramMap.get('eventID');

  subscription$: Observable<MajorEventSubscription>;

  userData$: Observable<User>;

  eventsUserIsSubscribedTo$: Observable<EventItem[]>;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    public dates: DatesService
  ) {}

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
  }

  forceEventEdit() {
    this.auth.user.subscribe((user) => {
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
