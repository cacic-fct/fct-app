import { Routes, RouterModule } from '@angular/router';

import { AboutPage } from './about.page';

export const routes: Routes = [
  {
    path: '',
    component: AboutPage,
  },
  {
    path: 'suporte',
    title: 'Suporte',
    loadComponent: () => import('src/app/about/support/support.page').then((m) => m.SupportPage),
  },
];
