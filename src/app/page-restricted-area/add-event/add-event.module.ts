import { ConfirmModalPageModule } from './confirm-modal/confirm-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddEventPageRoutingModule } from './add-event-routing.module';
import { AddEventPage } from './add-event.page';
import { SafeModule } from '../../shared/pipes/safe.module';
import { MajorEventsService } from 'src/app/shared/services/majorEvents.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddEventPageRoutingModule,
    SafeModule,
    ConfirmModalPageModule,
    SweetAlert2Module,
  ],
  declarations: [AddEventPage],
  providers: [MajorEventsService],
})
export class AddEventPageModule {}
