import { DocumentReference } from '@angular/fire/firestore';
import { Timestamp } from '@firebase/firestore-types';

export interface Certificate {
  /**
   * User's "fullName"
   */
  userName: string;
  eventName: string;
  eventType: {
    /**
     * 0 - Custom
     *
     * 1 - "no evento"
     *
     * 2 - "no minicurso"
     *
     * 3 - "na palestra"
     *
     * 4 - "na atividade"
     */
    code: number;

    custom?: string;
  };

  participationType: {
    /** 0 - Custom
     *
     * 1 - "Certificamos a participação de"
     *
     * 2 - "Certificamos a participação digital de"
     *
     * 3 - "Certificamos que"
     */
    code: number;
    custom?: string;
  };

  content: {
    /**
     * 0 - Custom
     *
     * 1 - Default
     */
    code: number;
    custom?: string;
  };
}

export interface CertificateIssueInProgress {
  CertificateIssueInProgress?: {
    issuingName: string;
    issuingStartDate: Timestamp;
    issuingAuthor: string;
    lastSuccessfulUserID: string;
    issuedCount: number;
    certificateData: CertificateIssuingData;
  };
}

interface CertificateIssuingData {
  eventName: string;
  issuingDate: Timestamp;
  issuingTo?: string[];
  participationType: {
    /** 0 - Custom
     *
     * 1 - "Certificamos a participação de"
     *
     * 2 - "Certificamos a participação digital de"
     *
     * 3 - "Certificamos que"
     */
    code: number;
    custom?: string;
  };
  eventType: {
    /**
     * 0 - Custom
     *
     * 1 - "no evento"
     *
     * 2 - "no minicurso"
     *
     * 3 - "na palestra"
     *
     * 4 - "na atividade"
     */
    code: number;
    custom?: string;
  };
  content: {
    /**
     * 0 - Custom
     *
     * 1 - Default
     */
    code: number;
    custom?: string;
  };
}

export interface UserCertificateDocument {
  publicReference: DocumentReference;
  certificateName: string;
}
