import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCardHeader,
  IonCard,
  IonCardTitle,
  IonItem,
  IonButton,
  IonLabel,
  IonInput,
  IonCardContent,
  IonText,
  IonBackButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { ExplanationCardComponent } from 'src/app/settings/components/explanation-card/explanation-card.component';
import { addIcons } from 'ionicons';
import { copy, idCardOutline } from 'ionicons/icons';
import { Auth, user, User as FirebaseUser } from '@angular/fire/auth';
import { Observable, of, switchMap, take } from 'rxjs';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { User } from 'src/app/shared/services/user';
import { AlertController, ToastController } from '@ionic/angular/standalone';
import { PlausibleService } from '@notiz/ngx-plausible';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-id-code',
  templateUrl: './id-code.page.html',
  styleUrls: ['./id-code.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonBackButton,
    IonText,
    IonCardContent,
    IonInput,
    IonLabel,
    IonButton,
    IonItem,
    IonCardTitle,
    IonCard,
    IonCardHeader,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ExplanationCardComponent,
    RouterLink,
  ],
})
export class IdCodePage implements OnInit {
  @Input() copy?: boolean;

  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  user$: Observable<User | null>;
  userFirebase$: Observable<FirebaseUser | null> = user(this.auth);

  private toastController = inject(ToastController);
  private alertController = inject(AlertController);

  private plausible: PlausibleService = inject(PlausibleService);

  constructor() {
    addIcons({
      idCardOutline,
      copy,
    });

    this.user$ = this.userFirebase$.pipe(
      take(1),
      switchMap((user) => {
        if (user) {
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          return docData(userDocRef) as Observable<User>;
        } else {
          return of(null);
        }
      }),
    );
  }

  ngOnInit(): void {
    if (this.copy) {
      this.copyCode('alert');
    }
  }

  copyCode(mode: 'toast' | 'alert') {
    this.userFirebase$.pipe(take(1)).subscribe((user) => {
      if (user) {
        navigator.clipboard.writeText(user.uid);
        this.plausible.event('ID Copy Event', { props: { method: 'button', user: user.uid } });
        switch (mode) {
          case 'toast':
            this.presentToastShare();
            break;
          case 'alert':
            this.presentAlertShare();
            break;
        }
      }
    });
  }

  async presentToastShare() {
    const toast = await this.toastController.create({
      header: 'Código de identificação',
      message: 'Código copiado para a área de transferência.',
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
    toast.present();
  }

  async presentAlertShare() {
    const alert = await this.alertController.create({
      header: 'Código de identificação',
      message: 'Código copiado para a área de transferência.',
      buttons: ['OK'],
    });
    alert.present();
  }
}
