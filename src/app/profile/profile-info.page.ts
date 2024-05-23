import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

import { AsyncPipe } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonIcon,
  IonContent,
  IonCard,
  IonAvatar,
  IonCardTitle,
  IonSkeletonText,
  IonButton,
  IonRouterLink,
  IonLabel,
  IonCol,
  IonItem,
  IonGrid,
  IonRow,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

import { Mailto, MailtoService } from 'src/app/shared/services/mailto.service';
import { SupabaseAuthService } from 'src/app/shared/services/supabase-auth.service';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.page.html',
  styleUrls: ['./profile-info.page.scss'],
  standalone: true,
  imports: [
    IonRow,
    IonGrid,
    IonItem,
    IonCol,
    IonLabel,
    IonRouterLink,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonIcon,
    IonContent,
    IonCard,
    IonAvatar,
    IonCardTitle,
    IonSkeletonText,
    IonButton,
    AsyncPipe,
  ],
})
export class ProfileInfoPage implements OnInit {
  private auth = inject(SupabaseAuthService);

  constructor(
    private mailtoService: MailtoService,
    private router: Router,
  ) {}

  alreadyLinked: boolean = false;
  isUnesp: boolean = false;
  userData: WritableSignal<User | null> = signal(null);

  ngOnInit() {
    this.auth.$user.subscribe((user) => {
      if (user) {
        this.userData.set(user);

        // this.afs
        //   .collection('users')
        //   .doc<User>(this.authService.userData.uid)
        //   .get()
        //   .subscribe((doc) => {
        //     this.userData = doc.data();
        //     if (this.userData.linkedPersonalEmail) {
        //       this.alreadyLinked = true;
        //     }
        //     if (this.userData.email.includes('@unesp.br')) {
        //       this.isUnesp = true;
        //     }
        //   });
      }
    });
  }

  mailtoDeleteAccount(): void {
    // const mailto: Mailto = {
    //   receiver: 'cacic.fct@gmail.com',
    //   subject: '[FCT-App] Excluir meu cadastro',
    //   body: `Olá!\nEu gostaria que a minha conta fosse excluída.\n\n=== Não apague os dados abaixo ===\nE-mail: ${
    //     this.userData.email
    //   }\nCelular: ${this.userData.phone}\n${
    //     this.isUnesp ? ('Vinculou e-mail pessoal:' + this.alreadyLinked ? 'Sim' : 'Não' + '\n') : ''
    //   }`,
    // };
    // this.mailtoService.open(mailto);
  }

  logout() {
    this.auth.signOut();

    this.router.navigate(['/login']);
  }
}
