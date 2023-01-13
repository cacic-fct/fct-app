import { Timestamp } from '@firebase/firestore-types';

export const participationTypes = {
  custom: 'Personalizado',
  participacao: 'Certificamos a participação de',
  participacaoDigital: 'Certificamos a participação digital de',
  certificamosQue: 'Certificamos que',
};

export const eventTypes = {
  custom: 'Personalizado',
  evento: 'no evento',
  minicurso: 'no minicurso',
  palestra: 'na palestra',
  atividade: 'na atividade',
};

export const contentTypes = {
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

export class CertificateService {
  getTemplateURL(templateName: string) {
    if (Object.values(certificateTemplates).some((template) => template.templateFilename === templateName)) {
      //return `https://cdn.jsdelivr.net/gh/cacic-fct/fct-app@latest/src/assets/certificates/templates/${templateName}.json`;
      return `assets/certificates/templates/${templateName}.json`;
    }

    return 'Unknown template name';
  }

  cacicCertificatePreviewInputs(data: CacicTemplateInput) {
    const url = 'https://fct-pp.web.app/certificado/validar/exemplo';
    return [
      {
        date: data.date,
        participation_type: data.participationType,
        name: data.name,
        event_type: data.eventType,
        event_name: data.eventName,
        qrcode: url,
        url: url,
        name_small: data.name,
        document: '000.000.000-00',
        event_name_small: data.eventName,
        content: data.content,
        qrcode2: url,
      },
    ];
  }
}

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
