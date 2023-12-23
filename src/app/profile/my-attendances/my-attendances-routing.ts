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
    loadComponent: () => import('./send-receipt/send-receipt.page').then((m) => m.SendReceiptPage),
  },
  {
    path: 'detalhes/:majorEventID',
    title: 'Detalhes da inscrição',
    loadComponent: () => import('./more-info/more-info.page').then((m) => m.MoreInfoPage),
  },
];

export class MyAttendancesPageRoutingModule {}
