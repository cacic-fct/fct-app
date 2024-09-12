import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonCard,
  IonItem,
  IonList,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { ExplanationCardComponent } from 'src/app/settings/components/explanation-card/explanation-card.component';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-manage-providers',
  templateUrl: './manage-providers.page.html',
  styleUrls: ['./manage-providers.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonCard,
    IonButtons,
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ExplanationCardComponent,
  ],
})
export class ManageProvidersPage implements OnInit {
  constructor() {
    addIcons({
      trashOutline,
    });
  }

  ngOnInit() {}
}
