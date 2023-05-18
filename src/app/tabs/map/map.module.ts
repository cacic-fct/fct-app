import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabMapPage } from './map.page';

import { TabMapPageRoutingModule } from './map-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, TabMapPageRoutingModule],
  declarations: [TabMapPage],
})
export class TabMapPageModule {}
