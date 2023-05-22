import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageCertificatesPageRoutingModule } from './manage-certificates-routing.module';

import { ManageCertificatesPage } from './manage-certificates.page';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ManageCertificatesPageRoutingModule, SweetAlert2Module],
  declarations: [ManageCertificatesPage],
})
export class ManageCertificatesPageModule {}
