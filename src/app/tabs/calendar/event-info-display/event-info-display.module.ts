import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventInfoDisplayPageRoutingModule } from './event-info-display-routing.module';

import { EventInfoDisplayPage } from './event-info-display.page';

import { EventDisplayModule } from '../../../shared/modules/event-display/event-display.module';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, EventInfoDisplayPageRoutingModule, EventDisplayModule, EventInfoDisplayPage],
})
export class EventInfoDisplayPageModule {}
