import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { trace } from '@angular/fire/compat/performance';
import { serverTimestamp } from '@angular/fire/firestore';
import { Timestamp } from '@firebase/firestore-types';
import { combineLatest, map, Observable, switchMap, take } from 'rxjs';

@Injectable()
export class EventsService {
  constructor(private afs: AngularFirestore) {}

  eventExists$(eventID: string) {
    return this.getEvent$(eventID).pipe(map((event) => (event ? true : false)));
  }

  getEvent$(eventID: string): Observable<EventItem | false> {
    return this.afs
      .collection<EventItem>('events')
      .doc(eventID)
      .valueChanges()
      .pipe(
        trace('firestore'),
        map((document) => (document ? document : false))
      );
  }

  getNumberOfSubscriptions$(eventID: string): Observable<number> {
    return this.afs
      .collection(`events/${eventID}/subscriptions`)
      .valueChanges()
      .pipe(
        trace('firestore'),
        map((document) => document.length)
      );
  }

  getSubscriptions$(eventID: string): Observable<EventSubscription[]> {
    return this.afs
      .collection<EventSubscription>(`events/${eventID}/subscriptions`)
      .valueChanges()
      .pipe(
        trace('firestore')
      );
  }

  getSlotsAvailable$(eventID: string) {
    return combineLatest([this.getEvent$(eventID), this.getNumberOfSubscriptions$(eventID)]).pipe(
      map(([event, subs]) => {
        if (event) {
          // Esse atributo indicava quantos slots estão disponíveis
          // Se existir, utilizar esse valor, mas não é recomendado que seja utilizado.
          if (event.slotsAvailable) {
            return event.slotsAvailable;
          }
          if (event.slots) {
            return event.slots - subs;
          } else {
            return Infinity;
          }
        } else {
          return false;
        }
      })
    );
  }

  writeUserSubscription$(eventID: string, uid: string): Observable<boolean> {
    return this.eventExists$(eventID).pipe(
      take(1),
      switchMap((eventExists) => {
        if (eventExists) {
          return this.afs
            .collection<EventSubscription>(`events/${eventID}/subscriptions`)
            .doc(uid)
            .set({ time: serverTimestamp() as Timestamp })
            .then(
              () => true,
              () => false
            );
        } else {
          Promise.resolve(false);
        }
      })
    );
  }

  writeUserAttendance$(eventID: string, uid: string, collection: string = 'attendance'): Observable<boolean> {
    return this.eventExists$(eventID).pipe(
      take(1),
      switchMap((eventExists) => {
        if (eventExists) {
          return this.afs
            .collection<EventAttendance>(`events/${eventID}/${collection}`)
            .doc(uid)
            .set({ time: serverTimestamp() as Timestamp })
            .then(
              () => true,
              () => false
            );
        } else {
          Promise.resolve(false);
        }
      })
    );
  }
}

export interface EventItem {
  course: string;
  eventStartDate: Timestamp;
  eventEndDate?: Timestamp;
  icon: string;
  name: string;
  shortDescription?: string;
  description?: string;
  location?: {
    lat?: number;
    lon?: number;
    description?: string;
  };
  public: boolean;
  youtubeCode?: string;
  id?: string;
  button?: {
    text?: string;
    url: string;
  };
  issueCertificate?: boolean;
  slots?: number;
  eventType?: string;
  attendanceCollectionStart?: Timestamp;
  attendanceCollectionEnd?: Timestamp;
  collectAttendance?: boolean;
  inMajorEvent?: string;
  doublePresence?: boolean;
  eventGroup?: string[];
  createdBy: string;
  createdOn: Timestamp;
  attendanceCode?: string;
  allowSubscription?: boolean;
  /**
   * @deprecated
   */
  slotsAvailable?: number;
  /**
   * @deprecated
   */
  numberOfSubscriptions?: number;
}

export interface EventSubscription {
  time: Timestamp;
}

export interface EventAttendance {
  time: Timestamp;
}
