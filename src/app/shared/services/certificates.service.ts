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

interface CacicTemplate {
  [0]: {
    date: string;
    participation_type: string;
    name: string;
    event_type: string;
    event_name: string;
    url: string;
    qrcode: string;
  };
  [1]: {
    qrcode2: string;
    name_small: string;
    document: string;
    event_name_small: string;
    content: string;
  };
}

export interface CacicTemplateInput {
  date: string;
  participationType: string;
  name: string;
  eventType: string;
  eventName: string;
  document: string;
  content: string;
}

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
  certificateIssueInProgress?: {
    issueName: string;
    issueStartDate: Timestamp;
    issueAuthor: string;
    lastSuccessfulUserID: string;
    issuedCount: number;
    certificateData: CertificateIssueData;
  };
}

interface CertificateIssueData {
  eventName: string;
  issueDate: Timestamp;
  issueTo?: string[];
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

export interface CertificateTemplateData {
  certificateName: string;
  certificateID: string;
  certificateTemplate: string;
  issueDate: Timestamp;
  actualissueDate?: Timestamp;
  participation: {
    type: string;
    custom: string;
  };
  event: {
    type: string;
    custom: string;
  };
  content: {
    type: string;
    custom: string;
  };
  issuedTo: {
    toPayer: string;
    toNonSubscriber: string;
    toNonPayer: string;
    toList: string[];
  };
}
