import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarListPage } from './calendar-list.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarListPageRoutingModule {}
