import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagePayPageRoutingModule } from './page-pay-routing.module';

import { PagePayPage } from './page-pay.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagePayPageRoutingModule
  ],
  declarations: [PagePayPage]
})
export class PagePayPageModule {}
