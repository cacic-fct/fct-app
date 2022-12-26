import { Timestamp } from '@firebase/firestore-types';
import { CertificateIssuingInProgress } from './certificates.service';

export interface EventItem extends CertificateIssuingInProgress {
  name: string;
  icon: string;
  course: string;
  slotsAvailable?: number;
  numberOfSubscriptions?: number;
  eventStartDate: Timestamp;
  eventEndDate: Timestamp;
  location?: {
    lat?: number;
    lon?: number;
    description?: string;
  };
  description?: string;
  shortDescription?: string;
  youtubeCode?: string;
  id?: string;
  button?: {
    text?: string;
    url: string;
  };
  inMajorEvent?: string;
  eventType?: string;
  public?: boolean;
  issueCertificate?: boolean;
  collectAttendance?: boolean;
  eventGroup?: string[];
  createdBy: string;
  createdOn: Timestamp;
  attendanceCollectionStart?: Timestamp;
  attendanceCollectionEnd?: Timestamp;
  attendanceCode?: string;
  allowSubscription?: boolean;
  /**
   * Carga-horária em horas
   */
  creditHours?: number;
}

export interface EventSubscription {
  time: Timestamp;
}
