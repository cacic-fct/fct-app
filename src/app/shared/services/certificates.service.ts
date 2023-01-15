import { EventItem } from 'src/app/shared/services/event';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DocumentReference } from '@angular/fire/firestore';
import { Timestamp } from '@firebase/firestore-types';
import { Observable, take, switchMap, combineLatest, map } from 'rxjs';
import { Injectable, isDevMode } from '@angular/core';
import { format as formatDate } from 'date-fns';

import { Template, generate as PDFGenerate } from '@pdfme/generator';
import { HttpClient } from '@angular/common/http';
import { ptBR } from 'date-fns/locale';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  constructor(private afs: AngularFirestore, private http: HttpClient) {}

  generateCertificate(
    eventID: string,
    certificateStoreData: CertificateStoreData,
    certificateUserData: UserCertificateDocument
  ) {
    if (!certificateUserData.id || !certificateStoreData.id) {
      throw new Error('Request is malformed');
    }

    let pdfJson: Observable<Object>;
    const pdfPath = `assets/certificates/templates/${certificateStoreData.certificateTemplate}.json`;
    if (isDevMode()) {
      pdfJson = this.http.get(pdfPath, {
        responseType: 'json',
      });
    } else {
      pdfJson = this.http.get(`https://cdn.jsdelivr.net/gh/cacic-fct/fct-app@main/src/${pdfPath}`, {
        responseType: 'json',
      });
    }

    const certificateData$ = this.afs
      .doc<CertificateDocPublic>(`/certificates/${eventID}/${certificateUserData.id}/public`)
      .get();

    certificateData$.pipe(take(1)).subscribe(async (certificateDataSnapshot) => {
      const certificateData = certificateDataSnapshot.data();
      if (!certificateData) {
        throw new Error('Certificate data is missing');
      }

      pdfJson.pipe(take(1)).subscribe(async (pdf) => {
        const template = pdf as Template;

        let font = {};

        switch (certificateStoreData.certificateTemplate) {
          case 'cacic':
            font = {
              Inter_Regular: {
                data: await fetch(
                  'https://cdn.jsdelivr.net/gh/cacic-fct/fonts@main/Inter/latin-ext/inter-v12-latin-ext-regular.woff'
                ).then((res) => res.arrayBuffer()),
                fallback: true,
              },
              Inter_Medium: {
                data: await fetch(
                  'https://cdn.jsdelivr.net/gh/cacic-fct/fonts@main/Inter/latin-ext/inter-v12-latin-ext-500.woff'
                ).then((res) => res.arrayBuffer()),
              },
              Inter_Light: {
                data: await fetch(
                  'https://cdn.jsdelivr.net/gh/cacic-fct/fonts@main/Inter/latin-ext/inter-v12-latin-ext-300.woff'
                ).then((res) => res.arrayBuffer()),
              },
            };
            break;
        }

        const verificationURL = `https://fct-pp.web.app/certificado/verificar/${eventID}-${certificateUserData.id}`;

        this.getCertificateContent(eventID, certificateUserData.id!)
          .pipe(take(1))
          .subscribe((content) => {
            let input = {
              name: certificateData.fullName,
              name_small: certificateData.fullName,
              date: formatDate(certificateData.issueDate.toDate(), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              }),
              document: certificateData.document,
              event_type: certificateStoreData.eventType.custom || certificateStoreData.eventType.type,
              participation_type:
                certificateStoreData.participationType.custom || certificateStoreData.participationType.type,
              url: verificationURL,
              qrcode: verificationURL,
              qrcode2: verificationURL,
              content: content,
            };

            const inputs = [input];

            PDFGenerate({ template, inputs, options: { font } }).then((pdf) => {
              const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
              const pdfUrl = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = pdfUrl;
              a.download = certificateStoreData.certificateName + '.pdf';
              a.click();
            });
          });
      });
    });
  }

  getCertificateContent(eventID: string, certificateID: string): Observable<string> {
    // Get events user attended from /certificates/{eventID}/{certificateID}
    const certificate$ = this.afs.doc<CertificateDocPublic>(`certificates/${eventID}/${certificateID}/public`).get();

    return certificate$.pipe(
      take(1),
      switchMap((certificate) => {
        if (certificate.exists) {
          // For every element in attendedEvents, get event info from /events/{eventID}
          const eventInfoCache: Observable<EventItem | undefined>[] = [];
          const eventsUserAttended = certificate.data()?.attendedEvents;

          if (eventsUserAttended === undefined) {
            return '';
          }

          // Get event info from cache
          for (const eventID of eventsUserAttended) {
            eventInfoCache.push(this.afs.doc<EventItem>(`events/${eventID}`).valueChanges());
          }

          // Generate content
          const a = generateContent(eventInfoCache);
          return a;
        } else {
          throw new Error('Unable to generate content, certificate does not exist');
        }
      })
    );
  }
}
function generateContent(eventInfoCache: Observable<EventItem | undefined>[]): Observable<string> {
  const eventInfo$ = combineLatest(eventInfoCache);

  return eventInfo$.pipe(
    take(1),
    map((eventInfo) => {
      const minicursos = [];
      const palestras = [];
      const uncategorized = [];

      for (const event of eventInfo) {
        if (event === undefined) {
          continue;
        }
        switch (event.eventType) {
          case 'minicurso':
            minicursos.push(event);
            break;
          case 'palestra':
            palestras.push(event);
            break;
          default:
            uncategorized.push(event);
            break;
        }
      }

      let content = '';
      if (minicursos.length > 0) {
        content += makeText('Minicurso', 'Minicursos', minicursos);
      }

      if (palestras.length > 0) {
        content += makeText('Palestra', 'Palestras', palestras);
      }

      if (uncategorized.length > 0) {
        content += makeText('Atividade', 'Atividades', uncategorized);
      }

      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const userTimezoneOffset = new Date().getTimezoneOffset() / 60;
      const userTimezoneOffsetString = `${userTimezoneOffset > 0 ? '-' : '+'}${Math.abs(userTimezoneOffset)}`;

      content += `\nDatas de acordo com o fuso horário "${userTimezone}" (UTC${userTimezoneOffsetString}).`;

      return content;
    })
  );
}

