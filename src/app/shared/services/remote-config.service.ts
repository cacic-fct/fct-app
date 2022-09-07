// Attribution:
// Guillaume Monnet and contributors
// https://github.com/mockoon/mockoon/blob/e9f5644aac858c9b88c06c89668cb90c211ca177/packages/desktop/src/renderer/app/services/remote-config.service.ts

import { Injectable } from '@angular/core';
import { fetchAndActivate, getValueChanges, RemoteConfig } from '@angular/fire/remote-config';
import { from, Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class RemoteConfigService {
  private cache$: Observable<RemoteConfigData>;

  constructor(private remoteConfig: RemoteConfig) {}

  /**
   * Get a remote config specific property
   *
   * @param path
   */
  public get<T extends keyof RemoteConfigData>(path: T): Observable<RemoteConfigData[T]> {
    return this.getConfig().pipe(map((remoteConfig) => remoteConfig?.[path]));
  }

  /**
   * Handles caching the observable declaration and sharing the subscription.
   * It will only call the remote config API once and share the subscription.
   */
  private getConfig() {
    if (!this.cache$) {
      this.cache$ = this.fetchConfig().pipe(shareReplay(1));
    }

    return this.cache$;
  }

  /**
   * Fetch the remote config, filter per environment, convert to object
   */
  private fetchConfig(): Observable<any> {
    this.remoteConfig.defaultConfig = {
      calendarItemViewDefault: false,
      mapTabEnabled: true,
      manualTabEnabled: false,
      eventsTabEnabled: true,
      registerPrompt: true,
    };
    return from(fetchAndActivate(this.remoteConfig)).pipe(
      switchMap(() => getValueChanges(this.remoteConfig, environment.remoteConfig)),
      map((config) => JSON.parse(config.asString()))
    );
  }
}

interface RemoteConfigData {
  calendarItemViewDefault: boolean;
  mapTabEnabled: boolean;
  manualTabEnabled: boolean;
  eventsTabEnabled: boolean;
  registerPrompt: boolean;
}
