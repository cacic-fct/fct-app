import { Component, Input, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { GlobalConstantsService } from '../shared/services/global-constants.service';

import * as L from 'leaflet';
import 'leaflet-easybutton';

import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-page-calendar-event',
  templateUrl: './page-calendar-event.page.html',
  styleUrls: ['./page-calendar-event.page.scss'],
})
export class PageCalendarEventPage implements OnInit {
  courses = GlobalConstantsService.courses;

  private map: L.Map;

  item: any;

  constructor(
    private toastController: ToastController,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private router: Router
  ) {
    if (history.state.item === undefined) {
      // Get this item from the database
      this.route.paramMap.subscribe((paramMap) => {
        if (!paramMap.has('id')) {
          this.router.navigate(['/calendario']);
        }
        const id = paramMap.get('id');
        this.item = this.afs.doc<any>(`events/${id}`).valueChanges();
      });
    } else {
      this.item = history.state.item;
    }
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.leafletMap();
  }

  ionViewWillLeave() {
    this.map.off();
    this.map.remove();
  }

  leafletMap() {
    let home = {
      lat: this.item.location?.lat,
      lng: this.item.location?.lng,
      zoom: 18,
    };

    this.map = L.map('mapId').setView([home.lat, home.lng], home.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    L.easyButton('<ion-icon name="locate"></ion-icon>', () => {
      this.map.setView([home.lat, home.lng], home.zoom);
    }).addTo(this.map);

    L.map('mapId').invalidateSize();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Toast header',
      message: 'Click to Close',
      icon: 'information-circle',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          },
        },
        {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
