import { Timestamp } from '@firebase/firestore-types';

export interface EventItem {
  name: string;
  icon: string;
  course: string;
  date: Timestamp;
  dateEnd: Timestamp;
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
  slots: number;
  slotsAvailable: number;
}
