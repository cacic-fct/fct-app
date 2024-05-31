import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { serverOutline } from 'ionicons/icons';
import {
  IonRouterLink,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonItem,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-development-tools',
  templateUrl: './development-tools.page.html',
  styleUrls: ['./development-tools.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonRouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonItem,
    IonIcon,
    IonLabel,
  ],
})
export class DevelopmentToolsPage implements OnInit {
  constructor() {
    addIcons({ serverOutline });
  }
}
