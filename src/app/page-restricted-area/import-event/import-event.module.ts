import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImportEventPageRoutingModule } from './import-event-routing.module';

import { ImportEventPage } from './import-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImportEventPageRoutingModule
  ],
  declarations: [ImportEventPage]
})
export class ImportEventPageModule {}
