import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Mailto, NgxMailtoService } from 'ngx-mailto';

import { User } from '@firebase/auth';

import {
  GeneratePdfCertificateService,
  generateCertificateOptions,
} from './../../../shared/services/generate-pdf-certificate.service';

@Component({
  selector: 'app-list-certificates',
  templateUrl: './list-certificates.component.html',
  styleUrls: ['./list-certificates.component.scss'],
})
export class ListCertificatesComponent implements OnInit {
  userData: User;

  constructor(
    private genpdf: GeneratePdfCertificateService,
    private modalController: ModalController,
    private mailtoService: NgxMailtoService
  ) {
    this.userData = JSON.parse(localStorage.getItem('user') as string);
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
