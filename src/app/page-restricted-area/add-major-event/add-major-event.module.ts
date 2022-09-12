import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMajorEventPageRoutingModule } from './add-major-event-routing.module';

import { AddMajorEventPage } from './add-major-event.page';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, AddMajorEventPageRoutingModule],
  declarations: [AddMajorEventPage, ConfirmModalComponent],
})
export class AddMajorEventPageModule {}
