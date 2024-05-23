import { Component, inject, signal, WritableSignal } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { environment } from 'src/environments/environment';
import { AsyncPipe } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonCard,
  IonItem,
  IonLabel,
  IonRouterLink,
  IonGrid,
  IonCol,
  IonRow,
  IonAvatar,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { ClickStopPropagation } from 'src/app/shared/directives/click-stop-propagation';
import { SupabaseAuthService } from 'src/app/shared/services/supabase-auth.service';
import { Observable } from 'rxjs';
import { User } from '@supabase/supabase-js';

@UntilDestroy()
@Component({
  selector: 'app-menu',
  templateUrl: 'menu.page.html',
  styleUrls: ['menu.page.scss'],
  standalone: true,
  imports: [
    IonAvatar,
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonCard,
    IonItem,
    IonLabel,
    IonRouterLink,
    RouterLink,
    IonGrid,
    IonCol,
    IonRow,
    ClickStopPropagation,
  ],
})
export class MenuPage {
  private auth = inject(SupabaseAuthService);

  user$: Observable<User | null> = this.auth.$user;

  isProduction: boolean = environment.production;
  userData: WritableSignal<User | null> = signal(null);

  constructor() {}

  ngOnInit() {
    this.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user) {
        this.userData.set(user);
      } else {
        this.userData.set(null);
      }
    });
  }
}
