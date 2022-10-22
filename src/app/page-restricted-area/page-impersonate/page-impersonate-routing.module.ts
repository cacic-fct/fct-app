import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageImpersonatePage } from './page-impersonate.page';

const routes: Routes = [
  {
    path: '',
    component: PageImpersonatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageImpersonatePageRoutingModule {}
