import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@firebase/firestore-types';
import { combineLatest, map, Observable, switchMap } from 'rxjs';

export class EventsService {
  constructor(private afs: AngularFirestore) {}

  getEvent(eventID: string): Observable<EventItem | false> {
    return this.afs
      .collection<EventItem>('events')
      .doc(eventID)
      .valueChanges()
      .pipe(map((document) => (document ? document : false)));
  }

  numberOfSubscriptions(eventID: string): Observable<number> {
    return this.afs
      .collection(`events/${eventID}/subscriptions`)
      .valueChanges()
      .pipe(map((document) => document.length));
  }

  getSlotsAvailable(eventID: string) {
    return combineLatest([this.getEvent(eventID), this.numberOfSubscriptions(eventID)]).pipe(
      map(([event, subs]) => {
        if (event) {
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
