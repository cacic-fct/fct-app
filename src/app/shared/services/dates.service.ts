import { Timestamp } from '@firebase/firestore-types';
import { fromUnixTime } from 'date-fns';

export class DatesService {
  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }
}