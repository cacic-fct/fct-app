import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageRestrictedAreaPage } from './page-restricted-area.page';

const routes: Routes = [
  {
    path: '',
    component: PageRestrictedAreaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRestrictedAreaPageRoutingModule {}
