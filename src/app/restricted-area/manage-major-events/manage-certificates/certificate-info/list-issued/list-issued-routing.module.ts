import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListIssuedPage } from './list-issued.page';

const routes: Routes = [
  {
    path: '',
    component: ListIssuedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListIssuedPageRoutingModule {}
