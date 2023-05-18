import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabMenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: TabMenuPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabMenuPageRoutingModule {}
