import { CertificateStoreData } from './../../../shared/services/certificates.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MailtoService, Mailto } from './../../../shared/services/mailto.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { filterNullish } from 'src/app/shared/services/rxjs.service';

import { User } from '@firebase/auth';

import { map, Observable, take, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserCertificateDocument, CertificateService } from 'src/app/shared/services/certificates.service';

@Component({
  selector: 'app-list-certificates',
  templateUrl: './list-certificates.component.html',
  styleUrls: ['./list-certificates.component.scss'],
})
export class ListCertificatesComponent implements OnInit {
  majorEventID!: string;
  userData: User;
  certificatesColletion$: Observable<UserCertificateDocumentLocal[]>;
  userID!: string;

  certificates$!: Observable<any>;

  constructor(
    private modalController: ModalController,
    private mailtoService: MailtoService,
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private certificateService: CertificateService,
    private toastController: ToastController
  ) {
    this.userData = JSON.parse(localStorage.getItem('user') as string);

    this.certificatesColletion$ = this.auth.user.pipe(
      filterNullish(),
      map((user) => {
        this.userID = user.uid;
        return this.afs
          .collection<UserCertificateDocument>(`/users/${user.uid}/certificates/majorEvents/${this.majorEventID}`)
          .valueChanges({ idField: 'id' })
          .pipe(
            map((certificates) =>
              certificates.map((certificate) => ({
                ...certificate,
                certificateData: this.afs
                  .doc<CertificateStoreData>(
                    `/majorEvents/${this.majorEventID}/certificates/${certificate.certificateID}`
                  )
                  .get()
                  .pipe(
                    map((certificateData) => {
                      return {
                        ...(certificateData.data() as CertificateStoreData),
                        id: certificateData.id,
                      };
                    })
                  ),
              }))
            )
          );
      }),
      switchMap((value) => value)
    );
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
      body: `Olá!\n\n\n\n\n=== Não apague os dados abaixo ===\nE-mail: ${this.userData.email}\nuid: ${this.userData.uid}\nmajorEventID: ${this.majorEventID}\n`,
    };
    this.mailtoService.open(mailto);
  }

  async getCertificate(event: any, certificateData: CertificateStoreData, certificate: UserCertificateDocumentLocal) {
    event.target.disabled = true;

    this.certificateService.generateCertificate(this.majorEventID, certificateData, certificate);

    event.target.disabled = false;
  }

  getCertificateData$(certificateID: string) {
    return this.afs
      .collection(`/majorEvents/${this.majorEventID}/certificates`)
      .doc(certificateID)
      .valueChanges()
      .pipe(take(1));
  }

  async copyValidationUrl(certificateID: string) {
    const toast = await this.toastController.create({
      header: 'Compartilhar certificado',
      message: 'Link copiado para a área de transferência.',
      icon: 'copy',
      position: 'bottom',
      duration: 2000,
      buttons: [
        {
          side: 'end',
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    navigator.clipboard.writeText(`https://fct-pp.web.app/certificado/validar/${this.majorEventID}-${certificateID}`);
    toast.present();
  }
}

interface UserCertificateDocumentLocal extends UserCertificateDocument {
  certificateData: Observable<CertificateStoreData>;
}
