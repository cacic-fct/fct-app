// @ts-strict-ignore
import { Routes, RouterModule } from '@angular/router';

import { RestrictedAreaPage } from './restricted-area.page';

import { canActivate } from '@angular/fire/compat/auth-guard';
import { adminOnly } from '../shared/services/routing/guards.service';

export const routes: Routes = [
  {
    path: '',
    component: RestrictedAreaPage,
  },
  {
    path: 'gerenciar-admins',
    title: 'Gerenciar admins',
    loadComponent: () =>
      import('src/app/restricted-area/manage-admins/manage-admins.page').then((m) => m.ManageAdminsPage),
    ...canActivate(adminOnly),
  },
  {
    path: 'gerenciar-grandes-eventos',
    title: 'Gerenciar grandes eventos',
    loadComponent: () => import('./manage-major-events/manage-major-events.page').then((m) => m.ManageMajorEventsPage),
    ...canActivate(adminOnly),
  },
  {
    path: 'gerenciar-eventos',
    title: 'Gerenciar eventos',
    loadComponent: () => import('./manage-events/manage-events.page').then((m) => m.ManageEventsPage),
  },
];
