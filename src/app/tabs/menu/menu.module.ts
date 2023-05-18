import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabMenuPage } from './menu.page';

import { TabMenuPageRoutingModule } from './menu-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: TabMenuPage }]),
    TabMenuPageRoutingModule,
  ],
  declarations: [TabMenuPage],
})
export class TabMenuPageModule {}
