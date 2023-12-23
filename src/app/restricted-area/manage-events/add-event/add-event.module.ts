import { ConfirmModalPage } from './confirm-modal/confirm-modal.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddEventPageRoutingModule } from './add-event-routing.module';
import { AddEventPage } from './add-event.page';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddEventPageRoutingModule,
    SweetAlert2Module,
    AddEventPage, ConfirmModalPage,
],
})
export class AddEventPageModule {}
