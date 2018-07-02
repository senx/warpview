import { Component, Prop, EventEmitter, Event, State, Listen, Element} from '@stencil/core';
import { GTSLib } from "../../gts.lib";
import L from 'leaflet';


@Component({
  tag: 'quantum-heatmap',
  shadow: true
})

export class QuantumHeatmap{

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

drawMap(){
  let ctx = this.el.shadowRoot.querySelector("#myMap");
  var mymap = L.map(ctx).setView([51.505, -0.09], 13);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		id: 'mapbox.streets'
	}).addTo(mymap);
}

componentDidLoad() {
  this.drawMap();
}

  render() {
    return (
      <div>
        <h1>{this.mapTitle}</h1>
        <div class="chart-container">
              <div id="myMap"></div>
        </div>
      </div>
    );
  }
}