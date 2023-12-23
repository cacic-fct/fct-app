import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoreInfoPageRoutingModule } from './more-info-routing.module';

import { MoreInfoPage } from './more-info.page';

import { EventListComponent } from './event-list/event-list.component';


@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, MoreInfoPageRoutingModule, MoreInfoPage, EventListComponent],
})
export class MoreInfoPageModule {}
