import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageMigratePageRoutingModule } from './page-migrate-routing.module';

import { PageMigratePage } from './page-migrate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageMigratePageRoutingModule
  ],
  declarations: [PageMigratePage]
})
export class PageMigratePageModule {}
