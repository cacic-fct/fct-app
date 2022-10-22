import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageManageAdminsPage } from './page-manage-admins.page';

const routes: Routes = [
  {
    path: '',
    component: PageManageAdminsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageManageAdminsPageRoutingModule {}
