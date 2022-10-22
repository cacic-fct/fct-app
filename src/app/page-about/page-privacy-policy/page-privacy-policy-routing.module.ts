import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagePrivacyPolicyPage } from './page-privacy-policy.page';

const routes: Routes = [
  {
    path: '',
    component: PagePrivacyPolicyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagePrivacyPolicyPageRoutingModule {}
