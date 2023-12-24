import { Routes } from '@angular/router';

import { CertificateInfoPage } from './certificate-info.page';

export const routes: Routes = [
  {
    path: '',
    component: CertificateInfoPage,
  },
  {
    path: 'listar-emitidos',
    loadChildren: () => import('./list-issued/list-issued.routes').then((m) => m.routes),
  },
];

export class CertificateInfoPageRoutingModule {}
