import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageSubscriptionsPage } from './page-subscriptions.page';

const routes: Routes = [
  {
    path: '',
    component: PageSubscriptionsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageSubscriptionsPageRoutingModule {}
