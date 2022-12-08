import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageManageUsersPageRoutingModule } from './page-manage-users-routing.module';

import { PageManageUsersPage } from './page-manage-users.page';

import { UserEditModalComponent } from './components/user-edit-modal/user-edit-modal.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, PageManageUsersPageRoutingModule],
  declarations: [PageManageUsersPage, UserEditModalComponent],
})
export class PageManageUsersPageModule {}
