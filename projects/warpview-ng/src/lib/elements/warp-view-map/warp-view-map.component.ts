/*
 *  Copyright 2020  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Param} from '../../model/param';
import {Logger} from '../../utils/logger';

import Leaflet from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';
import {ColorLib} from '../../utils/color-lib';
import {ChartLib} from '../../utils/chart-lib';
import {DataModel} from '../../model/dataModel';
import {MapLib} from '../../utils/map-lib';
import {GTSLib} from '../../utils/gts.lib';
import moment from 'moment-timezone';
import deepEqual from 'deep-equal';
import {SizeService} from '../../services/resize.service';

/**
 *
 */
@Component({
  selector: 'warpview-map',
  templateUrl: './warp-view-map.component.html',
  styleUrls: ['./warp-view-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WarpViewMapComponent implements AfterViewInit, OnInit {

  @ViewChild('mapDiv', {static: true}) mapDiv: ElementRef<HTMLDivElement>;
  @ViewChild('wrapper', {static: true}) wrapper: ElementRef<HTMLDivElement>;
  @ViewChild('timeSlider', {static: false}) timeSlider: ElementRef<HTMLDivElement>;
  @ViewChild('timeRangeSlider', {static: false}) timeRangeSlider: ElementRef<HTMLDivElement>;

  @Input('heatData') heatData: any[] = [];
  @Input('responsive') responsive = false;
  @Input('showLegend') showLegend = true;
  @Input('width') width = ChartLib.DEFAULT_WIDTH;
  @Input('height') height = ChartLib.DEFAULT_HEIGHT;
  private bounds: any[];

  @Input('debug') set debug(debug: boolean) {
    this._debug = debug;
    this.LOG.setDebug(debug);
  }

  get debug() {
    return this._debug;
  }

  @Input('options') set options(options: Param) {
    this.LOG.debug(['onOptions'], options);
    if (!deepEqual(this._options, options)) {
      this._options = options;
      this.divider = GTSLib.getDivider(this._options.timeUnit);
      this.drawMap();
    }
  }

  @Input('data') set data(data: any) {
    this.LOG.debug(['onData'], data);
    if (data) {
      this._data = data;
      this.drawMap();
    }
  }

  get data() {
    return this._data;
  }

  @Input('hiddenData') set hiddenData(hiddenData: number[]) {
    this._hiddenData = hiddenData;
    this.drawMap();
  }

  get hiddenData(): number[] {
    return this._hiddenData;
  }

  @Output('change') change = new EventEmitter();

  currentZoom: number;
  currentLat: number;
  currentLong: number;
  minTimeValue: number;
  maxTimeValue: number;
  divider = 1;
  lowerTimeBound: number;
  upperTimeBound: number;
  timeSpan: number;
  _options: Param = new Param();

  private _firstDraw = true;
  private LOG: Logger;
  private _data: any;
  private _debug = false;
  private defOptions: Param = {
    ...new Param(), ...{
      dotsLimit: 1000,
      heatControls: false,
      timeMode: 'date',
      showRangeSelector: true,
      gridLineColor: '#8e8e8e',
      tiles: [],
      showDots: false,
      timeZone: 'UTC',
      timeUnit: 'us',
      bounds: {}
    }
  };

  private _map: Leaflet.Map;
  private _hiddenData: number[];
  private polylinesBeforeCurrentValue = [];
  private polylinesAfterCurrentValue = [];
  private currentValuesMarkers = [];
  private annotationsMarkers = [];
  private positionArraysMarkers = [];
  private _iconAnchor: Leaflet.PointExpression = [20, 52];
  private _popupAnchor: Leaflet.PointExpression = [0, -50];
  private _heatLayer: any;
  // private resizeTimer;
  private pathData: any[] = [];
  private annotationsData: any[] = [];
  private positionData: any[] = [];
  private geoJson: any[] = [];
  private parentWidth = -1;
  private timeStart: number;
  private timeEnd: number;
  private firstDraw = true;
  private finalHeight = 0;

  constructor(public el: ElementRef, public sizeService: SizeService, private renderer: Renderer2) {
    this.LOG = new Logger(WarpViewMapComponent, this.debug);
    this.LOG.debug(['constructor'], this.debug);
    this.sizeService.sizeChanged$.subscribe(() => {
      if (this._map) {
        this.resizeMe();
      }
    });
  }

  ngOnInit(): void {
    this._options = ChartLib.mergeDeep(this._options, this.defOptions) as Param;
  }

  ngAfterViewInit() {
    this.LOG.debug(['ngAfterViewInit'], this._data);
    this.drawMap();
  }

  resizeMe() {
    this.LOG.debug(['resizeMe'], this.wrapper.nativeElement.parentElement.getBoundingClientRect());
    let height = this.wrapper.nativeElement.parentElement.getBoundingClientRect().height; /* === 0
      ? ChartLib.DEFAULT_HEIGHT
      : this.el.nativeElement.parentElement.getBoundingClientRect().height; */
    const width = this.wrapper.nativeElement.parentElement.getBoundingClientRect().width; /* === 0
      ? ChartLib.DEFAULT_WIDTH
      : this.el.nativeElement.parentElement.getBoundingClientRect().width; */
    if (this._options.map.showTimeSlider && this.timeSlider && this.timeSlider.nativeElement) {
      height -= this.timeSlider.nativeElement.getBoundingClientRect().height;
    }
    if (this._options.map.showTimeRange && this.timeRangeSlider && this.timeRangeSlider.nativeElement) {
      height -= this.timeRangeSlider.nativeElement.getBoundingClientRect().height;
    }
    this.finalHeight = height;
    this.renderer.setStyle(this.mapDiv.nativeElement, 'width', 'calc(' + width + 'px - '
      + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
      + ' - '
      + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
      + ')');
    this.renderer.setStyle(this.mapDiv.nativeElement, 'height', 'calc(' + height + 'px - '
      + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
      + ' - '
      + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
      + ')');
    this.width = width;
    this.height = height;
    requestAnimationFrame(() => this._map.invalidateSize());
  }

  heatRadiusDidChange(event) {
    this._heatLayer.setOptions({radius: event.detail.valueAsNumber});
    this.LOG.debug(['heatRadiusDidChange'], event.detail.valueAsNumber);
  }

  heatBlurDidChange(event) {
    this._heatLayer.setOptions({blur: event.detail.valueAsNumber});
    this.LOG.debug(['heatBlurDidChange'], event.detail.valueAsNumber);
  }

  heatOpacityDidChange(event) {
    const minOpacity = event.detail.valueAsNumber / 100;
    this._heatLayer.setOptions({minOpacity});
    this.LOG.debug(['heatOpacityDidChange'], event.detail.valueAsNumber);
  }

  private drawMap() {
    this.LOG.debug(['drawMap'], this.data);
    this._options = ChartLib.mergeDeep(this._options, this.defOptions) as Param;
    this.timeStart = this._options.map.timeStart;
    moment.tz.setDefault(this._options.timeZone);
    let gts: any = this.data;
    if (!gts) {
      return;
    }
    if (typeof gts === 'string') {
      try {
        gts = JSON.parse(gts as string);
      } catch (error) {
        // empty
      }
    }
    if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
      gts = gts[0];
    }
    if (this._map) {
      this._map.invalidateSize(true);
    }
    let dataList: any[];
    let params: any[];
    if (gts.data) {
      dataList = gts.data as any[];
      this._options = ChartLib.mergeDeep(gts.globalParams || {}, this._options) as Param;
      this.timeSpan = this.timeSpan || this._options.map.timeSpan;
      params = gts.params;
    } else {
      dataList = gts;
      params = [];
    }
    this.LOG.debug(['drawMap'], dataList);
    this.LOG.debug(['drawMap'], this._options, gts.globalParams);

    const flattenGTS = GTSLib.flatDeep(dataList);
    let i = 0;
    flattenGTS.forEach(item => {
      if (item.v) {
        item.v.sort((a, b) => a[0] > b[0] ? 1 : -1);
        item.i = i;
        i++;
      }
    });
    this.LOG.debug(['GTSLib.flatDeep(dataList)'], flattenGTS);
    this.displayMap({gts: flattenGTS, params});
    this.LOG.debug(['onResize', 'postDisplayMap'], 'resizeTimer', this.el.nativeElement.parentElement.clientWidth, this.parentWidth);
    requestAnimationFrame(() => this.resizeMe());
  }

  private icon(color: string, marker = '') {
    const c = `${color.slice(1)}`;
    const m = marker !== '' ? marker : '';
    return Leaflet.icon({
      iconUrl: `https://cdn.mapmarker.io/api/v1/font-awesome/v5/pin?icon=fa-${m}&size=50&hoffset=0&voffset=-1&background=${c}`,
      iconAnchor: this._iconAnchor,
      popupAnchor: this._popupAnchor
    });
  }

  private displayMap(data: { gts: any[], params: any[] }) {
    this.LOG.debug(['drawMap'], data, this._options, this.hiddenData || []);
    this.divider = GTSLib.getDivider(this._options.timeUnit);
    if (!this.lowerTimeBound) {
      this.lowerTimeBound = this._options.map.timeSliderMin / this.divider;
      this.upperTimeBound = this._options.map.timeSliderMax / this.divider;
    }
    this.LOG.debug(['displayMap'], moment(this.timeStart).toISOString(), moment(this.timeEnd).toISOString());
    let height = this.height || ChartLib.DEFAULT_HEIGHT;
    const width = this.width || ChartLib.DEFAULT_WIDTH;
    if (this.responsive && this.finalHeight === 0) {
      this.resizeMe();
    } else {
      if (this._options.map.showTimeSlider && this.timeSlider && this.timeSlider.nativeElement) {
        height -= this.timeSlider.nativeElement.getBoundingClientRect().height;
      }
      if (this._options.map.showTimeRange && this.timeRangeSlider && this.timeRangeSlider.nativeElement) {
        height -= this.timeRangeSlider.nativeElement.getBoundingClientRect().height;
      }
    }
    this.width = width;
    this.height = height;
    this.pathData = MapLib.toLeafletMapPaths(data, this.hiddenData || [], this.divider, this._options.scheme) || [];
    this.annotationsData = MapLib.annotationsToLeafletPositions(data, this.hiddenData, this.divider, this._options.scheme) || [];
    this.positionData = MapLib.toLeafletMapPositionArray(data, this.hiddenData || [], this._options.scheme) || [];
    this.geoJson = MapLib.toGeoJSON(data);
    if (!this.data) {
      return;
    }
    if (this._map) {
      this._map.remove();
    }
    this.LOG.debug(['displayMap'], {
      lat: [this.currentLat, this._options.startLat],
      long: [this.currentLong, this._options.startLong],
      zoom: [this.currentZoom, this._options.startZoom]
    });
    this._map = Leaflet.map(this.mapDiv.nativeElement);

    this._map.on('load', () => {
      this.LOG.debug(['load'], this._map.getCenter().lng, this.currentLong);
      this.LOG.debug(['load'], this._map.getZoom());
    });
    this._map.on('zoomend', () => {
      if (!this.firstDraw) {
        this.currentZoom = this._map.getZoom();
      }
    });
    this._map.on('moveend', () => {
      if (!this.firstDraw) {
        this.LOG.debug(['moveend'], this._map.getCenter());
        this.currentLat = this._map.getCenter().lat;
        this.currentLong = this._map.getCenter().lng;
      }
    });
    if (this._options.map.mapType !== 'NONE') {
      const map = MapLib.mapTypes[this._options.map.mapType || 'DEFAULT'];
      const mapOpts: any = {};
      if (map.attribution) {
        mapOpts.attribution = map.attribution;
      }
      if (map.subdomains) {
        mapOpts.subdomains = map.subdomains;
      }
      Leaflet.tileLayer(map.link, mapOpts).addTo(this._map);
    }
    (this.pathData || []).forEach(d => {
      const plottedGts: any = this.updateGtsPath(d);
      if (plottedGts) {
        this.polylinesBeforeCurrentValue.push(plottedGts.beforeCurrentValue);
        this.polylinesAfterCurrentValue.push(plottedGts.afterCurrentValue);
        this.currentValuesMarkers.push(plottedGts.currentValue);
      }
    });

    (this.annotationsData || []).forEach(d => {
      //   this.annotationsMarkers = this.annotationsMarkers.concat(this.updateAnnotation(d));
      const plottedGts: any = this.updateGtsPath(d);
      if (plottedGts) {
        this.polylinesBeforeCurrentValue.push(plottedGts.beforeCurrentValue);
        this.polylinesAfterCurrentValue.push(plottedGts.afterCurrentValue);
        this.currentValuesMarkers.push(plottedGts.currentValue);
      }
    });
    this.LOG.debug(['displayMap', 'annotationsMarkers'], this.annotationsMarkers);
    this.LOG.debug(['displayMap', 'this.hiddenData'], this.hiddenData);
    this.LOG.debug(['displayMap', 'this.positionData'], this.positionData);
    // Create the positions arrays
    this.positionData.forEach(d => {
      this.positionArraysMarkers = this.positionArraysMarkers.concat(this.updatePositionArray(d));
    });

    (this._options.map.tiles || []).forEach((t) => {
      this.LOG.debug(['displayMap'], t);
      if (this._options.map.showTimeRange) {
        Leaflet.tileLayer(t
            .replace('{start}', moment(this.timeStart).toISOString())
            .replace('{end}', moment(this.timeEnd).toISOString()), {
            subdomains: 'abcd',
            maxNativeZoom: 19,
            maxZoom: 40
          }
        ).addTo(this._map);
      } else {
        Leaflet.tileLayer(t, {
          subdomains: 'abcd',
          maxNativeZoom: 19,
          maxZoom: 40
        }).addTo(this._map);
      }
    });

    this.LOG.debug(['displayMap', 'positionArraysMarkers'], this.positionArraysMarkers);
    this.positionArraysMarkers.forEach(m => {
      m.addTo(this._map);
    });

    this.annotationsMarkers.forEach(m => {
      m.addTo(this._map);
    });

    this.LOG.debug(['displayMap', 'geoJson'], this.geoJson);
    this.geoJson.forEach((m, index) => {
      const color = ColorLib.getColor(index, this._options.scheme);
      const opts = {
        style: () => ({
          color: (data.params && data.params[index]) ? data.params[index].color || color : color,
          fillColor: (data.params && data.params[index])
            ? ColorLib.transparentize(data.params[index].fillColor || color)
            : ColorLib.transparentize(color),
        })
      } as any;
      if (m.geometry.type === 'Point') {
        opts.pointToLayer = (geoJsonPoint, latlng) => Leaflet.marker(latlng, {
          icon: this.icon(color, ''),
          opacity: 1,
        });
      }
      let display = '';
      const geoShape = Leaflet.geoJSON(m, opts);
      if (m.properties) {
        Object.keys(m.properties).forEach(k => display += `<b>${k}</b>: ${m.properties[k]}<br />`);
        geoShape.bindPopup(display);
      }
      geoShape.addTo(this._map);
    });
    if (this.pathData.length > 0 || this.positionData.length > 0 || this.annotationsData.length > 0 || this.geoJson.length > 0) {
      // Fit map to curves
      this.bounds = MapLib.getBoundsArray(this.pathData, this.positionData, this.annotationsData, this.geoJson);
      requestAnimationFrame(() => {
        this._options.startZoom = this.currentZoom || this._options.startZoom || 2;
        // Without the timeout tiles doesn't show, see https://github.com/Leaflet/Leaflet/issues/694
        this._map.invalidateSize();
        if (this.bounds.length > 1) {
          this.LOG.debug(['displayMap', 'setView'], 'fitBounds');
          this._map.fitBounds(Leaflet.latLngBounds(this.bounds[0], this.bounds[1]), {
            padding: [20, 20],
            animate: false,
            duration: 0
          });
          this._map.setZoom(Math.max(this.currentZoom || this._options.startZoom, this._map.getZoom()), {
            animate: false,
            duration: 0
          });
          this.currentLat = this._map.getCenter().lat;
          this.currentLong = this._map.getCenter().lng;
        } else {
          this.LOG.debug(['displayMap', 'setView'], {lat: this.currentLat, lng: this.currentLong});
          this._map.setView({
            lat: this.currentLat || this._options.startLat || 0,
            lng: this.currentLong || this._options.startLong || 0
          }, this.currentZoom || this._options.startZoom || 10);
        }
      });
    } else {
      this.LOG.debug(['displayMap', 'lost'], 'lost', this.currentZoom, this._options.startZoom);
      this._map.setView(
        [
          this.currentLat || this._options.startLat || 0,
          this.currentLong || this._options.startLong || 0
        ],
        this.currentZoom || this._options.startZoom || 2,
        {
          animate: false,
          duration: 0
        }
      );
      window.setTimeout(() => {
        this.firstDraw = false;
      }, 1000);
    }
    if (this.heatData && this.heatData.length > 0) {
      this._heatLayer = (Leaflet as any).heatLayer(this.heatData, {
        radius: this._options.map.heatRadius,
        blur: this._options.map.heatBlur,
        minOpacity: this._options.map.heatOpacity
      });
      this._heatLayer.addTo(this._map);
    }
    this.resizeMe();
  }

  private updateGtsPath(gts: any) {
    const beforeCurrentValue = Leaflet.polyline(
      MapLib.pathDataToLeaflet(gts.path, {to: 0}), {
        color: gts.color,
        opacity: 1,
      }).addTo(this._map);
    const afterCurrentValue = Leaflet.polyline(
      MapLib.pathDataToLeaflet(gts.path, {from: 0}), {
        color: gts.color,
        opacity: 0.7,
      }).addTo(this._map);
    let currentValue;
    // Let's verify we have a path... No path, no marker
    gts.path.map(p => {
      let date;
      if (this._options.timeMode && this._options.timeMode === 'timestamp') {
        date = parseInt(p.ts, 10);
      } else {
        date = (moment(parseInt(p.ts, 10))
          .utc(true).toISOString() || '')
          .replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '');
      }
      currentValue = Leaflet.circleMarker([p.lat, p.lon],
        {radius: MapLib.BASE_RADIUS, color: gts.color, fillColor: gts.color, fillOpacity: 0.7})
        .bindPopup(`<p>${date}</p><p><b>${gts.key}</b>: ${p.val.toString()}</p>`).addTo(this._map);
      return {
        beforeCurrentValue,
        afterCurrentValue,
        currentValue,
      };
    });
  }

  private addPopup(positionData: any, value: any, marker: any) {
    this.LOG.debug(['addPopup'], positionData);
    if (!!positionData) {
      let content = '';
      if (positionData.key) {
        content = `<p><b>${positionData.key}</b>: ${value || ''}</p>`;
      }
      Object.keys(positionData.properties || []).forEach(k => content += `<b>${k}</b>: ${positionData.properties[k]}<br />`);
      marker.bindPopup(content);
    }
  }

  private updatePositionArray(positionData: any) {
    const positions = [];
    let polyline;
    let icon;
    let result;
    let inStep;
    this.LOG.debug(['updatePositionArray'], positionData);
    switch (positionData.render) {
      case 'path':
        polyline = Leaflet.polyline(positionData.positions, {color: positionData.color, opacity: 1});
        positions.push(polyline);
        break;
      case 'marker':
        icon = this.icon(positionData.color, positionData.marker);
        positionData.positions.forEach(p => {
          if ((this.hiddenData || []).filter((i) => i === positionData.key).length === 0) {
            const marker = Leaflet.marker({lat: p[0], lng: p[1]}, {icon, opacity: 1});
            this.addPopup(positionData, p[2], marker);
            positions.push(marker);
          }
          this.LOG.debug(['updatePositionArray', 'build marker'], icon);
        });
        break;
      case 'coloredWeightedDots':
        this.LOG.debug(['updatePositionArray', 'coloredWeightedDots'], positionData);
        result = [];
        inStep = [];
        for (let j = 0; j < positionData.numColorSteps; j++) {
          result[j] = 0;
          inStep[j] = 0;
        }
        positionData.positions.forEach(p => {
          if ((this._hiddenData || []).filter((i) => i === positionData.key).length === 0) {
            this.LOG.debug(['updatePositionArray', 'coloredWeightedDots', 'radius'], positionData.baseRadius * p[4]);
            const marker = Leaflet.circleMarker(
              {lat: p[0], lng: p[1]},
              {
                radius: positionData.baseRadius * (parseInt(p[4], 10) + 1),
                color: positionData.borderColor,
                fillColor: ColorLib.rgb2hex(
                  positionData.colorGradient[p[5]].r,
                  positionData.colorGradient[p[5]].g,
                  positionData.colorGradient[p[5]].b),
                fillOpacity: 0.7,
              });
            this.addPopup(positionData, p[2], marker);
            positions.push(marker);
          }
        });
        break;
      case 'weightedDots':
        positionData.positions.forEach(p => {
          if ((this._hiddenData || []).filter((i) => i === positionData.key).length === 0) {
            const marker = Leaflet.circleMarker(
              {lat: p[0], lng: p[1]}, {
                radius: positionData.baseRadius * (parseInt(p[4], 10) + 1),
                color: positionData.borderColor,
                fillColor: positionData.color, fillOpacity: 0.7,
              });
            this.addPopup(positionData, p[2], marker);
            positions.push(marker);
          }
        });
        break;
      case 'dots':
      default:
        positionData.positions.forEach(p => {
          if ((this._hiddenData || []).filter((i) => i === positionData.key).length === 0) {
            const marker = Leaflet.circleMarker(
              {lat: p[0], lng: p[1]}, {
                radius: positionData.baseRadius,
                color: positionData.borderColor,
                fillColor: positionData.color,
                fillOpacity: 1,
              });
            this.addPopup(positionData, p[2], marker);
            positions.push(marker);
          }
        });
        break;
    }
    return positions;
  }

  public resize(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.resizeMe();
      resolve(true);
    });
  }

  onRangeSliderChange(event) {
    this.LOG.debug(['onRangeSliderChange'], event);
    this.timeStart = event.value || moment().valueOf();
    this.timeEnd = event.highValue || moment().valueOf();
    this.drawMap();
  }

  onRangeSliderWindowChange(event) {
    this.LOG.debug(['onRangeSliderWindowChange'], event);
    if (this.lowerTimeBound !== event.min || this.upperTimeBound !== event.max) {
      this.lowerTimeBound = event.min;
      this.upperTimeBound = event.max;
    }
  }

  onSliderChange(event) {
    this.LOG.debug(['onSliderChange'], event, moment(event.value).toISOString());
    this._firstDraw = false;
    if (this.timeEnd !== event.value) {
      this.timeSpan = this.timeSpan || this._options.map.timeSpan;
      this.timeEnd = event.value || moment().valueOf();
      this.timeStart = (event.value || moment().valueOf()) - this.timeSpan / this.divider;
      this.LOG.debug(['onSliderChange'], moment(this.timeStart).toISOString(), moment(this.timeEnd).toISOString());
      this.change.emit(this.timeStart);
      this.drawMap();
    }
  }

  updateTimeSpan(event) {
    this.LOG.debug(['updateTimeSpan'], event.target.value);
    if (this.timeSpan !== event.target.value) {
      this.timeSpan = event.target.value;
      this.timeStart = (this.timeEnd || moment().valueOf()) - this.timeSpan / this.divider;
      this.drawMap();
    }
  }
}
