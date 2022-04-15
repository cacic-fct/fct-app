import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { EventListComponent } from './event-list.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [
    EventListComponent,
  ],
  exports: [
    EventListComponent,
  ]
})
export class EventListModule {}