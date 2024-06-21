import { Routes } from '@angular/router';

import { AboutPage } from './about.page';

export const routes: Routes = [
  {
    path: '',
    component: AboutPage,
  },
  {
    path: 'suporte',
    title: 'Suporte',
    data: { preload: true },
    loadChildren: () => import('src/app/about/support/support.routes').then((m) => m.routes),
  },
];
