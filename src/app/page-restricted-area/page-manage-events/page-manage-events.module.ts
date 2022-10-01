import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageManageEventsRoutingModule } from './page-manage-events-routing.module';
import { IonicModule } from '@ionic/angular';
import { PageManageEvents } from './page-manage-events.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PageManageEventsRoutingModule,
  ],
  declarations: [PageManageEvents],
})
export class PageManageEventsPageModule { }
