import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageAttendanceListPageRoutingModule } from './page-attendance-list-routing.module';

import { PageAttendanceListPage } from './page-attendance-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageAttendanceListPageRoutingModule
  ],
  declarations: [PageAttendanceListPage]
})
export class PageAttendanceListPageModule {}
