import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageConfirmAttendance } from './page-confirm-attendance';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageConfirmAttendanceRoutingModule {}
