import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageMajorEventsPageRoutingModule } from './page-major-events-routing.module';

import { PageMajorEventsPage } from './page-major-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageMajorEventsPageRoutingModule
  ],
  declarations: [PageMajorEventsPage]
})
export class PageMajorEventsPageModule {}
