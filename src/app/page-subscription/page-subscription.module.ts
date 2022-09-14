import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageSubscriptionPage } from './page-subscription.page';

import { PageSubscriptionPageRoutingModule } from './page-subscription-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PageSubscriptionPageRoutingModule,
  ],
  declarations: [PageSubscriptionPage],
})
export class PageSubscriptionPageModule {}
