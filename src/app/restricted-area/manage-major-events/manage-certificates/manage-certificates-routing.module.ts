import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageCertificatesPage } from './manage-certificates.page';

const routes: Routes = [
  {
    path: '',
    component: ManageCertificatesPage,
  },
  {
    path: 'emitir',
    loadChildren: () =>
      import('./issue-certificate/issue-certificate.module').then((m) => m.IssueCertificatePageModule),
  },
  {
    path: 'detalhes/:certificateID',
    loadChildren: () => import('./certificate-info/certificate-info.module').then((m) => m.CertificateInfoPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageCertificatesPageRoutingModule {}
