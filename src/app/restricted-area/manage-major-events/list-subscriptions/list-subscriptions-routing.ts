import { RouterModule, Routes } from '@angular/router';
import { ListSubscriptionsPage } from './list-subscriptions';

const routes: Routes = [
  {
    path: '',
    component: ListSubscriptionsPage,
  },
  {
    path: 'gerenciar-inscricao/:subscriptionID',
    loadComponent: () =>
      import(
        'src/app/restricted-area/manage-major-events/list-subscriptions/manage-subscription/manage-subscription.page'
      ).then((m) => m.ManageSubscriptionPage),
  },
];

export class ListSubscriptionsPageRoutingModule {}
