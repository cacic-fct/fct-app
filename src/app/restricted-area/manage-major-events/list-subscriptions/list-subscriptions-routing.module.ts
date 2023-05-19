import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSubscriptionsPage } from './list-subscriptions';

const routes: Routes = [
  {
    path: '',
    component: ListSubscriptionsPage,
  },
  {
    path: 'gerenciar-inscricao/:subscriptionID',
    loadChildren: () =>
      import('./page-manage-subscription/page-manage-subscription.module').then(
        (m) => m.PageManageSubscriptionPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListSubscriptionsPageRoutingModule {}
