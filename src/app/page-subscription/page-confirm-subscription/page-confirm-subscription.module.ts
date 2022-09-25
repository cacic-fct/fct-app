import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageConfirmSubscriptionPage } from './page-confirm-subscription.page';

import { PageConfirmSubscriptionPageRoutingModule } from './page-confirm-subscription-routing.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PageConfirmSubscriptionPageRoutingModule,
    SweetAlert2Module,
  ],
  declarations: [PageConfirmSubscriptionPage],
})
export class PageConfirmSubscriptionPageModule {}
