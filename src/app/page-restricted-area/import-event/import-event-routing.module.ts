import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportEventPage } from './import-event.page';

const routes: Routes = [
  {
    path: '',
    component: ImportEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportEventPageRoutingModule {}
