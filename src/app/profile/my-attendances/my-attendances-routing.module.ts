import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyAttendancesPage } from './my-attendances.page';

const routes: Routes = [
  {
    path: '',
    component: MyAttendancesPage,
  },
  {
    path: 'pagar/:eventID',
    title: 'Pagar evento',
    loadChildren: () => import('./page-pay/page-pay.module').then((m) => m.PagePayPageModule),
  },
  {
    path: 'detalhes/:majorEventID',
    title: 'Detalhes da inscrição',
    loadChildren: () => import('./page-more-info/page-more-info.module').then((m) => m.PageMoreInfoPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyAttendancesPageRoutingModule {}
