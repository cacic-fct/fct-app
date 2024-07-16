import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCardHeader,
  IonCardTitle,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-elections',
  templateUrl: './elections.page.html',
  styleUrls: ['./elections.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    IonCardContent,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class ElectionsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
