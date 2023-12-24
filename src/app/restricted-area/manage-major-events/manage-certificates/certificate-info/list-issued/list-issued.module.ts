import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListIssuedPageRoutingModule } from './list-issued-routing.module';

import { ListIssuedPage } from './list-issued.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListIssuedPageRoutingModule,
        ListIssuedPage
    ]
})
export class ListIssuedPageModule {}
