import { Component, inject, signal, WritableSignal } from '@angular/core';

import { AuthService } from '../../shared/services/auth.service';

import { trace } from '@angular/fire/compat/performance';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { environment } from 'src/environments/environment';
import { Auth, authState, user, User } from '@angular/fire/auth';
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
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  authState$ = authState(this.auth);

  isProduction: boolean = environment.production;
  userData: WritableSignal<User | null> = signal(null);
  firstName: WritableSignal<string | null> = signal(null);
  lastName: WritableSignal<string | null> = signal(null);
  fullNameAbbreviation: WritableSignal<string | null> = signal(null);

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.user$.pipe(untilDestroyed(this), trace('auth')).subscribe((user) => {
      if (user) {
        this.userData.set(user);

        this.firstName.set(user.displayName.split(' ')[0]);
        this.lastName.set(user.displayName.split(' ').pop());

        const names = user.displayName.split(' ');

        if (names.length > 2) {
          this.fullNameAbbreviation.set(
            `${names[0]} ${names
              .slice(1, -1)
              .map((name) => name[0] + '.')
              .join(' ')} ${names.pop()}`,
          );
        } else {
          this.fullNameAbbreviation.set(user.displayName);
        }
      }
    });
  }
}
