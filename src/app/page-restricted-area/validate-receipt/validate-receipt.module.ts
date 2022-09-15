import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ValidateReceiptPageRoutingModule } from './validate-receipt-routing.module';
import { ValidateReceiptPage } from './validate-receipt.page';
import { GetDownloadURLPipeModule } from '@angular/fire/compat/storage';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ValidateReceiptPageRoutingModule, GetDownloadURLPipeModule],
  declarations: [ValidateReceiptPage],
})
export class ValidateReceiptPageModule {}
