import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageListUsersPageRoutingModule } from './page-list-users-routing.module';

import { PageListUsersPage } from './page-list-users.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageListUsersPageRoutingModule
  ],
  declarations: [PageListUsersPage]
})
export class PageListUsersPageModule {}
