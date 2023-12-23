import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MajorEventsDisplayPage } from './major-events-display.page';


import { MajorEventsDisplayPageRoutingModule } from './major-events-display-routing.module';

@NgModule({
    imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: MajorEventsDisplayPage }]),
    MajorEventsDisplayPageRoutingModule,
    MajorEventsDisplayPage,
],
})
export class MajorEventsDisplayPageModule {}
