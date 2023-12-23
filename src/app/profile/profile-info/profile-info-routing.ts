import { Routes, RouterModule } from '@angular/router';

import { ProfileInfoPage } from './profile-info.page';

export const routes: Routes = [
  {
    path: '',
    component: ProfileInfoPage,
  },
  {
    path: 'settings',
    loadComponent: () => import('src/app/profile/profile-info/settings/settings.page').then((m) => m.SettingsPage),
  },
];
