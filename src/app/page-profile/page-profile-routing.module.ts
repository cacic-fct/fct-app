import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageProfilePage } from './page-profile.page';

const routes: Routes = [
  {
    path: '',
    component: PageProfilePage,
  },
  {
    path: 'settings',
    loadChildren: () => import('./page-settings/page-settings.module').then((m) => m.PageSettingsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageProfilePageRoutingModule {}
