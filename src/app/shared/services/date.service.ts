import { Injectable } from '@angular/core';
import { fromUnixTime } from 'date-fns';
import { Timestamp as TimestampType } from '@firebase/firestore-types';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}

  getDateFromTimestamp(timestamp: TimestampType): Date {
    return fromUnixTime(timestamp.seconds);
  }

  today(): Date {
    return new Date();
  }
}
