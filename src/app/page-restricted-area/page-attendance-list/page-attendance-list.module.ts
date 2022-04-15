import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageAttendanceListPageRoutingModule } from './page-attendance-list-routing.module';

import { PageAttendanceListPage } from './page-attendance-list.page';
import { EventListModule } from '../shared/components/event-list/event-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageAttendanceListPageRoutingModule,
    EventListModule
  ],
  declarations: [PageAttendanceListPage]
})
export class PageAttendanceListPageModule {}
