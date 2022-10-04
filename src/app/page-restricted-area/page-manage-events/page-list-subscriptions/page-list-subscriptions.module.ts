import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageListSubscriptionsRoutingModule } from './page-list-subscriptions-routing.module';
import { PageListSubscriptions } from './page-list-subscriptions';

@NgModule({
  declarations: [PageListSubscriptions],
  imports: [CommonModule, PageListSubscriptionsRoutingModule],
})
export class PageListSubscriptionsModule {}
