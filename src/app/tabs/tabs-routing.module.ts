import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

import {
  AngularFireAuthGuard,
  hasCustomClaim,
} from '@angular/fire/compat/auth-guard';

import { canActivate } from '@angular/fire/compat/auth-guard';

const adminOnly = () => hasCustomClaim('admin');

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
        loadChildren: () =>
          import('../tab-calendar/tab-calendar.module').then(
            (m) => m.TabCalendarPageModule
          ),
      },
      {
        path: 'mapa',
        loadChildren: () =>
          import('../tab-map/tab-map.module').then((m) => m.TabMapPageModule),
      },
      {
        path: 'menu',
        loadChildren: () =>
          import('../tab-info/tab-info.module').then(
            (m) => m.TabInfoPageModule
          ),
      },
      {
        path: 'area-restrita',
        loadChildren: () =>
          import('../page-restricted-area/page-restricted-area.module').then(
            (m) => m.PageRestrictedAreaPageModule
          ),
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: adminOnly },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
