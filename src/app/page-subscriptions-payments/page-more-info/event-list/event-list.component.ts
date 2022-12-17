// @ts-strict-ignore
import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { fromUnixTime, isSameDay } from 'date-fns';
import { Observable } from 'rxjs';

import { Timestamp } from '@firebase/firestore-types';

import { EventItem } from 'src/app/shared/services/event';
import { EmojiService } from './../../../shared/services/emoji.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  @Input() eventInput$: Observable<EventItem[]>;

  constructor(public emojiService: EmojiService) {}

  ngOnInit() {}

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }

  formatDate(date: Date): string {
    let formated = formatDate(date, "EEEE, dd 'de' MMMM 'de' yyyy", 'pt-BR');

    formated = formated.charAt(0).toUpperCase() + formated.slice(1);
    return formated;
  }

  dayCompare(date1: Timestamp, date2: Timestamp): boolean {
    return isSameDay(fromUnixTime(date1.seconds), fromUnixTime(date2.seconds));
  }
}
