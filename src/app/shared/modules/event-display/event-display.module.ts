import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonsComponent } from './buttons/buttons.component';
import { DescriptionComponent } from './description/description.component';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { RouterModule } from '@angular/router';

import { SafeModule } from '../../pipes/safe.module';

@NgModule({
    imports: [CommonModule, IonicModule, RouterModule, SafeModule, HeaderComponent, DescriptionComponent, ButtonsComponent, MapComponent],
    exports: [HeaderComponent, DescriptionComponent, ButtonsComponent, MapComponent],
})
export class EventDisplayModule {}
