import { RouterModule, Routes } from '@angular/router';
import { ListSubscriptionsPage } from './list-subscriptions';

const routes: Routes = [
  {
    path: '',
    component: ListSubscriptionsPage,
  },
];

export class ListSubscriptionsPageRoutingModule {}
