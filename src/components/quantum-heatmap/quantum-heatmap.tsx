import {Component, Element, Prop} from '@stencil/core';

import Leaflet from 'leaflet';
import {GTSLib} from "../../gts.lib";


@Component({
  tag: 'quantum-heatmap',
  styleUrls: [
    '../../../node_modules/leaflet/dist/leaflet.css',
    'quantum-heatmap.scss'
  ],
  shadow: true
})

export class QuantumHeatmap {

  @Prop() mapTitle: string = "";
  @Prop() width: number;
  @Prop() height: number;
  @Prop() responsive: boolean = false;
  @Element() el: HTMLElement;
  private _map;

  /*
    drawMap(){
      let ctx = this.el.shadowRoot.querySelector("#myMap");
      this._map = new L.Map(ctx);
      this._map.setView(new L.LatLng(51.505, -0.09), 13);
      var layer =new L.TileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: "attribution test" });
      layer.addTo(this._map);
    }
  */

  drawMap() {
    let ctx = this.el.shadowRoot.querySelector('#mymap');
    this._map = Leaflet.map(ctx as HTMLElement).setView([51.505, -0.09], 13);
    const myIcon = Leaflet.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png'
    });
  //  Leaflet.marker([50.6311634, 3.0599573], {icon: myIcon}).bindPopup('Je suis là').addTo(this._map).openPopup();
    Leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      id: 'mapbox.streets'
    }).addTo(this._map);
  }

  componentDidLoad() {
    this.drawMap();
  }

  render() {
    return (
      <div>
        <h1>{this.mapTitle}</h1>
        <div class="map-container">
          <div id="mymap" style={ {'width': '100%', 'height': '400px' }} />
        </div>
      </div>
    );
  }
}
