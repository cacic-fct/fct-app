import { Component, OnInit, AfterViewInit } from '@angular/core';

import * as L from 'leaflet';
import 'leaflet-easybutton';
import { MarkerService } from './components/manual-mapa/marker.service';

@Component({
  selector: 'app-page-manual-calouro',
  templateUrl: './page-manual-calouro.page.html',
  styleUrls: ['./page-manual-calouro.page.scss'],
})
export class PageManualCalouroPage implements OnInit, AfterViewInit {
  constructor(private markerService: MarkerService) {}
  private map: L.Map;

  leafletMap() {
    let home = {
      lat: -22.12103,
      lng: -51.40775,
      zoom: 16,
    };

    this.map = L.map('mapId', { tap: false }).setView(
      [home.lat, home.lng],
      home.zoom
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    L.easyButton('<ion-icon name="school"></ion-icon>', () => {
      this.map.setView([home.lat, home.lng], home.zoom);
    }).addTo(this.map);
  }

  ngAfterViewInit(): void {}

  ionViewWillEnter() {}

  ionViewDidEnter() {
    this.leafletMap();
    this.markerService.makeGroceriesMarkers(this.map);
    this.invalidate();
  }

  ionViewWillLeave() {
    L.map('mapId').off();
    L.map('mapId').remove();
  }
  async invalidate() {
    await delay(2000);
    console.log('Invalidated');
    L.map('mapId').invalidateSize();
  }

  ngOnInit() {}
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
