import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CertificateInfoPageRoutingModule } from './certificate-info-routing.module';

import { CertificateInfoPage } from './certificate-info.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CertificateInfoPageRoutingModule,
        CertificateInfoPage
    ]
})
export class CertificateInfoPageModule {}
