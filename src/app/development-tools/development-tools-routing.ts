import { Routes, RouterModule } from '@angular/router';

import { DevelopmentToolsPage } from './development-tools.page';

const routes: Routes = [
  {
    path: '',
    component: DevelopmentToolsPage,
  },
  {
    path: 'populate-db',
    loadComponent: () => import('./populate-database/populate-database.page').then((m) => m.PopulateDatabasePage),
  },
];

export class DevelopmentToolsPageRoutingModule {}
