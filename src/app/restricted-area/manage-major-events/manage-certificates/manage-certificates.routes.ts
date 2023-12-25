import { Routes } from '@angular/router';

import { ManageCertificatesPage } from './manage-certificates.page';

export const routes: Routes = [
  {
    path: '',
    component: ManageCertificatesPage,
  },
  {
    path: 'emitir',
    loadChildren: () => import('./issue-certificate/issue-certificate.routes').then((m) => m.routes),
  },
  {
    path: 'detalhes/:certificateID',
    loadChildren: () => import('./certificate-info/certificate-info.routes').then((m) => m.routes),
  },
];

export class ManageCertificatesPageRoutingModule {}
