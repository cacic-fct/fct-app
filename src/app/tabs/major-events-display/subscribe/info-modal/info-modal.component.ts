// @ts-strict-ignore
import { ModalController, IonicModule } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { EventItem } from 'src/app/shared/services/event';
import { DescriptionComponent } from '../../../../shared/modules/event-display/description/description.component';
import { HeaderComponent } from '../../../../shared/modules/event-display/header/header.component';

@Component({
    selector: 'app-info-modal',
    templateUrl: './info-modal.component.html',
    styleUrls: ['./info-modal.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        HeaderComponent,
        DescriptionComponent,
    ],
})
export class InfoModalComponent implements OnInit {
  @Input() event: EventItem;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
