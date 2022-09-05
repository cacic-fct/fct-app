import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageListMajorEventsPageRoutingModule } from './page-list-major-events-routing.module';

import { PageListMajorEventsPage } from './page-list-major-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageListMajorEventsPageRoutingModule
  ],
  declarations: [PageListMajorEventsPage]
})
export class PageListMajorEventsPageModule {}
