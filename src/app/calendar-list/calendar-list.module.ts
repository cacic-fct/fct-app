import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarListPageRoutingModule } from './calendar-list-routing.module';

import { CalendarListPage } from './calendar-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarListPageRoutingModule,
  ],
  declarations: [CalendarListPage],
})
export class CalendarListPageModule {}
