import { Routes, RouterModule } from '@angular/router';

import { MoreInfoPage } from './more-info.page';

export const routes: Routes = [
  {
    path: '',
    component: MoreInfoPage,
  },
  {
    path: 'evento/:eventID',
    title: 'Informações do evento',
    loadComponent: () =>
      import('src/app/tabs/calendar/event-info-display/event-info-display.page').then((m) => m.EventInfoDisplayPage),
  },
];
