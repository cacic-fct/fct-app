import { Component, OnInit } from '@angular/core';
import { GlobalConstantsService } from '../shared/services/global-constants.service';
import { RouterLink } from '@angular/router';
import {
  IonRouterLink,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
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
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class AboutPage implements OnInit {
  public globalConstants = GlobalConstantsService;
  public environment = environment;

  constructor() {}

  ngOnInit() {}
}
