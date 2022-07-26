import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageMajorEventsPage } from './page-major-events.page';

const routes: Routes = [
  {
    path: '',
    component: PageMajorEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageMajorEventsPageRoutingModule {}
