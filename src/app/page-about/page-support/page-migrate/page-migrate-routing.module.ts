import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageMigratePage } from './page-migrate.page';

const routes: Routes = [
  {
    path: '',
    component: PageMigratePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageMigratePageRoutingModule {}
