import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddMajorEventPage } from './add-major-event.page';

const routes: Routes = [
  {
    path: '',
    component: AddMajorEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMajorEventPageRoutingModule {}
