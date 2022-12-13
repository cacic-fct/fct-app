import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { trace } from '@angular/fire/compat/performance';
import { fromUnixTime, isSameDay } from 'date-fns';
import { Observable, take, combineLatest, map } from 'rxjs';
import { EnrollmentTypesService } from 'src/app/shared/services/enrollment-types.service';
import { EventItem } from 'src/app/shared/services/event';
import { MajorEventItem, MajorEventSubscription } from 'src/app/shared/services/major-event.service';
import { Timestamp } from '@firebase/firestore-types';

import { parse } from 'twemoji-parser';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate } from '@angular/common';

import { documentId } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';

import { PDFDocument } from 'pdf-lib';
import * as fontkit from '@pdf-lib/fontkit';
import { HttpClient } from '@angular/common/http';

import * as QRCode from 'qrcode';

@Component({
  selector: 'app-page-more-info',
  templateUrl: './page-more-info.page.html',
  styleUrls: ['./page-more-info.page.scss'],
})
export class PageMoreInfoPage implements OnInit {
  majorEventID: string;

  majorEvent$: Observable<MajorEventItem>;

  subscribedEvents$: Observable<EventItem[]>;
  notSubscribedEvents$: Observable<EventItem[]>;

  majorEventSubscription$: Observable<MajorEventSubscription>;

  subscriptionType: Promise<number>;

  constructor(
    public afs: AngularFirestore,
    public auth: AngularFireAuth,
    public enrollmentTypes: EnrollmentTypesService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // TODO: If event or subscription doesn't exist, redirect

    this.majorEventID = this.route.snapshot.paramMap.get('majorEventID');
    this.majorEvent$ = this.afs
      .doc<MajorEventItem>(`majorEvents/${this.majorEventID}`)
      .valueChanges({ idField: 'id' })
      .pipe(trace('firestore'));

    this.auth.user.pipe(take(1), trace('auth')).subscribe((user) => {
      if (user) {
        const query = this.afs.doc<MajorEventSubscription>(
          `majorEvents/${this.majorEventID}/subscriptions/${user.uid}`
        );

        query
          .get()
          .pipe(trace('firestore'), take(1))
          .subscribe((document) => {
            const data = document.data() as MajorEventSubscription;
            const subscribedEventsObservables: Array<Observable<EventItem[]>> = [];
            for (let i = 0; i < data.subscribedToEvents.length; i += 10) {
              subscribedEventsObservables.push(
                this.afs
                  .collection<EventItem>('events', (ref) =>
                    ref.where(documentId(), 'in', data.subscribedToEvents.slice(i, i + 10))
                  )
                  .valueChanges({ idField: 'id' })
                  .pipe(trace('firestore'), take(1))
              );
            }

            this.subscribedEvents$ = combineLatest(subscribedEventsObservables).pipe(
              map((events) => {
                const data = events.flat();
                return data.sort((a, b) => a.eventStartDate.seconds - b.eventStartDate.seconds);
              })
            );

            // TODO: Due to firestore limitations, we can't order this query when using "not-in"
            // TODO: Doesn't work if array.length > 10
            this.notSubscribedEvents$ = this.afs
              .collection<EventItem>('events', (ref) => ref.where(documentId(), 'not-in', data.subscribedToEvents))
              .valueChanges({ idField: 'id' })
              .pipe(trace('firestore'), take(1));
          });

        this.majorEventSubscription$ = query.valueChanges({ idField: 'id' }).pipe(trace('firestore'), take(1));
      }
    });
  }

  getEnrollmentPrice(majorEventPrice: MajorEventItem['price'], enrollmentType: Promise<number>): Promise<number> {
    return new Promise((resolve) => {
      enrollmentType.then((type) => {
        switch (type) {
          case 0:
            return resolve(majorEventPrice.students);
          case 1:
            return resolve(majorEventPrice.otherStudents);
          case 2:
            return resolve(majorEventPrice.professors);
        }
      });
    });
  }

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }

  formatDate(date: Date): string {
    let formated = formatDate(date, "EEEE, dd 'de' MMMM 'de' yyyy", 'pt-BR');

    formated = formated.charAt(0).toUpperCase() + formated.slice(1);
    return formated;
  }

  dayCompare(date1: Timestamp, date2: Timestamp): boolean {
    return isSameDay(fromUnixTime(date1.seconds), fromUnixTime(date2.seconds));
  }

  getEmoji(emoji: string): any {
    if (emoji === undefined) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(parse('❔')[0].url);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(parse(emoji)[0].url);
  }

  async getCertificate() {
    const testData = {
      template: 'cacic.pdf',
      certificate: {
        name: 'Pedro de Alcântara João Carlos Leopoldo Salvador Bibiano Francisco Xavier de Paula Leocádio Miguel Gabriel Rafael Gonzaga',
        event: 'SECOMPP22',
        eventType: 'no evento',
        date: '13 de dezembro de 2022',
        content: 'Teste',
        document: 'CPF: 000.000.000-00',
        participation: 'Certificamos a participação de',
      },
    };

    const pdf = this.http.get(`assets/certificates/templates/${testData.template}`, { responseType: 'blob' });
    pdf.pipe(take(1)).subscribe(async (pdf) => {
      const pdfBase64 = await this.convertBlobToBase64(pdf);
      const pdfDoc = await PDFDocument.load(pdfBase64);

      const interRegular = await fetch(
        'https://cdn.jsdelivr.net/gh/rsms/inter@master/docs/font-files/Inter-Regular.woff2'
      ).then((res) => res.arrayBuffer());

      const interMedium = await fetch(
        'https://cdn.jsdelivr.net/gh/rsms/inter@master/docs/font-files/Inter-Medium.woff2'
      ).then((res) => res.arrayBuffer());

      pdfDoc.registerFontkit(fontkit);

      pdfDoc.embedFont(interRegular);
      pdfDoc.embedFont(interMedium);

      const form = pdfDoc.getForm();

      const nameField = form.getTextField('name');
      const name_smallField = form.getTextField('name_small');
      const event_nameField = form.getTextField('event_name');
      const event_name_smallField = form.getTextField('event_name_small');
      const event_typeField = form.getTextField('event_type');
      const dateField = form.getTextField('date');
      const documentField = form.getTextField('document');
      const qr_codeImageField = form.getButton('qr_code');
      const urlField = form.getTextField('url');
      const participationField = form.getTextField('participation');
      const contentField = form.getTextField('content');

      const verificationBaseUrl = 'https://fct-pp.web.app/certificado/verificar/';
      const verificationUrl = verificationBaseUrl + this.majorEventID;

      // Create QR Code from URL
      const qrCode = await QRCode.toDataURL(verificationUrl, { errorCorrectionLevel: 'H' });

      nameField.setText(testData.certificate.name);
      name_smallField.setText(testData.certificate.name);
      event_nameField.setText(testData.certificate.event);
      event_name_smallField.setText(testData.certificate.event);
      event_typeField.setText(testData.certificate.eventType);
      urlField.setText(verificationUrl);
      dateField.setText(testData.certificate.date);
      documentField.setText(testData.certificate.document);
      qr_codeImageField.setImage(await pdfDoc.embedPng(qrCode));
      participationField.setText(testData.certificate.participation);
      contentField.setText(testData.certificate.content);

      form.flatten();

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

      const pdfUrl = URL.createObjectURL(pdfBlob);

      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'certificate.pdf';
      a.click();
    });
  }

  convertBlobToBase64(pdf: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(pdf);
    });
  }
}
