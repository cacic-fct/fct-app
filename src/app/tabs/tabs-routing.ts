// @ts-strict-ignore
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

import { canActivate } from '@angular/fire/compat/auth-guard';
import { caAndGreater } from '../shared/services/routing/guards.service';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/calendario',
        pathMatch: 'full',
      },
      {
        path: 'calendario',
        title: 'Calendário de eventos',
        loadComponent: () => import('src/app/tabs/calendar/calendar.page').then((m) => m.CalendarPage),
      },
      {
        path: 'eventos',
        title: 'Lista de eventos',
        loadComponent: () =>
          import('src/app/tabs/major-events-display/major-events-display.page').then((m) => m.MajorEventsDisplayPage),
      },
      {
        path: 'mapa',
        title: 'Mapa',
        loadComponent: () => import('src/app/tabs/map/map.page').then((m) => m.MapPage),
      },
      {
        path: 'menu',
        title: 'Menu',
        loadComponent: () => import('src/app/tabs/menu/menu.page').then((m) => m.MenuPage),
      },
      {
        path: 'area-restrita',
        title: 'Área restrita',
        loadComponent: () => import('src/app/restricted-area/restricted-area.page').then((m) => m.RestrictedAreaPage),
        ...canActivate(caAndGreater),
      },
    ],
  },
];

export class TabsPageRoutingModule {}
