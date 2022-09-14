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
  inMajorEvent: string;
  eventType: string;
  issueCertificate: boolean;
  doublePresence: boolean;
  collectPresenceForm: boolean;
}
