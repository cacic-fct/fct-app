import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PopulateDatabasePageRoutingModule } from './populate-database-routing.module';

import { PopulateDatabasePage } from './populate-database.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PopulateDatabasePageRoutingModule
  ],
  declarations: [PopulateDatabasePage]
})
export class PopulateDatabasePageModule {}
