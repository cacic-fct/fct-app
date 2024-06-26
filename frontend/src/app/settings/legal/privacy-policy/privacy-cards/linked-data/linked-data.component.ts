import { Component } from '@angular/core';
import { IonLabel, IonList, IonItem, IonIcon, IonNote } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bagOutline,
  cardOutline,
  idCardOutline,
  imageOutline,
  informationCircleOutline,
  personCircleOutline,
  schoolOutline,
  settingsOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-linked-data',
  templateUrl: './linked-data.component.html',
  styleUrls: ['./linked-data.component.scss'],
  imports: [IonNote, IonIcon, IonList, IonItem, IonLabel],
  standalone: true,
})
export class LinkedDataComponent {
  constructor() {
    addIcons({
      schoolOutline,
      informationCircleOutline,
      cardOutline,
      imageOutline,
      idCardOutline,
      bagOutline,
      settingsOutline,
      personCircleOutline,
    });
  }
}
