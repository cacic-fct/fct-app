import { Component, Input, OnInit } from '@angular/core';

import { CoursesService } from '../shared/services/courses.service';
import * as L from 'leaflet';
import 'leaflet-easybutton';

import { ToastController } from '@ionic/angular';

import { fromUnixTime } from 'date-fns';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-page-calendar-event',
  templateUrl: './page-calendar-event.page.html',
  styleUrls: ['./page-calendar-event.page.scss'],
})
export class PageCalendarEventPage implements OnInit {
  private map: L.Map;
  courses = CoursesService.courses;

  item: any;

  constructor(
    private toastController: ToastController,
    private clipboardService: ClipboardService
  ) {}

  ngOnInit() {
    this.item = history.state.item;
  }

  ionViewWillEnter() {
    this.leafletMap();
  }

  ionViewWillLeave() {
    this.map.off();
    this.map.remove();
  }

  leafletMap() {
    let home = {
      lat: this.item.location.lat,
      lng: this.item.location.lng,
      zoom: 18,
    };

    let icon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.map = L.map('mapId').setView([home.lat, home.lng], home.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    L.easyButton('<ion-icon name="locate"></ion-icon>', () => {
      this.map.setView([home.lat, home.lng], home.zoom);
    }).addTo(this.map);

    L.marker([home.lat, home.lng], { icon: icon }).addTo(this.map);

    L.map('mapId').invalidateSize();
  }

  getCourse(): string {
    return this.courses[this.item.course].name;
  }

  getDateFromTimestamp(timestamp: any): Date {
    return fromUnixTime(timestamp.seconds);
  }

  toUppercase(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      header: 'ID do evento',
      message: this.item.id,
      icon: 'information-circle',
      position: 'bottom',
      duration: 5000,
      buttons: [
        {
          side: 'end',
          text: 'Copiar',
          handler: () => {
            this.clipboardService.copy(this.item.id);
          },
        },
        {
          side: 'end',
          text: 'Fechar',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }

  // Emoji to codepoint
  getEmojiCode(emoji: string): string {
    if (emoji === undefined) {
      return '❔'.codePointAt(0).toString(16);
    }
    return emoji.codePointAt(0).toString(16);
  }
}
