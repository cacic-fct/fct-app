import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagePaymentPage } from './page-payment.page';

const routes: Routes = [
  {
    path: '',
    component: PagePaymentPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagePaymentPageRoutingModule {}
