import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageSearchUserPageRoutingModule } from './page-search-user-routing.module';

import { PageSearchUserPage } from './page-search-user.page';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, PageSearchUserPageRoutingModule],
  declarations: [PageSearchUserPage],
})
export class PageSearchUserPageModule {}
