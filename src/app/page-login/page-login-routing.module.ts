import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageLoginPage } from './page-login.page';

const routes: Routes = [
  {
    path: '',
    component: PageLoginPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageLoginPageRoutingModule {}
