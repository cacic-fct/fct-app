// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    projectId: 'fct-pp',
    appId: '1:169157391934:web:ba031cc3f7dcafc057c36f',
    storageBucket: 'fct-pp.appspot.com',
    locationId: 'southamerica-east1',
    apiKey: 'AIzaSyAGtd5nwgEC68dvzTtA1TvCt9LGZ9luWhk',
    authDomain: 'fct-pp.web.app',
    messagingSenderId: '169157391934',
    measurementId: 'G-BKYCC0GR6G',
    useEmulators: true,
  },
  recaptcha3SiteKey: '6LcFr9AdAAAAANB7MbCks-nBVqfZZYp8bGp6Kcto',
  supabase: {
    url: 'https://supabase.yudi.me',
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzEyNzE4MDAwLAogICJleHAiOiAxODcwNDg0NDAwCn0.uw1mpsYyrLzPnDfs4xjVNcwurDoS6Y9u8gZggSqmRDo',
  },
  version: import.meta.env['NG_APP_VERSION'] || 'Versão desconhecida',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
