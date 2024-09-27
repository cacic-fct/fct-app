export interface Event {
  majorEventId?: string;
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  collectAttendance: boolean;
  icon: string;
  type: string;
  issueCertificate: boolean;
  hasParts: boolean;
  creditHours: number;
  visibleForAssociateStatus: string[];
  visibleForTier: string[];
  eventStatus: string;
  slots: number;
}

export interface EventSubscription {
  id: string;
  eventId: string;
  userId: string;
}
