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

import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {Param} from '../../model/param';
import {Logger} from '../../utils/logger';
import Leaflet, {TileLayerOptions} from 'leaflet';
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
import {Timsort} from '../../utils/timsort';
import {antPath} from 'leaflet-ant-path';

/**
 *
 */
@Component({
  selector: 'warpview-map',
  templateUrl: './warp-view-map.component.html',
  styleUrls: ['./warp-view-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WarpViewMapComponent implements OnInit {

  @ViewChild('mapDiv', {static: true}) mapDiv: ElementRef<HTMLDivElement>;
  @ViewChild('wrapper', {static: true}) wrapper: ElementRef<HTMLDivElement>;
  @ViewChild('timeSlider', {static: false}) timeSlider: ElementRef<HTMLDivElement>;
  @ViewChild('timeRangeSlider', {static: false}) timeRangeSlider: ElementRef<HTMLDivElement>;

  @Input('heatData') heatData: any[] = [];
  @Input('responsive') responsive = false;
  @Input('showLegend') showLegend = true;
  @Input('width') width = ChartLib.DEFAULT_WIDTH;
  @Input('height') height = ChartLib.DEFAULT_HEIGHT;
  private bounds: Leaflet.LatLngBounds;

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
      const reZoom =
        options.map.startZoom !== this._options.map.startZoom
        || options.map.startLat !== this._options.map.startLat
        || options.map.startLong !== this._options.map.startLong;
      this._options = options;
      this.divider = GTSLib.getDivider(this._options.timeUnit);
      this.drawMap(reZoom);
    }
  }

  @Input('data') set data(data: any) {
    this.LOG.debug(['onData'], data);
    this.currentValuesMarkers = [];
    this.annotationsMarkers = [];
    this.positionArraysMarkers = [];
    if (!!data) {
      this._data = data;
      this.drawMap(true);
    }
  }

  get data() {
    return this._data;
  }

  @Input('hiddenData') set hiddenData(hiddenData: number[]) {
    this._hiddenData = hiddenData;
    this.drawMap(false);
  }

  get hiddenData(): number[] {
    return this._hiddenData;
  }

  @Output('change') change = new EventEmitter();
  @Output('chartDraw') chartDraw = new EventEmitter();

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
  private defOptions: Param = ChartLib.mergeDeep<Param>(
    new Param(), {
      map: {
        heatControls: false,
        tiles: [],
        dotsLimit: 1000,
      },
      timeMode: 'date',
      showRangeSelector: true,
      gridLineColor: '#8e8e8e',
      showDots: false,
      timeZone: 'UTC',
      timeUnit: 'us',
      bounds: {}
    });

  private _map: Leaflet.Map;
  private _hiddenData: number[];
  private currentValuesMarkers = [];
  private annotationsMarkers = [];
  private positionArraysMarkers = [];
  private _iconAnchor: Leaflet.PointExpression = [20, 52];
  private _popupAnchor: Leaflet.PointExpression = [0, -50];
  private _heatLayer: any;
  private pathData: any[] = [];
  private annotationsData: any[] = [];
  private positionData: any[] = [];
  private geoJson: any[] = [];
  private timeStart: number;
  private timeEnd: number;
  private firstDraw = true;
  private finalHeight = 0;
  // Layers
  private pathDataLayer = Leaflet.featureGroup();
  private annotationsDataLayer = Leaflet.featureGroup();
  private positionDataLayer = Leaflet.featureGroup();
  private tileLayerGroup = Leaflet.featureGroup();
  private geoJsonLayer = Leaflet.featureGroup();
  private tilesLayer: Leaflet.TileLayer;

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

  resizeMe() {
    this.LOG.debug(['resizeMe'], this.wrapper.nativeElement.parentElement.getBoundingClientRect());
    let height = this.wrapper.nativeElement.parentElement.getBoundingClientRect().height;
    const width = this.wrapper.nativeElement.parentElement.getBoundingClientRect().width;
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
    if (!!this._map) {
      setTimeout(() => this._map.invalidateSize());
    }
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

  private drawMap(reZoom: boolean) {
    this.LOG.debug(['drawMap'], this._data);
    this._options = ChartLib.mergeDeep<Param>(this._options, this.defOptions);
    this.timeStart = this._options.map.timeStart;
    moment.tz.setDefault(this._options.timeZone);
    let gts: any = this._data;
    if (!gts) {
      return;
    }
    if (typeof gts === 'string') {
      try {
        gts = JSON.parse(gts as string);
      } catch (error) {
        return;
      }
    }
    if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
      gts = gts[0];
    }
    if (!!this._map) {
      this._map.invalidateSize(true);
    }
    let dataList: any[];
    let params: any[];
    if (gts.data) {
      dataList = gts.data as any[];
      this._options = ChartLib.mergeDeep<Param>(gts.globalParams || {}, this._options);
      this.timeSpan = this.timeSpan || this._options.map.timeSpan;
      params = gts.params;
    } else {
      dataList = gts;
      params = [];
    }
    this.divider = GTSLib.getDivider(this._options.timeUnit);
    this.LOG.debug(['drawMap'], dataList, this._options, gts.globalParams);
    const flattenGTS = GTSLib.flatDeep(dataList);

    const size = flattenGTS.length;
    for (let i = 0; i < size; i++) {
      const item = flattenGTS[i];
      if (item.v) {
        Timsort.sort(item.v, (a, b) => a[0] - b[0]);
        item.i = i;
        i++;
      }
    }
    this.LOG.debug(['GTSLib.flatDeep(dataList)'], flattenGTS);
    this.displayMap({gts: flattenGTS, params}, reZoom);
  }

  private icon(color: string, marker = '') {
    const c = `${color.slice(1)}`;
    const m = marker !== '' ? marker : 'circle';
    return Leaflet.icon({
      iconUrl: `https://cdn.mapmarker.io/api/v1/font-awesome/v4/pin?icon=fa-${m}&iconSize=17&size=40&hoffset=${m === 'circle' ? 0 : -1}&voffset=-4&color=fff&background=${c}`,
      iconAnchor: this._iconAnchor,
      popupAnchor: this._popupAnchor
    });
  }

  private patchMapTileGapBug() {
    // Workaround for 1px lines appearing in some browsers due to fractional transforms
    // and resulting anti-aliasing. adapted from @cmulders' solution:
    // https://github.com/Leaflet/Leaflet/issues/3575#issuecomment-150544739
    // @ts-ignore
    const originalInitTile = Leaflet.GridLayer.prototype._initTile;
    if (originalInitTile.isPatched) {
      return;
    }
    Leaflet.GridLayer.include({
      _initTile(tile) {
        originalInitTile.call(this, tile);
        const tileSize = this.getTileSize();
        tile.style.width = tileSize.x + 1.5 + 'px';
        tile.style.height = tileSize.y + 1 + 'px';
      }
    });
    // @ts-ignore
    Leaflet.GridLayer.prototype._initTile.isPatched = true;
  }

  private displayMap(data: { gts: any[], params: any[] }, reDraw = false) {
    this.currentValuesMarkers = [];
    this.LOG.debug(['drawMap'], data, this._options, this._hiddenData || []);
    if (!this.lowerTimeBound) {
      this.lowerTimeBound = this._options.map.timeSliderMin / this.divider;
      this.upperTimeBound = this._options.map.timeSliderMax / this.divider;
    }
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
    if (data.gts.length === 0) {
      return;
    }
    this.pathData = MapLib.toLeafletMapPaths(data, this._hiddenData || [], this.divider, this._options.scheme) || [];
    this.annotationsData = MapLib.annotationsToLeafletPositions(data, this._hiddenData, this.divider, this._options.scheme) || [];
    this.positionData = MapLib.toLeafletMapPositionArray(data, this._hiddenData || [], this._options.scheme) || [];
    this.geoJson = MapLib.toGeoJSON(data);
    this.LOG.debug(['displayMap'], this.pathData, this.annotationsData, this.positionData);

    if (this._options.map.mapType !== 'NONE') {
      const map = MapLib.mapTypes[this._options.map.mapType || 'DEFAULT'];
      const mapOpts: TileLayerOptions = {
        maxZoom: 24,
        maxNativeZoom: 19,
      };
      if (map.attribution) {
        mapOpts.attribution = map.attribution;
      }
      if (map.subdomains) {
        mapOpts.subdomains = map.subdomains;
      }
      this.tilesLayer = Leaflet.tileLayer(map.link, mapOpts);
    }

    if (!!this._map) {
      this.LOG.debug(['displayMap'], 'map exists');
      this.pathDataLayer.clearLayers();
      this.annotationsDataLayer.clearLayers();
      this.positionDataLayer.clearLayers();
      this.geoJsonLayer.clearLayers();
      this.tileLayerGroup.clearLayers();
    } else {
      this.LOG.debug(['displayMap'], 'build map');
      this._map = Leaflet.map(this.mapDiv.nativeElement, {
        preferCanvas: true,
        layers: [this.tileLayerGroup, this.geoJsonLayer, this.pathDataLayer, this.annotationsDataLayer, this.positionDataLayer],
        zoomAnimation: true,
        maxZoom: 24
      });
      this.tilesLayer.addTo(this._map);
      this.LOG.debug(['displayMap'], 'build map', this.tilesLayer);
      this.geoJsonLayer.bringToBack();
      this.tilesLayer.bringToBack(); // TODO: tester
      this._map.on('load', () => this.LOG.debug(['displayMap', 'load'], this._map.getCenter().lng, this.currentLong, this._map.getZoom()));
      this._map.on('zoomend', () => {
        if (!this.firstDraw) {
          this.LOG.debug(['moveend'], this._map.getCenter());
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
    }

    let size = (this.pathData || []).length;
    this.LOG.debug(['displayMap'], 'build map done', size);
    for (let i = 0; i < size; i++) {
      const d = this.pathData[i];
      if (!!d) {
        const plottedGts: any = this.updateGtsPath(d);
        if (!!plottedGts) {
          this.currentValuesMarkers.push(plottedGts.beforeCurrentValue);
          this.currentValuesMarkers.push(plottedGts.afterCurrentValue);
          this.currentValuesMarkers.push(plottedGts.currentValue);
        }
      }
    }
    this.LOG.debug(['displayMap'], 'this.pathData', this.pathData);
    size = (this.annotationsData || []).length;
    for (let i = 0; i < size; i++) {
      const d = this.annotationsData[i];
      const plottedGts: any = this.updateGtsPath(d);
      if (!!plottedGts) {
        if (d.render === 'line') {
          this.currentValuesMarkers.push(plottedGts.beforeCurrentValue);
          this.currentValuesMarkers.push(plottedGts.afterCurrentValue);
        }
        this.currentValuesMarkers.push(plottedGts.currentValue);
      }
    }
    if (!!this._map) {
      this.pathDataLayer = Leaflet.featureGroup(this.currentValuesMarkers || []).addTo(this._map);
    }
    this.LOG.debug(['displayMap', 'annotationsMarkers'], this.annotationsMarkers);
    this.LOG.debug(['displayMap', 'this.hiddenData'], this.hiddenData);
    this.LOG.debug(['displayMap', 'this.positionData'], this.positionData);
    // Create the positions arrays
    size = (this.positionData || []).length;
    for (let i = 0; i < size; i++) {
      const d = this.positionData[i];
      this.positionArraysMarkers = this.positionArraysMarkers.concat(this.updatePositionArray(d));
    }
    this.LOG.debug(['displayMap'], 'this.po sitionData');
    size = (this.annotationsData || []).length;
    for (let i = 0; i < size; i++) {
      const d = this.annotationsData[i];
      this.positionArraysMarkers = this.positionArraysMarkers.concat(this.updateAnnotation(d));
    }
    this.LOG.debug(['displayMap'], 'this.annotationsData');

    (this._options.map.tiles || []).forEach((t) => { // TODO to test
      this.LOG.debug(['displayMap'], t);
      if (this._options.map.showTimeRange) {
        this.tileLayerGroup.addLayer(Leaflet.tileLayer(t
            .replace('{start}', moment(this.timeStart).toISOString())
            .replace('{end}', moment(this.timeEnd).toISOString()), {
            subdomains: 'abcd',
            maxNativeZoom: 19,
            maxZoom: 40
          }
        ));
      } else {
        this.tileLayerGroup.addLayer(Leaflet.tileLayer(t, {
          subdomains: 'abcd',
          maxNativeZoom: 19,
          maxZoom: 40
        }));
      }
    });
    this.LOG.debug(['displayMap'], 'this.tiles');

    this.LOG.debug(['displayMap', 'positionArraysMarkers'], this.positionArraysMarkers);
    this.LOG.debug(['displayMap', 'annotationsMarkers'], this.annotationsMarkers);

    size = (this.positionArraysMarkers || []).length;
    for (let i = 0; i < size; i++) {
      const m = this.positionArraysMarkers[i];
      m.addTo(this.positionDataLayer);
    }
    size = (this.annotationsMarkers || []).length;
    for (let i = 0; i < size; i++) {
      const m = this.annotationsMarkers[i];
      m.addTo(this.annotationsDataLayer);
    }

    this.LOG.debug(['displayMap', 'geoJson'], this.geoJson);
    size = (this.geoJson || []).length;
    for (let i = 0; i < size; i++) {
      const m = this.geoJson[i];
      const color = ColorLib.getColor(i, this._options.scheme);
      const opts = {
        style: () => ({
          color: (data.params && data.params[i]) ? data.params[i].color || color : color,
          fillColor: (data.params && data.params[i])
            ? ColorLib.transparentize(data.params[i].fillColor || color)
            : ColorLib.transparentize(color),
        })
      } as any;
      if (m.geometry.type === 'Point') {
        opts.pointToLayer = (geoJsonPoint, latlng) => Leaflet.marker(latlng, {
          icon: this.icon(color, (data.params && data.params[i]) ? data.params[i].marker : 'circle'),
          opacity: 1,
        });
      }
      let display = '';
      const geoShape = Leaflet.geoJSON(m, opts);
      if (m.properties) {
        Object.keys(m.properties).forEach(k => display += `<b>${k}</b>: ${m.properties[k]}<br />`);
        geoShape.bindPopup(display);
      }
      geoShape.addTo(this.geoJsonLayer);
    }

    if (this.pathData.length > 0 || this.positionData.length > 0 || this.annotationsData.length > 0 || this.geoJson.length > 0) {
      // Fit map to curves
      const group = Leaflet.featureGroup([this.geoJsonLayer, this.annotationsDataLayer, this.positionDataLayer, this.pathDataLayer]);
      this.LOG.debug(['displayMap', 'setView'], 'fitBounds', group.getBounds());
      this.LOG.debug(['displayMap', 'setView'], {lat: this.currentLat, lng: this.currentLong}, {
        lat: this._options.map.startLat,
        lng: this._options.map.startLong
      });
      this.bounds = group.getBounds();
      setTimeout(() => {
        if (!!this.bounds && this.bounds.isValid()) {
          if ((this.currentLat || this._options.map.startLat) && (this.currentLong || this._options.map.startLong)) {
            this.LOG.debug(['displayMap', 'setView'], 'fitBounds', 'already have bounds');
            this._map.setView({
                lat: this.currentLat || this._options.map.startLat || 0,
                lng: this.currentLong || this._options.map.startLong || 0
              }, this.currentZoom || this._options.map.startZoom || 10,
              {animate: false, duration: 500});
          } else {
            this.LOG.debug(['displayMap', 'setView'], 'fitBounds', 'this.bounds', this.bounds);
            this._map.fitBounds(this.bounds, {padding: [1, 1], animate: false, duration: 0});
          }
          this.currentLat = this._map.getCenter().lat;
          this.currentLong = this._map.getCenter().lng;
          //  this.currentZoom = this._map.getZoom();
        } else {
          this.LOG.debug(['displayMap', 'setView'], 'invalid bounds', {lat: this.currentLat, lng: this.currentLong});
          this._map.setView({
              lat: this.currentLat || this._options.map.startLat || 0,
              lng: this.currentLong || this._options.map.startLong || 0
            }, this.currentZoom || this._options.map.startZoom || 10,
            {
              animate: false,
              duration: 500
            });
        }
      }, 10);
    } else {
      this.LOG.debug(['displayMap', 'lost'], 'lost', this.currentZoom, this._options.map.startZoom);
      this._map.setView(
        [
          this.currentLat || this._options.map.startLat || 0,
          this.currentLong || this._options.map.startLong || 0
        ],
        this.currentZoom || this._options.map.startZoom || 2,
        {
          animate: false,
          duration: 0
        }
      );
    }
    if (this.heatData && this.heatData.length > 0) {
      this._heatLayer = (Leaflet as any).heatLayer(this.heatData, {
        radius: this._options.map.heatRadius,
        blur: this._options.map.heatBlur,
        minOpacity: this._options.map.heatOpacity
      });
      this._heatLayer.addTo(this._map);
    }
    this.firstDraw = false;
    this.resizeMe();
    this.patchMapTileGapBug();
    this.chartDraw.emit(true);
  }

  updateAnnotation(gts) {
    const positions = [];
    let icon;
    let size;
    switch (gts.render) {
      case 'marker':
        icon = this.icon(gts.color, gts.marker);
        size = (gts.path || []).length;
        for (let i = 0; i < size; i++) {
          const g = gts.path[i];
          const marker = Leaflet.marker(g, {icon, opacity: 1});
          marker.bindPopup(g.val.toString());
          positions.push(marker);
        }
        break;
      case 'weightedDots':
        size = (gts.path || []).length;
        for (let i = 0; i < size; i++) {
          const p = gts.path[i];
          if ((this._hiddenData || []).filter(h => h === gts.key).length === 0) {
            let v = parseInt(p.val, 10);
            if (isNaN(v)) {
              v = 0;
            }
            const radius = (v - (gts.minValue || 0)) * 50 / (gts.maxValue || 50);
            const marker = Leaflet.circleMarker(
              p, {
                radius: radius === 0 ? 1 : radius,
                color: gts.borderColor,
                fillColor: gts.color, fillOpacity: 0.5,
                weight: 1
              });
            this.addPopup(gts, p.val, marker);
            positions.push(marker);
          }
        }
        break;
      case 'dots':
      default:
        size = (gts.path || []).length;
        for (let i = 0; i < size; i++) {
          const g = gts.path[i];
          const marker = Leaflet.circleMarker(
            g, {
              radius: gts.baseRadius,
              color: gts.color,
              fillColor: gts.color,
              fillOpacity: 1
            }
          );
          marker.bindPopup(g.val.toString());
          positions.push(marker);
        }
        break;
    }
    return positions;
  }

  private updateGtsPath(gts: any) {


    const beforeCurrentValue = antPath(MapLib.pathDataToLeaflet(gts.path, {to: 0}), {
      "delay": 800,
      "dashArray": [
        100,
        100
      ],
      "weight": 5,
      "color": gts.color,
      "pulseColor": "#FFFFFF",
      "paused": false,
      "reverse": false,
      "hardwareAccelerated": true
    });
    const afterCurrentValue = antPath(MapLib.pathDataToLeaflet(gts.path, {from: 0}), {
      "delay": 800,
      "dashArray": [
        100,
        100
      ],
      "weight": 5,
      "color": gts.color,
      "pulseColor": "#FFFFFF",
      "paused": false,
      "reverse": false,
      "hardwareAccelerated": true
    });
    /*const beforeCurrentValue = Leaflet.polyline(
      , {
        color: gts.color,
        opacity: 1,
      });*/
    /*const afterCurrentValue = Leaflet.polyline(
      MapLib.pathDataToLeaflet(gts.path, {from: 0}), {
        color: gts.color,
        opacity: 0.7,
      });*/
    let currentValue;
    // Let's verify we have a path... No path, no marker
    const size = (gts.path || []).length;
    for (let i = 0; i < size; i++) {
      const p = gts.path[i];
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
        .bindPopup(`<p>${date}</p><p><b>${gts.key}</b>: ${p.val.toString()}</p>`);
    }
    if (size > 0) {
      return {
        beforeCurrentValue,
        afterCurrentValue,
        currentValue,
      };
    } else {
      return undefined;
    }
  }

  private addPopup(positionData: any, value: any, marker: any) {
    if (!!positionData) {
      let content = '';
      if (positionData.key) {
        content = `<p><b>${positionData.key}</b>: ${value || 'na'}</p>`;
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
    let size;
    this.LOG.debug(['updatePositionArray'], positionData);
    switch (positionData.render) {
      case 'path':
        polyline = Leaflet.polyline(positionData.positions, {color: positionData.color, opacity: 1});
        positions.push(polyline);
        break;
      case 'marker':
        icon = this.icon(positionData.color, positionData.marker);
        size = (positionData.positions || []).length;
        for (let i = 0; i < size; i++) {
          const p = positionData.positions[i];
          if ((this.hiddenData || []).filter(h => h === positionData.key).length === 0) {
            const marker = Leaflet.marker({lat: p[0], lng: p[1]}, {icon, opacity: 1});
            this.addPopup(positionData, p[2], marker);
            positions.push(marker);
          }
          this.LOG.debug(['updatePositionArray', 'build marker'], icon);
        }
        break;
      case 'coloredWeightedDots':
        this.LOG.debug(['updatePositionArray', 'coloredWeightedDots'], positionData);
        result = [];
        inStep = [];
        for (let j = 0; j < positionData.numColorSteps; j++) {
          result[j] = 0;
          inStep[j] = 0;
        }
        size = (positionData.positions || []).length;
        for (let i = 0; i < size; i++) {
          const p = positionData.positions[i];
          if ((this._hiddenData || []).filter(h => h === positionData.key).length === 0) {
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
        }
        break;
      case 'weightedDots':
        size = (positionData.positions || []).length;
        for (let i = 0; i < size; i++) {
          const p = positionData.positions[i];
          if ((this._hiddenData || []).filter(h => h === positionData.key).length === 0) {
            const marker = Leaflet.circleMarker(
              {lat: p[0], lng: p[1]}, {
                radius: positionData.baseRadius * (parseInt(p[4], 10) + 1),
                color: positionData.borderColor,
                fillColor: positionData.color, fillOpacity: 0.7,
              });
            this.addPopup(positionData, p[2], marker);
            positions.push(marker);
          }
        }
        break;
      case 'dots':
      default:
        size = (positionData.positions || []).length;
        for (let i = 0; i < size; i++) {
          const p = positionData.positions[i];
          if ((this._hiddenData || []).filter(h => h === positionData.key).length === 0) {
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
        }
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
    this.drawMap(true);
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
      this.drawMap(true);
    }
  }

  updateTimeSpan(event) {
    this.LOG.debug(['updateTimeSpan'], event.target.value);
    if (this.timeSpan !== event.target.value) {
      this.timeSpan = event.target.value;
      this.timeStart = (this.timeEnd || moment().valueOf()) - this.timeSpan / this.divider;
      this.drawMap(true);
    }
  }
}
