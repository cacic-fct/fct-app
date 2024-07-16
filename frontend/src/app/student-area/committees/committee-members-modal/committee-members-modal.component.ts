import { Component, inject } from '@angular/core';
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
  ],
})
export class CommitteeMembersModalComponent {
  modalController = inject(ModalController);
  mailtoService = inject(MailtoService);
  alertController = inject(AlertController);

  close() {
    this.modalController.dismiss();
  }

  async reportAlert(committeeData: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message:
        'Sua denúncia será encaminhada para o e-mail do CACiC. Verifique se é mais oportuno entrar em contato com algum professor ou diretamente com algum diretor do CACiC.',
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
