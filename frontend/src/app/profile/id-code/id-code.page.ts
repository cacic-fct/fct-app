import { Component, inject } from '@angular/core';
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
  IonIcon,
} from '@ionic/angular/standalone';
import { ExplanationCardComponent } from 'src/app/settings/components/explanation-card/explanation-card.component';
import { addIcons } from 'ionicons';
import { copy, idCardOutline, pencil } from 'ionicons/icons';
import { Auth, user, User as FirebaseUser } from '@angular/fire/auth';
import { Observable, of, switchMap, take } from 'rxjs';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { User } from 'src/app/shared/services/user';
import { ToastController } from '@ionic/angular/standalone';
import { PlausibleService } from '@notiz/ngx-plausible';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-id-code',
  templateUrl: './id-code.page.html',
  styleUrls: ['./id-code.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
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
export class IdCodePage {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  user$: Observable<User | null>;
  userFirebase$: Observable<FirebaseUser | null> = user(this.auth);

  private toastController = inject(ToastController);

  private plausible: PlausibleService = inject(PlausibleService);

  constructor() {
    addIcons({
      idCardOutline,
      copy,
      pencil,
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

  copyCode(mode: 'toast') {
    this.userFirebase$.pipe(take(1)).subscribe((user) => {
      if (user) {
        navigator.clipboard.writeText(user.uid);
        this.plausible.event('ID Copy Event', { props: { method: 'button', user: user.uid } });
        switch (mode) {
          case 'toast':
            this.presentToastCopy();
            break;
        }
      }
    });
  }

  async presentToastCopy() {
    const toast = await this.toastController.create({
      header: 'Código de identificação',
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
    toast.present();
  }
}
