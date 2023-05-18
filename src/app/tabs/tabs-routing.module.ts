// @ts-strict-ignore
import { NgModule } from '@angular/core';
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
        loadChildren: () => import('../tab-calendar/tab-calendar.module').then((m) => m.TabCalendarPageModule),
      },
      {
        path: 'eventos',
        title: 'Lista de eventos',
        loadChildren: () =>
          import('src/app/tabs/major-events-display/major-events-display.module').then(
            (m) => m.MajorEventsDisplayPageModule
          ),
      },
      {
        path: 'mapa',
        title: 'Mapa',
        loadChildren: () => import('src/app/tabs/map/map.module').then((m) => m.TabMapPageModule),
      },
      {
        path: 'menu',
        title: 'Menu',
        loadChildren: () => import('src/app/tabs/menu/menu.module').then((m) => m.TabMenuPageModule),
      },
      {
        path: 'area-restrita',
        title: 'Área restrita',
        loadChildren: () =>
          import('../page-restricted-area/page-restricted-area.module').then((m) => m.PageRestrictedAreaPageModule),
        ...canActivate(caAndGreater),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
