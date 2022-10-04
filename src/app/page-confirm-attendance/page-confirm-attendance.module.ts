import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageConfirmAttendanceRoutingModule } from './page-confirm-attendance-routing.module';
import { PageConfirmAttendance } from './page-confirm-attendance';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [PageConfirmAttendance],
  imports: [CommonModule, IonicModule, PageConfirmAttendanceRoutingModule],
})
export class PageConfirmAttendanceModule {}
