import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MailtoService, Mailto } from './../../../shared/services/mailto.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { isDefined } from 'src/app/shared/services/rxjs.service';

import { User } from '@firebase/auth';

import {
  GeneratePdfCertificateService,
  generateCertificateOptions,
} from './../../../shared/services/generate-pdf-certificate.service';
import { first, map, Observable, take, switchMap, combineLatest } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserCertificateDocument } from 'src/app/shared/services/certificates.service';

@Component({
  selector: 'app-list-certificates',
  templateUrl: './list-certificates.component.html',
  styleUrls: ['./list-certificates.component.scss'],
})
export class ListCertificatesComponent implements OnInit {
  @Input() majorEventID!: string;
  userData: User;
  certificatesColletion$: Observable<UserCertificateDocument[]>;
  userID!: string;

  certificates$: Observable<any>;

  constructor(
    private genpdf: GeneratePdfCertificateService,
    private modalController: ModalController,
    private mailtoService: MailtoService,
    private auth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.userData = JSON.parse(localStorage.getItem('user') as string);

    this.certificatesColletion$ = this.auth.user.pipe(
      first(isDefined),
      map((user) => {
        this.userID = user.uid;
        return this.afs
          .collection<UserCertificateDocument>(`/users/${user.uid}/certificates/majorEvents/${this.majorEventID}`)
          .valueChanges({ idField: 'id' });
      }),
      switchMap((value) => value)
    );

    // Get all certificates based on this.certificatesColletion$ documment ids

    this.certificates$ = this.certificatesColletion$.pipe(
      map((certificates) => {
        return certificates.map((certificate) => {
          const options = {
            name: this.userData.displayName,
            event_name: certificate.eventName,

            date: certificate.eventDate,
            event_name_small: certificate.eventName,
            name_small: this.userData.displayName,
            certificateID: certificate.id,
            userID: this.userID,
          };
          return options;
        });
      })
    );

    // this.certificates$ = this.certificatesColletion$.pipe(
    //   map(([certificates, user]) => {
    //     return certificates.map((certificate) => {
    //       const options: generateCertificateOptions = {
    //         name: user.displayName,
    //         event_name: certificate.eventName,
    //         date: certificate.eventDate,
    //         event_name_small: certificate.eventName,
    //         name_small: user.displayName,
    //         certificateID: certificate.id,
    //         userID: user.uid,
    //       };
    //       return options;
    //     });
    //   })
    // );
  }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

  mailtoReportError(): void {
    const mailto: Mailto = {
      receiver: 'cacic.fct@gmail.com',
      subject: '[FCT-App] Problema com certificado',
      // TODO: Adicionar o id do evento no corpo do e-mail
      body: `Olá!\n\n\n\n\n=== Não apague os dados abaixo ===\nE-mail: ${this.userData.email}\nuid: ${this.userData.uid}\n`,
    };
    this.mailtoService.open(mailto);
  }

  async getCertificate() {
    const inputs = {
      name: 'Pedro de Alcântara João Carlos Leopoldo Salvador Bibiano Francisco Xavier de Paula Leocádio Miguel',
      event_name: 'SECOMPP22',
      date: '13 de dezembro de 2022',
      event_name_small: 'SECOMPP22',
      name_small: 'Pedro de Alcântara João Carlos Leopoldo Salvador Bibiano Francisco Xavier de Paula Leocádio Miguel',
      content:
        'Palestras:\n• 14/12/2022 10:45 - SECOMPP22 - Carga horária: 5 horas\n• 15/12/2022 10:45 - SECOMPP23 - Carga horária: 10 horas\nTotal: 15 horas - 2 palestras\n\nMinicursos:\n• 16/12/2022 10:45 - SECOMPP24 - Carga horária: 5 horas\n• 17/12/2022 10:45 - SECOMPP25 - Carga horária: 10 horas\nTotal: 15 horas - 2 minicursos\n\nAtividades:\n• 18/12/2022 10:45 - SECOMPP26 - Carga horária: 5 horas\nTotal: 5 horas - 1 atividade',
      document: 'CPF: 000.000.000-00',
    };

    const options: generateCertificateOptions = {
      eventType: 'majorEvent',
      certificateID: 'certificateID',
      certificateName: 'certificateName',
    };
    this.genpdf.generateCertificate('cacic', inputs, options);
  }
}

const generateContent = async (eventsUserAttended: string[], eventInfoCache: EventCacheObject) => {
  const palestras: EventCache[] = [];
  const minicursos: EventCache[] = [];
  const uncategorized: EventCache[] = [];

  // TODO: Considerar grupos de eventos
  for (const eventID of eventsUserAttended) {
    switch (eventInfoCache[eventID].eventType) {
      case 'palestra':
        palestras.push(eventInfoCache[eventID]);
        break;
      case 'minicurso':
        minicursos.push(eventInfoCache[eventID]);
        break;
      default:
        uncategorized.push(eventInfoCache[eventID]);
        break;
    }
  }

  // Sort events by date
  palestras.sort((a, b) => a.eventStartDate.toMillis() - b.eventStartDate.toMillis());
  minicursos.sort((a, b) => a.eventStartDate.toMillis() - b.eventStartDate.toMillis());
  uncategorized.sort((a, b) => a.eventStartDate.toMillis() - b.eventStartDate.toMillis());

  // Generate content string
  let content = '';

  content += makeText('Palestra', palestras);
  content += makeText('Minicurso', minicursos);
  content += makeText('Atividade', uncategorized);

  console.log(content);

  return content;
};

function makeText(type: string, array: EventCache[]): string {
  let content = type;

  if (array.length === 0) {
    return '';
  }

  if (array.length > 1) {
    // If last character is 'm' replace it with 'ns'
    if (content.slice(-1) === 'm') {
      content = content.slice(0, -1) + 'ns';
    } else if (content.slice(-2) === 'ão') {
      content = content.slice(0, -2) + 'ões';
    } else {
      content += 's';
    }
  }
  content += ':\n';

  let totalWorkload = 0;
  for (const event of array) {
    content += `• ${formatTimestamp(event.eventStartDate)} - ${event.eventName} - Carga horária: ${
      event.workload ? event.workload + ' horas' : 'indefinida'
    };\n`;
  }
  content = content.slice(0, -2) + '.\n';
  content += `\nCarga horária total: ${totalWorkload} horas\n`;
  content += '\n\n';

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
