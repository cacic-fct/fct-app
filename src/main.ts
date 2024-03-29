import { enableProdMode, LOCALE_ID, isDevMode, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import {
  provideFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator,
} from '@angular/fire/firestore';
import { provideFunctions, getFunctions, connectFunctionsEmulator } from '@angular/fire/functions';
import { provideStorage, getStorage, connectStorageEmulator } from '@angular/fire/storage';
import { GlobalConstantsService } from './app/shared/services/global-constants.service';
import { provideAnalytics, getAnalytics, logEvent } from '@angular/fire/analytics';
import { provideAuth, getAuth, useDeviceLanguage, connectAuthEmulator } from '@angular/fire/auth';
import { provideRemoteConfig, getRemoteConfig, fetchAndActivate } from '@angular/fire/remote-config';
import { getApp, provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAppCheck, ReCaptchaV3Provider, initializeAppCheck } from '@angular/fire/app-check';
import { AngularFireModule } from '@angular/fire/compat';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MarkdownModule } from 'ngx-markdown';
import { withInterceptorsFromDi, provideHttpClient, HttpClient } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { routes } from 'src/app/app.routes';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import {
  SETTINGS as FIRESTORE_SETTINGS,
  USE_EMULATOR as USE_FIRESTORE_EMULATOR,
  AngularFirestoreModule,
} from '@angular/fire/compat/firestore';
import { IonicRouteStrategy, isPlatform, provideIonicAngular } from '@ionic/angular/standalone';
import { PerformanceMonitoringService, AngularFirePerformanceModule } from '@angular/fire/compat/performance';
import { PreloadingStrategyService } from 'src/app/shared/services/routing/preloading-strategy.service';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      backButtonText: isPlatform('ios') ? 'Voltar' : undefined,
    }),
    provideRouter(routes, withPreloading(PreloadingStrategyService), withComponentInputBinding()),
    importProvidersFrom(
      BrowserModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        registrationStrategy: 'registerImmediately',
      }),
      // Other modules
      MarkdownModule.forRoot({ loader: HttpClient }),
      SweetAlert2Module.forRoot(),
      // AngularFire
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule, //.enablePersistence({ synchronizeTabs: true }),
      AngularFirePerformanceModule,
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAppCheck(() => {
        const provider = new ReCaptchaV3Provider(environment.recaptcha3SiteKey);
        return initializeAppCheck(getApp(), {
          provider,
          isTokenAutoRefreshEnabled: true,
        });
      }),
      provideAuth(() => {
        const auth = getAuth();
        useDeviceLanguage(auth);
        if (environment.useEmulators) {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        }
        return auth;
      }),
      provideRemoteConfig(() => {
        const remoteConfig = getRemoteConfig();
        if (isDevMode()) {
          remoteConfig.settings.minimumFetchIntervalMillis = 10000;
          remoteConfig.settings.fetchTimeoutMillis = 60000;
        } else {
          remoteConfig.settings.minimumFetchIntervalMillis = 43200000;
          remoteConfig.settings.fetchTimeoutMillis = 60000;
        }
        remoteConfig.defaultConfig = {
          calendarItemViewDefault: true,
          mapTabEnabled: true,
          manualTabEnabled: false,
          eventsTabEnabled: true,
          registerPrompt: true,
        };
        fetchAndActivate(remoteConfig).catch((err) => {
          console.error(err);
        });
        return remoteConfig;
      }),
      provideAnalytics(() => {
        const analytics = getAnalytics();
        logEvent(analytics, 'app_version', {
          app_name: GlobalConstantsService.appName,
          app_version: GlobalConstantsService.appVersion,
        });
        return analytics;
      }),
      provideStorage(() => {
        const storage = getStorage();
        if (environment.useEmulators) {
          connectStorageEmulator(storage, 'localhost', 9199);
        }
        return storage;
      }),
      provideFunctions(() => {
        const functions = getFunctions(getApp(), 'southamerica-east1');
        if (environment.useEmulators) {
          connectFunctionsEmulator(functions, 'localhost', 5001);
        }
        return functions;
      }),
      provideFirestore(() => {
        const firestore = initializeFirestore(getApp(), {
          ignoreUndefinedProperties: true,
          // localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
        });
        if (environment.useEmulators) {
          connectFirestoreEmulator(firestore, 'localhost', 8081);
        }
        return firestore;
      })
    ),
    PerformanceMonitoringService,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: FIRESTORE_SETTINGS, useValue: { ignoreUndefinedProperties: true, merge: true } },
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.useEmulators ? ['localhost', 8081] : undefined },
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.log(err));
