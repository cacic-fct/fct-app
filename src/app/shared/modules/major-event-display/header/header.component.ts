import { Component, Input, OnInit } from '@angular/core';
import { MajorEventItem } from 'src/app/shared/services/major-event.service';
import { IonicModule } from '@ionic/angular';

/**
 * Requires the majorEventItem input to be passed in.
 */
@Component({
    selector: 'app-major-event-display-header[majorEventItem]',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [IonicModule],
})
export class HeaderComponent implements OnInit {
  @Input() majorEventItem!: MajorEventItem;

  constructor() {}

  ngOnInit() {}
}
