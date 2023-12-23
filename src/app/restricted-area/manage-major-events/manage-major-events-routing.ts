import { Routes, RouterModule } from '@angular/router';

import { ManageMajorEventsPage } from './manage-major-events.page';

export const routes: Routes = [
  {
    path: '',
    component: ManageMajorEventsPage,
  },
  {
    path: 'adicionar',
    loadComponent: () => import('./add-major-event/add-major-event.page').then((m) => m.AddMajorEventPage),
  },
  {
    path: 'validar-comprovante/:eventId',
    title: 'Validar comprovante',
    loadComponent: () => import('./validate-receipt/validate-receipt.page').then((m) => m.ValidateReceiptPage),
  },
  {
    path: 'listar-inscritos/:eventID',
    title: 'Listar inscritos',
    loadComponent: () =>
      import('src/app/restricted-area/manage-major-events/list-subscriptions/list-subscriptions.page').then(
        (m) => m.ListSubscriptionsPage
      ),
  },
  {
    path: 'emitir-certificados/:eventID',
    loadComponent: () => import('./issue-certificate/issue-certificate.page').then((m) => m.IssueCertificatePage),
  },
  {
    path: 'emitir-certificados',
    redirectTo: '',
  },
];
