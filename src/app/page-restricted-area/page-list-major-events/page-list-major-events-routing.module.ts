import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageListMajorEventsPage } from './page-list-major-events.page';

const routes: Routes = [
  {
    path: '',
    component: PageListMajorEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageListMajorEventsPageRoutingModule {}
