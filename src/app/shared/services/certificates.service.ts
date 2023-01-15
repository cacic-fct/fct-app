import { Timestamp } from '@firebase/firestore-types';

interface CertificateOptionsTypes {
  custom: string;
  [key: string]: string;
}

export const participationTypes: CertificateOptionsTypes = {
  custom: 'Personalizado',
  participacao: 'Certificamos a participação de',
  participacaoDigital: 'Certificamos a participação digital de',
  certificamosQue: 'Certificamos que',
};

export const eventTypes: CertificateOptionsTypes = {
  custom: 'Personalizado',
  evento: 'no evento',
  minicurso: 'no minicurso',
  palestra: 'na palestra',
  atividade: 'na atividade',
};

export const contentTypes: CertificateOptionsTypes = {
  custom: 'Personalizado',
  default: 'Atividades realizadas (padrão)',
};

export const certificateTemplates = {
  cacic: {
    displayName: 'CACiC',
    /**
     * Preferibly the same name as the key
     */
    templateFilename: 'cacic',
  },
};

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

export interface CertificateIssuingInProgress {
  certificateIssuingInProgress?: {
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
