import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CertificateInfoPage } from './certificate-info.page';

const routes: Routes = [
  {
    path: '',
    component: CertificateInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificateInfoPageRoutingModule {}
