import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidateReceiptPageRoutingModule } from './validate-receipt-routing.module';

import { ValidateReceiptPage } from './validate-receipt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidateReceiptPageRoutingModule
  ],
  declarations: [ValidateReceiptPage]
})
export class ValidateReceiptPageModule {}
