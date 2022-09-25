import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageConfirmSubscriptionPage } from './page-confirm-subscription.page';

const routes: Routes = [
  {
    path: '',
    component: PageConfirmSubscriptionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageConfirmSubscriptionPageRoutingModule {}
