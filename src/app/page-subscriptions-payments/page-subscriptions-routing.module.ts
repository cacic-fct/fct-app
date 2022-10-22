import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageSubscriptionsPage } from './page-subscriptions.page';

const routes: Routes = [
  {
    path: '',
    component: PageSubscriptionsPage,
  },
  {
    path: 'pagar/:eventID',
    title: 'Pagar evento',
    loadChildren: () => import('./page-pay/page-pay.module').then((m) => m.PagePayPageModule),
  },
  {
    path: 'detalhes/:majorEventID',
    title: 'Detalhes da inscrição',
    loadChildren: () => import('./page-more-info/page-more-info.module').then((m) => m.PageMoreInfoPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageSubscriptionsPageRoutingModule {}
