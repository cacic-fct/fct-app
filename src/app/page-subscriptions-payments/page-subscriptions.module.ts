import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageSubscriptionsPageRoutingModule } from './page-subscriptions-routing.module';

import { PageSubscriptionsPage } from './page-subscriptions.page';
import { ListCertificatesComponent } from './components/list-certificates/list-certificates.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PageSubscriptionsPageRoutingModule],
  declarations: [PageSubscriptionsPage, ListCertificatesComponent],
})
export class PageSubscriptionsPageModule {}
