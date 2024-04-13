export const environment = {
  production: true,
  firebase: {
    projectId: 'fct-pp',
    appId: '1:169157391934:web:ba031cc3f7dcafc057c36f',
    storageBucket: 'fct-pp.appspot.com',
    locationId: 'southamerica-east1',
    apiKey: 'AIzaSyAGtd5nwgEC68dvzTtA1TvCt9LGZ9luWhk',
    authDomain: 'fct-pp.firebaseapp.com',
    messagingSenderId: '169157391934',
    measurementId: 'G-BKYCC0GR6G',
    useEmulators: false,
  },
  recaptcha3SiteKey: '6LcFr9AdAAAAANB7MbCks-nBVqfZZYp8bGp6Kcto',
  supabase: {
    url: 'https://supabase.yudi.me',
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzEyNzE4MDAwLAogICJleHAiOiAxODcwNDg0NDAwCn0.uw1mpsYyrLzPnDfs4xjVNcwurDoS6Y9u8gZggSqmRDo',
  },
  version: import.meta.env['NG_APP_VERSION'] || 'Versão desconhecida',
};
