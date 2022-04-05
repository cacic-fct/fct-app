import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageAttendanceCollectPage } from './page-attendance-collect.page';

const routes: Routes = [
  {
    path: '',
    component: PageAttendanceCollectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageAttendanceCollectPageRoutingModule {}
