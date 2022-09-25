import { Timestamp } from '@firebase/firestore-types';

export interface EventItem {
  name: string;
  icon: string;
  course: string;
  date: Timestamp;
  eventStartDate: Timestamp;
  eventEndDate: Timestamp;
  eventType: string;
  time: string;
  slotsAvailable: number;
  numberOfSubscriptions: number;
  location: {
    lat: number;
    lon: number;
    description: string;
  };
  description: string;
  shortDescription: string;
  youtubeCode: string;
  id: string;
  button: {
    text: string;
    url: string;
  };
}
