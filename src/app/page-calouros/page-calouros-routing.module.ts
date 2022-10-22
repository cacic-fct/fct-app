import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageCalourosPage } from './page-calouros.page';

const routes: Routes = [
  {
    path: '',
    component: PageCalourosPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageCalourosPageRoutingModule {}
