import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageRestrictedAreaPage } from './page-restricted-area.page';

const routes: Routes = [
  {
    path: '',
    component: PageRestrictedAreaPage,
  },
  {
    path: 'coletar-presenca',
    loadChildren: () =>
      import('./page-attendance-collect/page-attendance-collect.module').then(
        (m) => m.PageAttendanceCollectPageModule
      ),
  },
  {
    path: 'listar-presenca',
    loadChildren: () =>
      import('./page-attendance-list/page-attendance-list.module').then(
        (m) => m.PageAttendanceListPageModule
      ),
  },
  {
    path: 'gerenciar-admins',
    loadChildren: () =>
      import('./page-manage-admins/page-manage-admins.module').then(
        (m) => m.PageManageAdminsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRestrictedAreaPageRoutingModule {}
