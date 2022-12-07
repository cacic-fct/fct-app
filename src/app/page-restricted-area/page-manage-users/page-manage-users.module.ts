import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageManageUsersPageRoutingModule } from './page-manage-users-routing.module';

import { PageManageUsersPage } from './page-manage-users.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageManageUsersPageRoutingModule
  ],
  declarations: [PageManageUsersPage]
})
export class PageManageUsersPageModule {}
