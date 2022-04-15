import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageAttendanceCollectPageRoutingModule } from './page-attendance-collect-routing.module';

import { PageAttendanceCollectPage } from './page-attendance-collect.page';
import { EventListModule } from '../shared/components/event-list/event-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageAttendanceCollectPageRoutingModule,
    EventListModule
  ],
  declarations: [PageAttendanceCollectPage],
})
export class PageAttendanceCollectPageModule {}
