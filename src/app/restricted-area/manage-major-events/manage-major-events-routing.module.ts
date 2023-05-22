import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageMajorEventsPage } from './manage-major-events.page';

const routes: Routes = [
  {
    path: '',
    component: ManageMajorEventsPage,
  },
  {
    path: 'adicionar',
    loadChildren: () => import('./add-major-event/add-major-event.module').then((m) => m.AddMajorEventPageModule),
  },
  {
    path: ':eventId/validar-comprovante',
    title: 'Validar comprovante',
    loadChildren: () => import('./validate-receipt/validate-receipt.module').then((m) => m.ValidateReceiptPageModule),
  },
  {
    path: ':eventID/listar-inscritos',
    title: 'Listar inscritos',
    loadChildren: () =>
      import('src/app/restricted-area/manage-major-events/list-subscriptions/list-subscriptions.module').then(
        (m) => m.ListSubscriptionsPageModule
      ),
  },
  {
    path: ':eventID/gerenciar-certificados',
    loadChildren: () =>
      import('./manage-certificates/manage-certificates.module').then((m) => m.ManageCertificatesPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageMajorEventsPageRoutingModule {}
