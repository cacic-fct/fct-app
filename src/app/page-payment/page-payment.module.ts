import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagePaymentPageRoutingModule } from './page-payment-routing.module';

import { PagePaymentPage } from './page-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagePaymentPageRoutingModule
  ],
  declarations: [PagePaymentPage]
})
export class PagePaymentPageModule {}
