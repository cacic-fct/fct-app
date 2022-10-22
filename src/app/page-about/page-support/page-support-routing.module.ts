import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageSupportPage } from './page-support.page';

const routes: Routes = [
  {
    path: '',
    component: PageSupportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageSupportPageRoutingModule {}
