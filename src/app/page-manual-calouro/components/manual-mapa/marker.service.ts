import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  layers: Array<string> = ['mercados', 'compras'];

  mercadosIcon = new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  comprasIcon = new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  mercadosStyle = {
    color: '#2A81CB',
  };

  comprasStyle = {
    color: '#FFD326',
  };

  constructor(private http: HttpClient) {}

  makeGroceriesMarkers(map: L.Map): void {
    // For each layer create a geojson layer with markers and polygons.
    // Mercados style is mercadosIcon and mercadosStyle.
    // Compras style is comprasIcon and comprasStyle.
    // bindPopup of markers and polygons to "<b>feature.properties.name</b><br>feature.properties.description"
    this.layers.forEach((layer) => {
      this.http
        .get(
          `https://cdn.jsdelivr.net/gh/cacic-fct/manual-do-calouro@main/map/${layer}.geojson`
        )
        .subscribe((data: any) => {
          const geojson = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
              return L.marker(latlng, {
                icon: this[layer + 'Icon'],
              });
            },
            style: this[layer + 'Style'],
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                layer.bindPopup(
                  L.popup().setContent(
                    `<b>${feature.properties.name}</b><br>${
                      feature.properties.description || ''
                    }`
                  )
                );
              }
            },
          });
          geojson.addTo(map);
        });
    });
  }
}
