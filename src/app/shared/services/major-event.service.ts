import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@firebase/firestore-types';
import { Observable } from 'rxjs';
import { startOfDay } from 'date-fns';

// TODO como utilizar Observables para retornar os grandes eventos futuros?

@Injectable({
  providedIn: 'root',
})
export class MajorEventsService {
  constructor(public afs: AngularFirestore) {}

  getFutureMajorEvents(): Observable<MajorEventItem[]> {
    const date = Date.now();
    return this.afs
      .collection<MajorEventItem>('majorEvents', (ref) => {
        let query: any = ref;
        query = query.where('eventStartDate', '>=', startOfDay(date));
        return query.orderBy('eventStartDate', 'asc');
      })
      .valueChanges({ idField: 'id' });
  }
}

export interface MajorEventItem {
  name: string;
  course: string;
  description?: string;
  eventStartDate: Timestamp;
  eventEndDate: Timestamp;
  subscriptionStartDate?: Timestamp;
  subscriptionEndDate?: Timestamp;
  maxCourses?: number;
  maxLectures?: number;
  price: {
    students?: number;
    otherStudents?: number;
    professors?: number;
    single?: number;
    isFree?: boolean;
  };
  paymentInfo?: {
    chavePix?: string;
    bankName?: string;
    name?: string;
    document?: string;
    agency?: string;
    accountNumber?: string;
    additionalPaymentInformation?: string;
  } | null;
  button?: {
    text?: string;
    url: string;
  } | null;
  public: boolean;
  createdBy: string;
  createdOn: Timestamp;
  events: string[];
  id?: string;
}

export interface MajorEventSubscription {
  time: Timestamp;
  payment: {
    status: number;
    time: Timestamp;
    error?: string;
    price?: number;
    author: string;
    validationTime: Timestamp;
    validationAuthor: string;
  };
  subscriptionType: number;
  subscribedToEvents: string[];
}
