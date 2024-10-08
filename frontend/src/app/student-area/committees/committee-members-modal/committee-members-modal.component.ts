import { DatePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  IonList,
  IonItem,
  IonLabel,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  ModalController,
  IonCol,
  IonRow,
  AlertController,
  IonNote,
} from '@ionic/angular/standalone';
import { Committee } from 'src/app/shared/services/committees.service';
import { Mailto, MailtoService } from 'src/app/shared/services/mailto.service';

@Component({
  selector: 'app-committee-members-modal',
  templateUrl: './committee-members-modal.component.html',
  styleUrls: ['./committee-members-modal.component.scss'],
  standalone: true,
  imports: [
    IonNote,
    IonRow,
    IonCol,
    IonTitle,
    IonButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonContent,
    IonLabel,
    IonItem,
    IonList,
    DatePipe,
  ],
})
export class CommitteeMembersModalComponent {
  @Input() committee: Committee;

  modalController = inject(ModalController);
  mailtoService = inject(MailtoService);
  alertController = inject(AlertController);

  close() {
    this.modalController.dismiss();
  }

  async reportAlert(committeeData: Committee): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message:
        'Se a irregularidade é grave, contate a ouvidoria local. Também verifique se é mais oportuno entrar em contato com algum professor ou diretamente com algum diretor do CACiC ao invés de enviar um e-mail à caixa de entrada coletiva do CA.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Prosseguir',
          role: 'confirm',
          handler: () => {
            this.mailtoReportIssue(committeeData.name);
          },
        },
      ],
    });

    await alert.present();
  }

  mailtoReportIssue(committeeName: string): void {
    const mailto: Mailto = {
      receiver: 'cacic.fct@gmail.com',
      subject: `[Comissões] ${committeeName} - Relatar irregularidade`,
    };
    this.mailtoService.open(mailto);
  }
}
