import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
  IonList,
  IonRadioGroup,
  IonItem,
  IonLabel,
  IonRadio,
  IonBackButton,
  IonButtons,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ballot',
  templateUrl: './ballot.page.html',
  styleUrls: ['./ballot.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonBackButton,
    IonRadio,
    IonLabel,
    IonItem,
    IonRadioGroup,
    IonList,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonCard,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    CommonModule,
    FormsModule,
  ],
})
export class BallotPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
