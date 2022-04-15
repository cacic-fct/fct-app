import { NgModule } from '@angular/core';
import { EventListComponent } from './event-list.component';
@NgModule({
  declarations: [
    EventListComponent,
  ],
  exports: [
    EventListComponent,
  ]
})
export class EventListModule {}