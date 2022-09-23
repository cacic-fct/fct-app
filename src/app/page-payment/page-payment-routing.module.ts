import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagePaymentPage } from './page-payment.page';

const routes: Routes = [
  {
    path: '',
    component: PagePaymentPage,
  },
  {
    path: 'pagar/:eventID',
    loadChildren: () => import('./page-pay/page-pay.module').then((m) => m.PagePayPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagePaymentPageRoutingModule {}
