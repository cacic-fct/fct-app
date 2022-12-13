import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageManageUsersPage } from './page-manage-users.page';

const routes: Routes = [
  {
    path: '',
    component: PageManageUsersPage,
  },
  {
    path: 'buscar-usuario',
    loadChildren: () => import('./page-search-user/page-search-user.module').then((m) => m.PageSearchUserPageModule),
  },
  {
    path: 'page-list-users',
    loadChildren: () => import('./page-list-users/page-list-users.module').then( m => m.PageListUsersPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageManageUsersPageRoutingModule {}
