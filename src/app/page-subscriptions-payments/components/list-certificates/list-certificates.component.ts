import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MailtoService, Mailto } from './../../../shared/services/mailto.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { isDefined } from 'src/app/shared/services/rxjs.service';

import { User } from '@firebase/auth';

import { first, map, Observable, take, switchMap, combineLatest } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserCertificateDocument, CertificateService } from 'src/app/shared/services/certificates.service';

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

  certificates$!: Observable<any>;

  constructor(
    private modalController: ModalController,
    private mailtoService: MailtoService,
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private certificateService: CertificateService
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

    // this.certificates$ = this.certificatesColletion$.pipe(
    //   map((certificates) => {
    //     return certificates.map((certificate) => {
    //       const options = {
    //         name: this.userData.displayName,
    //         event_name: certificate.eventName,

    //         date: certificate.eventDate,
    //         event_name_small: certificate.eventName,
    //         name_small: this.userData.displayName,
    //         certificateID: certificate.id,
    //         userID: this.userID,
    //       };
    //       return options;
    //     });
    //   })
    // );

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
    this.certificateService.generateCertificate(
      this.majorEventID,
      {
        certificateName: 'nombre',
        certificateID: 've3n3KJqD1imLKJgeYTw',
        eventType: 'algo',
        participationType: 'algo',
      },
      'cacic'
    );
  }
}
