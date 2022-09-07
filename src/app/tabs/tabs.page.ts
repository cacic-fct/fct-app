import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireRemoteConfig, filterFresh, scanToObject } from '@angular/fire/compat/remote-config';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { RemoteConfigService } from './../shared/services/remote-config.service';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  _isAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAdmin$: Observable<boolean> = this._isAdmin.asObservable();
  readonly manual$: Observable<boolean>;
  readonly events$: Observable<boolean>;

  constructor(public auth: AngularFireAuth, private remoteConfig: RemoteConfigService) {
    this.auth.idTokenResult.pipe(untilDestroyed(this)).subscribe((idTokenResult) => {
      const claims = idTokenResult.claims;
      if (claims.role === 1000) {
        this._isAdmin.next(true);
      }
    });

    this.manual$ = remoteConfig.get('manualTabEnabled');
    this.manual$.subscribe((manual) => {
      console.log('manualTabEnabled', manual);
    });

    this.events$ = remoteConfig.get('eventsTabEnabled');
  }
}
