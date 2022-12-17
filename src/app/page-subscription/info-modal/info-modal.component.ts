// @ts-strict-ignore
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { fromUnixTime } from 'date-fns';
import { EventItem } from 'src/app/shared/services/event';

import { Timestamp } from '@firebase/firestore-types';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent implements OnInit {
  @Input() event: EventItem;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  toUppercase(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getDateFromTimestamp(timestamp: Timestamp): Date {
    return fromUnixTime(timestamp.seconds);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
