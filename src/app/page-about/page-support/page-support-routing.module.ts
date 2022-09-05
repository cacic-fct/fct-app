import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageSupportPage } from './page-support.page';

const routes: Routes = [
  {
    path: '',
    component: PageSupportPage,
  },
  {
    path: 'migrar',
    loadChildren: () => import('./page-migrate/page-migrate.module').then((m) => m.PageMigratePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageSupportPageRoutingModule {}
