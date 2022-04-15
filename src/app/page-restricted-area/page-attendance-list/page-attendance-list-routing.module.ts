import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageAttendanceListPage } from './page-attendance-list.page';

const routes: Routes = [
  {
    path: '',
    component: PageAttendanceListPage,
  },
  {
    path: 'list/:id',
    loadChildren: () =>
      import('./page-list/list.module').then((m) => m.ListPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageAttendanceListPageRoutingModule {}
