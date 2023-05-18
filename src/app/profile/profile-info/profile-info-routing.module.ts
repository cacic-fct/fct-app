import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileInfoPage } from './profile-info.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileInfoPage,
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
export class ProfileInfoPageRoutingModule {}
