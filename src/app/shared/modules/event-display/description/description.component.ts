import { EventItem } from '../../../services/event';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-display-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
})
export class DescriptionComponent implements OnInit {
  @Input() eventItem!: EventItem;

  constructor() {}

  ngOnInit() {}
}
