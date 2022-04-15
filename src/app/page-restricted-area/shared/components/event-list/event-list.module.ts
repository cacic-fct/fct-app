import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PageAttendanceListPageRoutingModule } from 'src/app/page-restricted-area/page-attendance-list/page-attendance-list-routing.module';
import { NgModule } from '@angular/core';
import { EventListComponent } from './event-list.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageAttendanceListPageRoutingModule,
  ],
  declarations: [
    EventListComponent,
  ],
  exports: [
    EventListComponent,
  ]
})
export class EventListModule {}