function makeText(typeSingular: string, typePlural: string, array: EventItem[]): string {
  if (array.length === 0) {
    return '';
  }

  let content = '';

  if (array.length > 1) {
    content = typePlural;
  } else {
    content = typeSingular;
  }

  content += ':\n';

  let totalCreditHours = 0;
  for (const event of array) {
    content += `• ${formatTimestamp(event.eventStartDate)} - ${event.name} - Carga horária: ${
      event.creditHours ? event.creditHours + ' horas' : 'indefinida'
    };\n`;
  }
  content = content.slice(0, -2) + '.\n';
  content += `Carga horária total: ${totalCreditHours} horas.\n\n`;

  return content;
}

function convertTimezone(date: Date, timezone: string): Date {
  const convertedDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return convertedDate;
}

function formatTimestamp(date: Timestamp): string {
  let dateFormatted = date.toDate();
  dateFormatted = convertTimezone(dateFormatted, 'America/Sao_Paulo');

  return formatDate(dateFormatted, 'dd/MM/yyyy - HH:mm');
}

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

interface CertificateDocPublic {
  certificateID: string;
  document: string;
  fullName: string;
  issueDate: Timestamp;
  attendedEvents: string[];
}

export interface UserCertificateDocument {
  publicReference: DocumentReference;
  certificateID: string;
  id?: string;
}

export interface CertificateStoreData {
  certificateContent: {
    custom?: string;
    type: string;
  };
  certificateName: string;
  certificateTemplate: string;
  eventType: {
    type: string;
    custom?: string;
  };
  participationType: {
    type: string;
    custom?: string;
  };
  id?: string;
}
