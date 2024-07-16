import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonButton,
  IonButtons,
  IonBackButton,
  ModalController,
} from '@ionic/angular/standalone';

import { CommitteeMembersModalComponent } from 'src/app/student-area/committees/committee-members-modal/committee-members-modal.component';

@Component({
  selector: 'app-committees',
  templateUrl: './committees.page.html',
  styleUrls: ['./committees.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButtons,
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class CommitteesPage {
  modalController = inject(ModalController);

  async openModal() {
    const modal = await this.modalController.create({
      component: CommitteeMembersModalComponent,
    });
    modal.present();
  }
}
