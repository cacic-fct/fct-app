import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ValidateReceiptPageRoutingModule } from './validate-receipt-routing.module';
import { ValidateReceiptPage } from './validate-receipt.page';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        ValidateReceiptPageRoutingModule,
        SweetAlert2Module,
        ValidateReceiptPage,
    ],
})
export class ValidateReceiptPageModule {}
