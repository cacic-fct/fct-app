// @ts-strict-ignore
import { Component, inject } from '@angular/core';

import { AuthService } from '../shared/services/auth.service';

import { trace } from '@angular/fire/compat/performance';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { environment } from 'src/environments/environment';
import { Auth, user, User } from '@angular/fire/auth';

@UntilDestroy()
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab-menu.page.html',
  styleUrls: ['tab-menu.page.scss'],
})
export class TabMenuPage {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);

  isProduction: boolean = environment.production;
  userData: User;
  firstName: string;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.user$.pipe(untilDestroyed(this), trace('auth')).subscribe((user) => {
      if (user) {
        this.userData = user;
        this.firstName = this.userData.displayName.split(' ')[0];
      }
    });
  }
}
