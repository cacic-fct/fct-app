import { RouterModule, Routes } from '@angular/router';
import { CalendarPage } from './calendar.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarPage,
  },
  {
    path: 'evento/:eventID',
    title: 'Informações do evento',
    loadComponent: () => import('./event-info-display/event-info-display.page').then((m) => m.EventInfoDisplayPage),
  },
];

export class CalendarPageRoutingModule {}
