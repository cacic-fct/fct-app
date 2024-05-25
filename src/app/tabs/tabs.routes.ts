import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

import { canActivate } from '@angular/fire/compat/auth-guard';
import { caAndGreater, redirectLoggedInToCalendar } from '../shared/services/routing/guards.service';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        data: { preload: true },
        loadComponent: () => import('src/app/landing/landing.page').then((m) => m.LandingPage),
        ...canActivate(redirectLoggedInToCalendar),
      },
      {
        path: 'calendario',
        title: 'Calendário de eventos',
        loadChildren: () => import('src/app/tabs/calendar/calendar.routes').then((m) => m.routes),
      },
      {
        path: 'eventos',
        title: 'Lista de eventos',
        loadChildren: () =>
          import('src/app/tabs/major-events-display/major-events-display.routes').then((m) => m.routes),
      },
      {
        path: 'mapa',
        title: 'Mapa',
        loadChildren: () => import('src/app/tabs/map/map.routes').then((m) => m.routes),
      },
      {
        path: 'menu',
        title: 'Menu',
        loadChildren: () => import('src/app/tabs/menu/menu.routes').then((m) => m.routes),
      },
      {
        path: 'area-restrita',
        title: 'Ferramentas administrativas',
        loadChildren: () => import('src/app/restricted-area/restricted-area.routes').then((m) => m.routes),
        ...canActivate(caAndGreater),
      },
    ],
  },
];
