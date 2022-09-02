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
    title: 'Coletar presença',
    loadChildren: () =>
      import('./attendance/page-attendance/page-attendance.module').then((m) => m.PageAttendanceCollectPageModule),
  },
  {
    path: 'gerenciar-admins',
    title: 'Gerenciar admins',
    loadChildren: () =>
      import('./page-manage-admins/page-manage-admins.module').then((m) => m.PageManageAdminsPageModule),
  },
  {
    path: 'adicionar-grande-evento',
    loadChildren: () => import('./add-major-event/add-major-event.module').then((m) => m.AddMajorEventPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRestrictedAreaPageRoutingModule {}
