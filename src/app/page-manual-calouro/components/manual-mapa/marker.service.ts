import Map from 'ol/Map';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import GeoJSON from 'ol/format/GeoJSON';
import { Icon, Style } from 'ol/style';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  layers: Array<string> = [
    'mercados',
    'compras',
    'hospitais',
    'farmacias',
    'autoridades',
  ];

  mercadosIcon = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      scale: 0.5,
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    }),
  });

  comprasIcon = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      scale: 0.5,
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    }),
  });

  hospitaisIcon = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      scale: 0.5,
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    }),
  });

  farmaciasIcon = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      scale: 0.5,
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    }),
  });

  autoridadesIcon = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      scale: 0.5,
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    }),
  });

  mercadosStyle = {
    color: '#2A81CB',
  };

  comprasStyle = {
    color: '#FFD326',
  };

  constructor() {}

  // For each layer create a geojson layer with markers and polygons.
  // Mercados style is mercadosIcon and mercadosStyle.
  // Compras style is comprasIcon and comprasStyle.
  // bindPopup of markers and polygons to "<b>feature.properties.name</b><br>feature.properties.description"

  makeGroceriesMarkers(map: Map): void {
    // For each layer create a geojson layer with markers and polygons.
    // Mercados style is mercadosIcon and mercadosStyle.
    // Compras style is comprasIcon and comprasStyle.
    // bindPopup of markers and polygons to "<b>feature.properties.name</b><br>feature.properties.description"
    this.layers.forEach((layer) => {
      const vectorSource = new VectorSource({
        url: `https://cdn.jsdelivr.net/gh/cacic-fct/manual-do-calouro@main/map/${layer}.geojson`,
        format: new GeoJSON(),
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: (feature) => {
          switch (layer) {
            case 'mercados':
              return this.mercadosIcon;
            case 'compras':
              return this.comprasIcon;
            case 'hospitais':
              return this.hospitaisIcon;
            case 'farmacias':
              return this.farmaciasIcon;
            case 'autoridades':
              return this.autoridadesIcon;
          }
        },
      });

      // popup overlay
      const popup = new Overlay({
        element: document.getElementById('popup'),
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
      map.addOverlay(popup);

      map.addLayer(vectorLayer);
    });
  }
}
