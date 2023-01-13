import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IssueCertificatePageRoutingModule } from './issue-certificate-routing.module';

import { IssueCertificatePage } from './issue-certificate.page';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule, IssueCertificatePageRoutingModule],
  declarations: [IssueCertificatePage],
})
export class IssueCertificatePageModule {}
