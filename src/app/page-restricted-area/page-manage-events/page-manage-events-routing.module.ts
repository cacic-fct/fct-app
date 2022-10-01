import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageManageEvents } from './page-manage-events.page';

const routes: Routes = [
  {
    path: '',
    component: PageManageEvents
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageManageEventsRoutingModule { }
