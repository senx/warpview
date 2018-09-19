/*
 *
 *    Copyright 2016  Cityzen Data
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */

import {Component, Element, Listen, Method, Prop, Watch} from '@stencil/core';

import Leaflet from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';
import {ColorLib} from "../../utils/color-lib";
import {ChartLib} from "../../utils/chart-lib";
import {Logger} from "../../utils/logger";
import {DataModel} from "../../model/dataModel";
import {GTS} from "../../model/GTS";
import {MapLib} from "../../utils/map-lib";

@Component({
  tag: 'warp-view-map',
  styleUrls: [
    '../../../node_modules/leaflet/dist/leaflet.css',
    '../../../node_modules/leaflet.markercluster/dist/MarkerCluster.css',
    '../../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
    'warp-view-map.scss'
  ],
  shadow: true
})

export class WarpViewMap {

  @Prop() width: string;
  @Prop() height: string;
  @Prop() responsive: boolean = false;
  @Prop() data: any;
  @Prop() heatData: any[] = [];
  @Prop() options: any = {};

  @Element() el: HTMLElement;

  private _options: any = {
    startLat: undefined,
    startLong: undefined,
    startZoom: 2,
    dotsLimit: 1000,
    heatRadius: undefined,
    heatBlur: undefined,
    heatOpacity: undefined,
    heatControls: false
  };

  private _map: Leaflet.Map;
  private uuid = 'map-' + ChartLib.guid().split('-').join('');
  private LOG: Logger = new Logger(WarpViewMap);
  private polylinesBeforeCurrentValue = [];
  private polylinesAfterCurrentValue = [];
  private currentValuesMarkers = [];
  private annotationsMarkers = [];
  private positionArraysMarkers = [];

  private _iconAnchor: Leaflet.PointExpression = [20, 52];
  private _popupAnchor: Leaflet.PointExpression = [0, -50];

  private _heatLayer: Leaflet.HeatLayer;
  private resizeTimer;
  private pathData: any[];
  private annotationsData: any[];
  private positionData: any[];
  private tiles: any[];
  private layerGroup: any;
  private static DEFAULT_HEIGHT: number = 600;
  private static DEFAULT_WIDTH: number = 800;

  @Listen('window:resize')
  onResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
      this.drawMap();
    }, 250);
  }

  @Watch('data')
  private onData(newValue: DataModel | GTS[], oldValue: DataModel | GTS[]) {
    if (oldValue !== newValue) {
      this.LOG.debug(['data'], newValue);
      this.drawMap();
    }
  }

  @Listen('heatRadiusDidChange')
  heatRadiusDidChange(event) {
    this._heatLayer.setOptions({radius: event.detail.valueAsNumber});
    this.LOG.debug(['heatRadiusDidChange'], event.detail.valueAsNumber);
  }

  @Listen('heatBlurDidChange')
  heatBlurDidChange(event) {
    this._heatLayer.setOptions({blur: event.detail.valueAsNumber});
    this.LOG.debug(['heatBlurDidChange'], event.detail.valueAsNumber);
  }

  @Listen('heatOpacityDidChange')
  heatOpacityDidChange(event) {
    let minOpacity = event.detail.valueAsNumber / 100;
    this._heatLayer.setOptions({minOpacity: minOpacity});
    this.LOG.debug(['heatOpacityDidChange'], event.detail.valueAsNumber);
  }

  private drawMap() {
    this.LOG.debug(['drawMap'], this.data);
    this._options = ChartLib.mergeDeep(this._options, this.options);
    if (!this.data) {
      return;
    }
    if (this._map) {
      this._map.invalidateSize(true);
    }
    let dataList: any[];
    let params: any[];
    if (this.data instanceof DataModel) {
      dataList = this.data.data as any[];
      params = this.data.params
    } else {
      dataList = this.data;
      params = [];
    }
    this.LOG.debug(['drawMap'], dataList);
    this.displayMap({gts: dataList, params: params});
  }

  private icon(color, marker = '') {
    let c = "+" + color.slice(1);
    let m = marker !== '' ? '-' + marker : '';
    return Leaflet.icon({
      iconUrl: 'https://api.mapbox.com/v3/marker/pin-s' + m + c + '@2x.png',
      iconAnchor: this._iconAnchor,
      popupAnchor: this._popupAnchor
    });
  }

  private displayMap(data: { gts: any[], params: any[] }) {
    this.LOG.debug(['drawMap'], this.data);
    const height = (this.responsive ? this.el.parentElement.clientHeight : WarpViewMap.DEFAULT_HEIGHT) - 30;
    const width = (this.responsive ? this.el.parentElement.clientWidth : WarpViewMap.DEFAULT_WIDTH) - 5;
    this.pathData = MapLib.toLeafletMapPaths(data);
    this.annotationsData = MapLib.annotationsToLeafletPositions(data);
    this.positionData = MapLib.toLeafletMapPositionArray(data);

    if (!this.data) {
      return;
    }
    if (this._map) {
      this._map.remove();
    }
    let ctx = this.el.shadowRoot.querySelector('#' + this.uuid) as HTMLElement;
    ctx.style.width = width + 'px';
    ctx.style.height = height + 'px';

    this._map = Leaflet.map(ctx as HTMLElement).setView([this._options.startLat || 0, this._options.startLong || 0], this._options.startZoom || 5);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map);

    this.layerGroup = Leaflet.layerGroup().addTo(this._map);
    this.pathData.forEach(d => {
      let plottedGts: any = this.updateGtsPath(d);
      this.polylinesBeforeCurrentValue.push(plottedGts.beforeCurrentValue);
      this.polylinesAfterCurrentValue.push(plottedGts.afterCurrentValue);
      this.currentValuesMarkers.push(plottedGts.currentValue);
    }, this);

    this.annotationsData.forEach(d => {
      this.annotationsMarkers.push(this.updateAnnotation(d));
    }, this);
    // Create the positions arrays
    this.positionData.forEach(d => {
      this.positionArraysMarkers.push(this.updatePositionArray(d));
    }, this);

    (this.tiles || []).forEach(function (t) {
      this.addLayer(Leaflet.tileLayer(t));
    }, this.layerGroup);
    this.LOG.debug(['displayMap'], [this.pathData, this.positionData, this.annotationsData]);
    if (this.pathData.length > 0 || this.positionData.length > 0 || this.annotationsData.length > 0) {
      // Fit map to curves
      let bounds = MapLib.getBoundsArray(this.pathData, this.positionData, this.annotationsData);

      window.setTimeout(() => {
        // Without the timeout tiles doesn't show, see https://github.com/Leaflet/Leaflet/issues/694
        this._map.invalidateSize();
        this.resize();
        if (bounds.length > 1) {
          this._map.fitBounds(Leaflet.latLngBounds(bounds[0], bounds[1])); //, {padding: [20, 20]}));
          if (this._map.getZoom() === 0 || this._options.startZoom > this._map.getZoom()) {
            this._map.setZoom(this._options.startZoom);
          }
        } else {
          this._map.setView(bounds[0], this._options.startZoom);
        }
      }, 1000);
    } else {
      window.setTimeout(() => {
        this._map.invalidateSize();
        this.configure();
      }, 1000);
    }
    if (this.heatData && this.heatData.length > 0) {
      this._heatLayer = Leaflet.heatLayer(this.heatData, {
        radius: this._options.heatRadius,
        blur: this._options.heatBlur,
        minOpacity: this._options.heatOpacity
      });
      this._heatLayer.addTo(this._map);
    }
  }

  private updateGtsPath(gts: any) {
    let beforeCurrentValue = Leaflet.polyline(
      MapLib.pathDataToLeaflet(gts.path, {to: 0}), {
        color: gts.color,
        opacity: 1,
      });
    this.layerGroup.addLayer(beforeCurrentValue);
    let afterCurrentValue = Leaflet.polyline(
      MapLib.pathDataToLeaflet(gts.path, {from: 0}), {
        color: gts.color,
        opacity: 0.5,
      });
    this.layerGroup.addLayer(afterCurrentValue);
    let currentValue;
    // Let's verify we have a path... No path, no marker
    this.LOG.debug(['updateGtsPath'], gts);
    if (gts.path[0] !== undefined) {
      currentValue = Leaflet.circleMarker([gts.path[0].lat, gts.path[0].lon],
        {radius: 5, color: '#fff', fillColor: gts.color, fillOpacity: 1})
        .bindPopup(gts.key);
    } else {
      currentValue = Leaflet.circleMarker([0, 0]);
    }
    this.layerGroup.addLayer(currentValue);
    return {
      beforeCurrentValue: beforeCurrentValue,
      afterCurrentValue: afterCurrentValue,
      currentValue: currentValue,
    };
  }

  private updateAnnotation(gts) {
    let positions = [];
    let icon;
    switch (gts.render) {
      case 'marker':
        icon = this.icon(gts.color, gts.marker);
        for (let j = 0; j < gts.path.length; j++) {
          let marker = Leaflet.marker(gts.path[j], {icon: icon, opacity: 1});
          marker.bindPopup(gts.path[j].val.toString());
          this.layerGroup.addLayer(marker);
          positions.push(marker);
        }
        break;
      case 'dots':
      default:
        for (let j = 0; j < gts.path.length; j++) {
          let marker = Leaflet.circleMarker(
            gts.path[j], {
              radius: gts.baseRadius,
              color: gts.color,
              fillColor: gts.color,
              fillOpacity: 1
            }
          );
          marker.bindPopup(`<b>${gts.path[j].ts}</b><p>${gts.path[j].val.toString()}</p>`);
          this.layerGroup.addLayer(marker);
          positions.push(marker);
        }
        break;
    }
    return positions;

  }

  private updatePositionArray(positionData: any) {
    let positions = [];
    let polyline;
    let icon;
    let result;
    let inStep;
    this.LOG.debug(['updatePositionArray'], positionData.render);
    switch (positionData.render) {
      case 'path':
        polyline = Leaflet.polyline(positionData.positions, {color: positionData.color, opacity: 1});
        this.layerGroup.addLayer(polyline);
        positions.push(polyline);
        break;
      case 'marker':
        icon = this.icon(positionData.color, positionData.key);
        for (let j = 0; j < positionData.positions.length; j++) {
          let marker = Leaflet.marker({lat: positionData.positions[j][0], lng: positionData.positions[j][1]}, {
            icon: icon,
            opacity: 1,
          });
          this.layerGroup.addLayer(marker);
          positions.push(marker);
        }
        break;
      case 'coloredWeightedDots':
        result = [];
        inStep = [];
        for (let j = 0; j < positionData.numColorSteps; j++) {
          result[j] = 0;
          inStep[j] = 0;
        }
        for (let j = 0; j < positionData.positions.length; j++) {
          let marker = Leaflet.circleMarker(
            {lat: positionData.positions[j][0], lng: positionData.positions[j][1]}, {
              radius: positionData.baseRadius * (parseInt(positionData.positions[j][4]) + 1),
              color: positionData.borderColor,
              fillColor: ColorLib.rgb2hex(
                positionData.colorGradient[positionData.positions[j][5]].r,
                positionData.colorGradient[positionData.positions[j][5]].g,
                positionData.colorGradient[positionData.positions[j][5]].b),
              fillOpacity: 1,
            });
          this.layerGroup.addLayer(marker);
          positions.push(marker);
        }
        break;
      case 'weightedDots':
        for (let j = 0; j < positionData.positions.length; j++) {
          let marker = Leaflet.circleMarker(
            {lat: positionData.positions[j][0], lng: positionData.positions[j][1]}, {
              radius: positionData.baseRadius * (parseInt(positionData.positions[j][4]) + 1),
              color: positionData.borderColor,
              fillColor: positionData.color, fillOpacity: 1,
            });
          this.layerGroup.addLayer(marker);
          positions.push(marker);
        }
        break;
      case 'dots':
      default:
        for (let j = 0; j < positionData.positions.length; j++) {
          let marker = Leaflet.circleMarker(
            {lat: positionData.positions[j][0], lng: positionData.positions[j][1]}, {
              radius: positionData.baseRadius,
              color: positionData.borderColor,
              fillColor: positionData.color,
              fillOpacity: 1,
            });
          this.layerGroup.addLayer(marker);
          positions.push(marker);
        }
        break;
    }
    return positions;
  }

  @Method()
  resize() {
  }

  private configure() {
    this.resize();
  }

  componentDidLoad() {
    this.drawMap();
  }

  render() {
    return (
      <div class="wrapper">
        <div class="map-container">
          <div id={this.uuid} style={{width: this.width, height: this.height}}/>
        </div>
        {!!this._options.heatControls ? <warp-view-heatmap-sliders/> : ""}
      </div>
    );
  }
}
