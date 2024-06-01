import { EventItem } from '../../../services/event';
import { Component, Input, OnInit } from '@angular/core';

/**
 * Requires the eventItem input to be passed in.
 */
@Component({
  selector: 'app-event-display-description[eventItem]',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  standalone: true,
})
export class DescriptionComponent {
  @Input() eventItem!: EventItem;
}
