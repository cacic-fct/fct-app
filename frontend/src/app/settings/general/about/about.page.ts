import { Component, inject } from '@angular/core';
import { GlobalConstantsService } from '../../../shared/services/global-constants.service';
import { RouterLink } from '@angular/router';
import {
  IonRouterLink,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonNote,
  IonLabel,
  IonCard,
  IonCardTitle,
  IonIcon,
} from '@ionic/angular/standalone';
import { ServiceWorkerService } from 'src/app/shared/services/service-worker/service-worker.service';
import { addIcons } from 'ionicons';
import { bookOutline, copy, logoGithub, peopleOutline } from 'ionicons/icons';
import { ToastController } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonCardTitle,
    IonCard,
    IonLabel,
    IonNote,
    IonItem,
    RouterLink,
    IonRouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class AboutPage {
  sw = inject(ServiceWorkerService);
  gc = GlobalConstantsService;
  analytics: boolean;
  monitoring: boolean;
  environment = environment;
  versionHash: string;

  private toastController = inject(ToastController);

  constructor() {
    const analytics = localStorage.getItem('disable-analytics');
    const monitoring = localStorage.getItem('disable-monitoring');

    if (analytics === 'true') {
      this.analytics = false;
    } else {
      this.analytics = true;
    }

    if (monitoring === 'true') {
      this.monitoring = false;
    } else {
      this.monitoring = true;
    }

    this.versionHash = this.formatVersion(environment.appVersion);

    addIcons({
      bookOutline,
      logoGithub,
      peopleOutline,
      copy,
    });
  }

  formatVersion(hash: string): string {
    return hash.substring(0, 8);
  }

  async copyAppVersion(version: string) {
    const toast = await this.toastController.create({
      header: 'App version',
      message: 'Copiado para a área de transferência.',
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
    navigator.clipboard.writeText(version);
    toast.present();
    return;
  }
}
