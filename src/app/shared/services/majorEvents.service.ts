import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@firebase/firestore-types';
import { Observable } from 'rxjs';

// TODO como utilizar Observables para retornar os grandes eventos futuros?

@Injectable()
export class MajorEventsService {
  constructor(public afs: AngularFirestore) {}

  getFutureMajorEvents(): Observable<EventItem[]> {
    const date = Date.now();
    this.afs
      .collection<EventItem>('majorEvents', (ref) => {
        let query: any = ref;
        query = query.where('dateStart', '>=', date);
        return query.orderBy('dateStart', 'asc');
      })
      .valueChanges({ idField: 'id' })
      .subscribe((data) => {});
    return null;
  }
}

export interface EventItem {
  name: string;
  icon: string;
  course: string;
  dateStart: Timestamp;
  dateEnd?: Timestamp;
  subscriptionDateStart?: Timestamp;
  subscriptionDateEnd?: Timestamp;
  price?:
    | string
    | {
        priceStudents?: string;
        priceOtherStudents?: string;
        priceProfessors?: string;
      };
  accountChavePix?: string;
  accountBank?: string;
  accountName?: string;
  accountDocument?: string;
  accountAgency?: string;
  accountNumber?: string;
  description?: string;
  button?: {
    text?: string;
    url: string;
  };
  public: boolean;
  createdBy: string;
  createdOn: Timestamp;
  id: string;
}
