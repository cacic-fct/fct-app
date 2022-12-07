import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageSearchUserPage } from './page-search-user.page';

const routes: Routes = [
  {
    path: '',
    component: PageSearchUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageSearchUserPageRoutingModule {}
