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
import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Param } from '../../model/param';
import { Logger } from '../../utils/logger';
import Leaflet from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';
import { ColorLib } from '../../utils/color-lib';
import { ChartLib } from '../../utils/chart-lib';
import { DataModel } from '../../model/dataModel';
import { MapLib } from '../../utils/map-lib';
import { GTSLib } from '../../utils/gts.lib';
import moment from 'moment-timezone';
import deepEqual from 'deep-equal';
import { SizeService } from '../../services/resize.service';
import { Timsort } from '../../utils/timsort';
import { antPath } from 'leaflet-ant-path';
/**
 *
 */
export class WarpViewMapComponent {
    constructor(el, sizeService, renderer) {
        this.el = el;
        this.sizeService = sizeService;
        this.renderer = renderer;
        this.heatData = [];
        this.responsive = false;
        this.showLegend = true;
        this.width = ChartLib.DEFAULT_WIDTH;
        this.height = ChartLib.DEFAULT_HEIGHT;
        this.change = new EventEmitter();
        this.chartDraw = new EventEmitter();
        this.divider = 1;
        this._options = new Param();
        this._firstDraw = true;
        this._debug = false;
        this.defOptions = ChartLib.mergeDeep(new Param(), {
            map: {
                heatControls: false,
                tiles: [],
                dotsLimit: 1000,
                animate: false
            },
            timeMode: 'date',
            showRangeSelector: true,
            gridLineColor: '#8e8e8e',
            showDots: false,
            timeZone: 'UTC',
            timeUnit: 'us',
            bounds: {}
        });
        this.pointslayer = [];
        this.annotationsMarkers = [];
        this.positionArraysMarkers = [];
        this._iconAnchor = [20, 38];
        this._popupAnchor = [0, -50];
        this.pathData = [];
        this.positionData = [];
        this.geoJson = [];
        this.firstDraw = true;
        this.finalHeight = 0;
        // Layers
        this.pathDataLayer = Leaflet.featureGroup();
        this.positionDataLayer = Leaflet.featureGroup();
        this.tileLayerGroup = Leaflet.featureGroup();
        this.geoJsonLayer = Leaflet.featureGroup();
        this.LOG = new Logger(WarpViewMapComponent, this.debug);
        this.LOG.debug(['constructor'], this.debug);
        this.sizeService.sizeChanged$.subscribe(() => {
            if (this._map) {
                this.resizeMe();
            }
        });
    }
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    get debug() {
        return this._debug;
    }
    set options(options) {
        this.LOG.debug(['onOptions'], options);
        if (!deepEqual(this._options, options)) {
            const reZoom = options.map.startZoom !== this._options.map.startZoom
                || options.map.startLat !== this._options.map.startLat
                || options.map.startLong !== this._options.map.startLong;
            this._options = options;
            this.divider = GTSLib.getDivider(this._options.timeUnit);
            this.drawMap(reZoom);
        }
    }
    set data(data) {
        this.LOG.debug(['onData'], data);
        this.pointslayer = [];
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
    set hiddenData(hiddenData) {
        this._hiddenData = hiddenData;
        this.drawMap(false);
    }
    get hiddenData() {
        return this._hiddenData;
    }
    ngOnInit() {
        this._options = ChartLib.mergeDeep(this.defOptions, this._options);
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
        this._heatLayer.setOptions({ radius: event.detail.valueAsNumber });
        this.LOG.debug(['heatRadiusDidChange'], event.detail.valueAsNumber);
    }
    heatBlurDidChange(event) {
        this._heatLayer.setOptions({ blur: event.detail.valueAsNumber });
        this.LOG.debug(['heatBlurDidChange'], event.detail.valueAsNumber);
    }
    heatOpacityDidChange(event) {
        const minOpacity = event.detail.valueAsNumber / 100;
        this._heatLayer.setOptions({ minOpacity });
        this.LOG.debug(['heatOpacityDidChange'], event.detail.valueAsNumber);
    }
    drawMap(reZoom) {
        this.LOG.debug(['drawMap'], this._data);
        this._options = ChartLib.mergeDeep(this.defOptions, this._options);
        this.timeStart = this._options.map.timeStart;
        moment.tz.setDefault(this._options.timeZone);
        let gts = this._data;
        if (!gts) {
            return;
        }
        if (typeof gts === 'string') {
            try {
                gts = JSON.parse(gts);
            }
            catch (error) {
                return;
            }
        }
        if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
            gts = gts[0];
        }
        if (!!this._map) {
            this._map.invalidateSize(true);
        }
        let dataList;
        let params;
        this.LOG.debug(['drawMap', 'this._options'], Object.assign({}, this._options));
        if (gts.data) {
            dataList = gts.data;
            this._options = ChartLib.mergeDeep(gts.globalParams || {}, this._options);
            this.timeSpan = this.timeSpan || this._options.map.timeSpan;
            params = gts.params;
        }
        else {
            dataList = gts;
            params = [];
        }
        this.divider = GTSLib.getDivider(this._options.timeUnit);
        this.LOG.debug(['drawMap'], dataList, this._options, gts.globalParams);
        const flattenGTS = GTSLib.flatDeep(dataList);
        const size = flattenGTS.length;
        for (let i = 0; i < size; i++) {
            const item = flattenGTS[i];
            if (GTSLib.isGts(item)) {
                Timsort.sort(item.v, (a, b) => a[0] - b[0]);
                item.i = i;
                i++;
            }
        }
        this.LOG.debug(['GTSLib.flatDeep(dataList)'], flattenGTS);
        this.displayMap({ gts: flattenGTS, params }, reZoom);
    }
    icon(color, marker = '') {
        const c = `${color.slice(1)}`;
        const m = marker !== '' ? marker : 'circle';
        return Leaflet.icon({
            // tslint:disable-next-line:max-line-length
            iconUrl: `https://cdn.mapmarker.io/api/v1/font-awesome/v4/pin?icon=fa-${m}&iconSize=17&size=40&hoffset=${m === 'circle' ? 0 : -1}&voffset=-4&color=fff&background=${c}`,
            iconAnchor: this._iconAnchor,
            popupAnchor: this._popupAnchor
        });
    }
    patchMapTileGapBug() {
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
    displayMap(data, reDraw = false) {
        this.pointslayer = [];
        this.LOG.debug(['drawMap'], data, this._options, this._hiddenData || []);
        if (!this.lowerTimeBound) {
            this.lowerTimeBound = this._options.map.timeSliderMin / this.divider;
            this.upperTimeBound = this._options.map.timeSliderMax / this.divider;
        }
        let height = this.height || ChartLib.DEFAULT_HEIGHT;
        const width = this.width || ChartLib.DEFAULT_WIDTH;
        if (this.responsive && this.finalHeight === 0) {
            this.resizeMe();
        }
        else {
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
        this.pathData = MapLib.toLeafletMapPaths(data, this._hiddenData || [], this._options.scheme) || [];
        this.LOG.debug(['displayMap'], 'this.pathData', this.pathData);
        this.positionData = MapLib.toLeafletMapPositionArray(data, this._hiddenData || [], this._options.scheme) || [];
        this.LOG.debug(['displayMap'], 'this.positionData', this.positionData);
        this.geoJson = MapLib.toGeoJSON(data);
        this.LOG.debug(['displayMap'], 'this.geoJson', this.geoJson);
        if (this._options.map.mapType !== 'NONE') {
            const map = MapLib.mapTypes[this._options.map.mapType || 'DEFAULT'];
            this.LOG.debug(['displayMap'], 'map', map);
            const mapOpts = {
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
            this.positionDataLayer.clearLayers();
            this.geoJsonLayer.clearLayers();
            this.tileLayerGroup.clearLayers();
        }
        else {
            this.LOG.debug(['displayMap'], 'build map');
            this._map = Leaflet.map(this.mapDiv.nativeElement, {
                preferCanvas: true,
                layers: [this.tileLayerGroup, this.geoJsonLayer, this.pathDataLayer, this.positionDataLayer],
                zoomAnimation: true,
                maxZoom: 24
            });
            this.geoJsonLayer.bringToBack();
            this.tilesLayer.bringToBack(); // TODO: tester
            this._map.on('load', () => this.LOG.debug(['displayMap', 'load'], this._map.getCenter().lng, this.currentLong, this._map.getZoom()));
            this._map.on('zoomend', () => {
                if (!this.firstDraw) {
                    this.currentZoom = this._map.getZoom();
                }
            });
            this._map.on('moveend', () => {
                if (!this.firstDraw) {
                    this.currentLat = this._map.getCenter().lat;
                    this.currentLong = this._map.getCenter().lng;
                }
            });
        }
        this.tilesLayer.addTo(this.tileLayerGroup);
        this.LOG.debug(['displayMap'], 'build map', this.tilesLayer);
        // For each path
        const pathDataSize = (this.pathData || []).length;
        for (let i = 0; i < pathDataSize; i++) {
            const path = this.pathData[i];
            if (!!path) {
                this.updateGtsPath(path);
            }
        }
        // For each position
        const positionsSize = (this.positionData || []).length;
        for (let i = 0; i < positionsSize; i++) {
            this.updatePositionArray(this.positionData[i]);
        }
        (this._options.map.tiles || []).forEach((t) => {
            this.LOG.debug(['displayMap'], t);
            if (this._options.map.showTimeRange) {
                this.tileLayerGroup.addLayer(Leaflet.tileLayer(t
                    .replace('{start}', moment(this.timeStart).toISOString())
                    .replace('{end}', moment(this.timeEnd).toISOString()), {
                    subdomains: 'abcd',
                    maxNativeZoom: 19,
                    maxZoom: 40
                }));
            }
            else {
                this.tileLayerGroup.addLayer(Leaflet.tileLayer(t, {
                    subdomains: 'abcd',
                    maxNativeZoom: 19,
                    maxZoom: 40
                }));
            }
        });
        this.LOG.debug(['displayMap', 'geoJson'], this.geoJson);
        const size = (this.geoJson || []).length;
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
            };
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
        if (this.pathData.length > 0 || this.positionData.length > 0 || this.geoJson.length > 0) {
            // Fit map to curves
            const group = Leaflet.featureGroup([this.geoJsonLayer, this.positionDataLayer, this.pathDataLayer]);
            this.LOG.debug(['displayMap', 'setView'], 'fitBounds', group.getBounds());
            this.LOG.debug(['displayMap', 'setView'], { lat: this.currentLat, lng: this.currentLong }, {
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
                        }, this.currentZoom || this._options.map.startZoom || 10, { animate: false, duration: 500 });
                    }
                    else {
                        this.LOG.debug(['displayMap', 'setView'], 'fitBounds', 'this.bounds', this.bounds);
                        this._map.fitBounds(this.bounds, { padding: [1, 1], animate: false, duration: 0 });
                    }
                    this.currentLat = this._map.getCenter().lat;
                    this.currentLong = this._map.getCenter().lng;
                }
                else {
                    this.LOG.debug(['displayMap', 'setView'], 'invalid bounds', { lat: this.currentLat, lng: this.currentLong });
                    this._map.setView({
                        lat: this.currentLat || this._options.map.startLat || 0,
                        lng: this.currentLong || this._options.map.startLong || 0
                    }, this.currentZoom || this._options.map.startZoom || 10, {
                        animate: false,
                        duration: 500
                    });
                }
            }, 10);
        }
        else {
            this.LOG.debug(['displayMap', 'lost'], 'lost', this.currentZoom, this._options.map.startZoom);
            this._map.setView([
                this.currentLat || this._options.map.startLat || 0,
                this.currentLong || this._options.map.startLong || 0
            ], this.currentZoom || this._options.map.startZoom || 2, {
                animate: false,
                duration: 0
            });
        }
        if (this.heatData && this.heatData.length > 0) {
            this._heatLayer = Leaflet.heatLayer(this.heatData, {
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
    getGTSDots(gts) {
        const dots = [];
        let icon;
        let size;
        switch (gts.render) {
            case 'marker':
                icon = this.icon(gts.color, gts.marker);
                size = (gts.path || []).length;
                for (let i = 0; i < size; i++) {
                    const g = gts.path[i];
                    const marker = Leaflet.marker(g, { icon, opacity: 1 });
                    this.addPopup(gts, g.val, g.ts, marker);
                    dots.push(marker);
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
                        const radius = 50 * v / ((gts.maxValue || 1) - (gts.minValue || 0));
                        const marker = Leaflet.circleMarker(p, {
                            radius: radius === 0 ? 1 : radius,
                            color: gts.borderColor || 'transparent',
                            fillColor: gts.color, fillOpacity: 0.5,
                            weight: 1
                        });
                        this.addPopup(gts, p.val, p.ts, marker);
                        dots.push(marker);
                    }
                }
                break;
            case 'dots':
            default:
                size = (gts.path || []).length;
                for (let i = 0; i < size; i++) {
                    const g = gts.path[i];
                    const marker = Leaflet.circleMarker(g, {
                        radius: gts.baseRadius || MapLib.BASE_RADIUS,
                        color: gts.color,
                        fillColor: gts.color,
                        fillOpacity: 1
                    });
                    this.addPopup(gts, g.val, g.ts, marker);
                    dots.push(marker);
                }
                break;
        }
        return dots;
    }
    updateGtsPath(gts) {
        const path = MapLib.pathDataToLeaflet(gts.path);
        const group = Leaflet.featureGroup();
        if ((path || []).length > 1 && !!gts.line && gts.render === 'dots') {
            if (!!this._options.map.animate) {
                group.addLayer(antPath(path || [], {
                    delay: 800, dashArray: [10, 100],
                    weight: 5, color: ColorLib.transparentize(gts.color, 0.5),
                    pulseColor: gts.color,
                    paused: false, reverse: false, hardwareAccelerated: true, hardwareAcceleration: true
                }));
            }
            else {
                group.addLayer(Leaflet.polyline(path || [], { color: gts.color, opacity: 0.5 }));
            }
        }
        const dots = this.getGTSDots(gts);
        const size = (dots || []).length;
        for (let i = 0; i < size; i++) {
            group.addLayer(dots[i]);
        }
        this.pathDataLayer.addLayer(group);
    }
    addPopup(positionData, value, ts, marker) {
        if (!!positionData) {
            let date;
            if (ts && !this._options.timeMode || this._options.timeMode !== 'timestamp') {
                date = (GTSLib.toISOString(ts, this.divider, this._options.timeZone) || '')
                    .replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '');
            }
            let content = '';
            content = `<p>${date}</p><p><b>${positionData.key}</b>: ${value || 'na'}</p>`;
            Object.keys(positionData.properties || []).forEach(k => content += `<b>${k}</b>: ${positionData.properties[k]}<br />`);
            marker.bindPopup(content);
        }
    }
    updatePositionArray(positionData) {
        const group = Leaflet.featureGroup();
        if ((this._hiddenData || []).filter(h => h === positionData.key).length === 0) {
            const path = MapLib.updatePositionArrayToLeaflet(positionData.positions);
            if ((positionData.positions || []).length > 1 && !!positionData.line) {
                if (!!this._options.map.animate) {
                    group.addLayer(antPath(path || [], {
                        delay: 800, dashArray: [10, 100],
                        weight: 5, color: ColorLib.transparentize(positionData.color, 0.5),
                        pulseColor: positionData.color,
                        paused: false, reverse: false, hardwareAccelerated: true, hardwareAcceleration: true
                    }));
                }
                else {
                    group.addLayer(Leaflet.polyline(path || [], { color: positionData.color, opacity: 0.5 }));
                }
            }
            let icon;
            let result;
            let inStep;
            let size;
            this.LOG.debug(['updatePositionArray'], positionData);
            switch (positionData.render) {
                case 'marker':
                    icon = this.icon(positionData.color, positionData.marker);
                    size = (positionData.positions || []).length;
                    for (let i = 0; i < size; i++) {
                        const p = positionData.positions[i];
                        const marker = Leaflet.marker({ lat: p[0], lng: p[1] }, { icon, opacity: 1 });
                        this.addPopup(positionData, p[2], undefined, marker);
                        group.addLayer(marker);
                    }
                    this.LOG.debug(['updatePositionArray', 'build marker'], icon);
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
                        const radius = (parseInt(p[2], 10) - (positionData.minValue || 0)) * 50 / (positionData.maxValue || 50);
                        this.LOG.debug(['updatePositionArray', 'coloredWeightedDots', 'radius'], positionData.baseRadius * p[4]);
                        const marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
                            radius,
                            color: positionData.borderColor || positionData.color,
                            fillColor: ColorLib.rgb2hex(positionData.colorGradient[p[5]].r, positionData.colorGradient[p[5]].g, positionData.colorGradient[p[5]].b),
                            fillOpacity: 0.3,
                        });
                        this.addPopup(positionData, p[2], undefined, marker);
                        group.addLayer(marker);
                    }
                    break;
                case 'weightedDots':
                    size = (positionData.positions || []).length;
                    for (let i = 0; i < size; i++) {
                        const p = positionData.positions[i];
                        const radius = (parseInt(p[2], 10) - (positionData.minValue || 0)) * 50 / (positionData.maxValue || 50);
                        const marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
                            radius,
                            color: positionData.borderColor || positionData.color,
                            fillColor: positionData.color,
                            weight: 2,
                            fillOpacity: 0.3,
                        });
                        this.addPopup(positionData, p[2], undefined, marker);
                        group.addLayer(marker);
                    }
                    break;
                case 'dots':
                default:
                    size = (positionData.positions || []).length;
                    for (let i = 0; i < size; i++) {
                        const p = positionData.positions[i];
                        const marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
                            radius: positionData.baseRadius || MapLib.BASE_RADIUS,
                            color: positionData.borderColor || positionData.color,
                            fillColor: positionData.color,
                            weight: 2,
                            fillOpacity: 0.7,
                        });
                        this.addPopup(positionData, p[2] || 'na', undefined, marker);
                        group.addLayer(marker);
                    }
                    break;
            }
        }
        this.positionDataLayer.addLayer(group);
    }
    resize() {
        return new Promise(resolve => {
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
WarpViewMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-map',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" #wrapper (resized)=\"resizeMe()\">\n  <div class=\"map-container\">\n    <div #mapDiv></div>\n    <div *ngIf=\"_options.map.showTimeSlider && !_options.map.showTimeRange\" #timeSlider>\n      <warpview-slider\n        [min]=\"_options.map.timeSliderMin / divider\" [max]=\"_options.map.timeSliderMax / divider\"\n        [value]=\"minTimeValue / divider\"\n        [step]=\"_options.map.timeSliderStep\" [mode]=\"_options.map.timeSliderMode\"\n        (change)=\"onSliderChange($event)\"\n        [debug]=\"debug\"\n      ></warpview-slider>\n    </div>\n    <div *ngIf=\"_options.map.showTimeSlider && _options.map.showTimeRange\" #timeRangeSlider>\n      <!--    <warpview-range-slider *ngIf=\"!_options.map.timeSpan && lowerTimeBound\"\n                                  [min]=\"lowerTimeBound\" [max]=\"upperTimeBound\"\n                                  [minValue]=\"minTimeValue / divider\"\n                                  [maxValue]=\"maxTimeValue / divider\"\n                                  [step]=\"_options.map.timeSliderStep\"\n                                  [mode]=\"_options.map.timeSliderMode\"\n                                  [debug]=\"_debug\"\n                                  (change)=\"onRangeSliderChange($event)\"\n           ></warpview-range-slider>-->\n\n      <warpview-range-slider\n        [min]=\"(_options.map.timeSliderMin / divider)\" [max]=\"(_options.map.timeSliderMax / divider)\"\n        [minValue]=\"minTimeValue / divider\"\n        [maxValue]=\"maxTimeValue / divider\"\n        [mode]=\"_options.map.timeSliderMode\"\n        [debug]=\"debug\"\n        (change)=\"onRangeSliderWindowChange($event)\"\n      ></warpview-range-slider>\n      <warpview-slider *ngIf=\"_options.map.timeSpan && lowerTimeBound\"\n                       [min]=\"lowerTimeBound\" [max]=\"upperTimeBound\"\n                       [step]=\"(this.timeSpan || this._options.map.timeSpan) / divider\"\n                       [mode]=\"_options.map.timeSliderMode\"\n                       [debug]=\"debug\"\n                       (change)=\"onSliderChange($event)\"\n      ></warpview-slider>\n      <div *ngIf=\"_options.map?.timeSpan\">\n        <label for=\"timeSpan\">Timespan: </label>\n        <select id=\"timeSpan\" (change)=\"updateTimeSpan($event)\">\n          <option *ngFor=\"let ts of _options.map.timeSpanList\" [value]=\"ts.value\">{{ts.label}}</option>\n        </select>\n      </div>\n    </div>\n    <warpview-heatmap-sliders\n      *ngIf=\"_options.map.heatControls\"\n      (heatRadiusDidChange)=\"heatRadiusDidChange($event)\"\n      (heatBlurDidChange)=\"heatBlurDidChange($event)\"\n      (heatOpacityDidChange)=\"heatOpacityDidChange($event)\"\n    ></warpview-heatmap-sliders>\n  </div>\n\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */@import url(/home/xavier/workspace/warp-view/node_modules/leaflet/dist/leaflet.css);@import url(/home/xavier/workspace/warp-view/node_modules/leaflet.markercluster/dist/MarkerCluster.css);@import url(/home/xavier/workspace/warp-view/node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css);:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host,warp-view-map,warpview-map{height:100%;min-height:100px;width:100%}:host .status,warp-view-map .status,warpview-map .status{bottom:0}:host div.wrapper,warp-view-map div.wrapper,warpview-map div.wrapper{height:100%;min-height:100px;overflow:hidden;padding:var(--warp-view-map-margin);width:100%}:host div.wrapper div.leaflet-container,:host div.wrapper div.map-container,warp-view-map div.wrapper div.leaflet-container,warp-view-map div.wrapper div.map-container,warpview-map div.wrapper div.leaflet-container,warpview-map div.wrapper div.map-container{height:100%;min-height:100px;min-width:100%;overflow:hidden;position:relative;width:100%}:host div.wrapper .leaflet-container,warp-view-map div.wrapper .leaflet-container,warpview-map div.wrapper .leaflet-container{height:100%;min-height:100%;min-width:100%;width:100%}"]
            },] }
];
WarpViewMapComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: SizeService },
    { type: Renderer2 }
];
WarpViewMapComponent.propDecorators = {
    mapDiv: [{ type: ViewChild, args: ['mapDiv', { static: true },] }],
    wrapper: [{ type: ViewChild, args: ['wrapper', { static: true },] }],
    timeSlider: [{ type: ViewChild, args: ['timeSlider',] }],
    timeRangeSlider: [{ type: ViewChild, args: ['timeRangeSlider',] }],
    heatData: [{ type: Input, args: ['heatData',] }],
    responsive: [{ type: Input, args: ['responsive',] }],
    showLegend: [{ type: Input, args: ['showLegend',] }],
    width: [{ type: Input, args: ['width',] }],
    height: [{ type: Input, args: ['height',] }],
    debug: [{ type: Input, args: ['debug',] }],
    options: [{ type: Input, args: ['options',] }],
    data: [{ type: Input, args: ['data',] }],
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    change: [{ type: Output, args: ['change',] }],
    chartDraw: [{ type: Output, args: ['chartDraw',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwLXZpZXcvcHJvamVjdHMvd2FycHZpZXctbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1tYXAvd2FycC12aWV3LW1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNsSSxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDeEMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sT0FBMkIsTUFBTSxTQUFTLENBQUM7QUFDbEQsT0FBTyxjQUFjLENBQUM7QUFDdEIsT0FBTyx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzNDLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBQ3JDLE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDMUQsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxPQUFPLEVB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QUUzQixLQUFLLFNBQUMsVUFBVTt5QkFDaEIsS0FBSyxTQUFDLFlBQVk7eUJBQ2xCLEtBQUssU0FBQyxZQUFZO29CQUNsQixLQUFLLFNBQUMsT0FBTztxQkFDYixLQUFLLFNBQUMsUUFBUTtvQkFHZCxLQUFLLFNBQUMsT0FBTztzQkFTYixLQUFLLFNBQUMsU0FBUzttQkFhZixLQUFLLFNBQUMsTUFBTTt5QkFlWixLQUFLLFNBQUMsWUFBWTtxQkFTbEIsTUFBTSxTQUFDLFFBQVE7d0JBQ2YsTUFBTSxTQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgUmVuZGVyZXIyLCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IExlYWZsZXQsIHtUaWxlTGF5ZXJPcHRpb25zfSBmcm9tICdsZWFmbGV0JztcbmltcG9ydCAnbGVhZmxldC5oZWF0JztcbmltcG9ydCAnbGVhZmxldC5tYXJrZXJjbHVzdGVyJztcbmltcG9ydCB7Q29sb3JMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NvbG9yLWxpYic7XG5pbXBvcnQge0NoYXJ0TGlifSBmcm9tICcuLi8uLi91dGlscy9jaGFydC1saWInO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge01hcExpYn0gZnJvbSAnLi4vLi4vdXRpbHMvbWFwLWxpYic7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudC10aW1lem9uZSc7XG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xuaW1wb3J0IHtTaXplU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtUaW1zb3J0fSBmcm9tICcuLi8uLi91dGlscy90aW1zb3J0JztcbmltcG9ydCB7YW50UGF0aH0gZnJvbSAnbGVhZmxldC1hbnQtcGF0aCc7XG5cbi8qKlxuICpcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctbWFwJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1tYXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctbWFwLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdNYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBWaWV3Q2hpbGQoJ21hcERpdicsIHtzdGF0aWM6IHRydWV9KSBtYXBEaXY6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCd3cmFwcGVyJywge3N0YXRpYzogdHJ1ZX0pIHdyYXBwZXI6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCd0aW1lU2xpZGVyJykgdGltZVNsaWRlcjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3RpbWVSYW5nZVNsaWRlcicpIHRpbWVSYW5nZVNsaWRlcjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG5cbiAgQElucHV0KCdoZWF0RGF0YScpIGhlYXREYXRhOiBhbnlbXSA9IFtdO1xuICBASW5wdXQoJ3Jlc3BvbnNpdmUnKSByZXNwb25zaXZlID0gZmFsc2U7XG4gIEBJbnB1dCgnc2hvd0xlZ2VuZCcpIHNob3dMZWdlbmQgPSB0cnVlO1xuICBASW5wdXQoJ3dpZHRoJykgd2lkdGggPSBDaGFydExpYi5ERUZBVUxUX1dJRFRIO1xuICBASW5wdXQoJ2hlaWdodCcpIGhlaWdodCA9IENoYXJ0TGliLkRFRkFVTFRfSEVJR0hUO1xuICBwcml2YXRlIGJvdW5kczogTGVhZmxldC5MYXRMbmdCb3VuZHM7XG5cbiAgQElucHV0KCdkZWJ1ZycpIHNldCBkZWJ1ZyhkZWJ1ZzogYm9vbGVhbikge1xuICAgIHRoaXMuX2RlYnVnID0gZGVidWc7XG4gICAgdGhpcy5MT0cuc2V0RGVidWcoZGVidWcpO1xuICB9XG5cbiAgZ2V0IGRlYnVnKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWJ1ZztcbiAgfVxuXG4gIEBJbnB1dCgnb3B0aW9ucycpIHNldCBvcHRpb25zKG9wdGlvbnM6IFBhcmFtKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvbk9wdGlvbnMnXSwgb3B0aW9ucyk7XG4gICAgaWYgKCFkZWVwRXF1YWwodGhpcy5fb3B0aW9ucywgb3B0aW9ucykpIHtcbiAgICAgIGNvbnN0IHJlWm9vbSA9XG4gICAgICAgIG9wdGlvbnMubWFwLnN0YXJ0Wm9vbSAhPT0gdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRab29tXG4gICAgICAgIHx8IG9wdGlvbnMubWFwLnN0YXJ0TGF0ICE9PSB0aGlzLl9vcHRpb25zLm1hcC5zdGFydExhdFxuICAgICAgICB8fCBvcHRpb25zLm1hcC5zdGFydExvbmcgIT09IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TG9uZztcbiAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgdGhpcy5kaXZpZGVyID0gR1RTTGliLmdldERpdmlkZXIodGhpcy5fb3B0aW9ucy50aW1lVW5pdCk7XG4gICAgICB0aGlzLmRyYXdNYXAocmVab29tKTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2RhdGEnKSBzZXQgZGF0YShkYXRhOiBhbnkpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uRGF0YSddLCBkYXRhKTtcbiAgICB0aGlzLnBvaW50c2xheWVyID0gW107XG4gICAgdGhpcy5hbm5vdGF0aW9uc01hcmtlcnMgPSBbXTtcbiAgICB0aGlzLnBvc2l0aW9uQXJyYXlzTWFya2VycyA9IFtdO1xuICAgIGlmICghIWRhdGEpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgdGhpcy5kcmF3TWFwKHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBkYXRhKCkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICB9XG5cbiAgQElucHV0KCdoaWRkZW5EYXRhJykgc2V0IGhpZGRlbkRhdGEoaGlkZGVuRGF0YTogbnVtYmVyW10pIHtcbiAgICB0aGlzLl9oaWRkZW5EYXRhID0gaGlkZGVuRGF0YTtcbiAgICB0aGlzLmRyYXdNYXAoZmFsc2UpO1xuICB9XG5cbiAgZ2V0IGhpZGRlbkRhdGEoKTogbnVtYmVyW10ge1xuICAgIHJldHVybiB0aGlzLl9oaWRkZW5EYXRhO1xuICB9XG5cbiAgQE91dHB1dCgnY2hhbmdlJykgY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCdjaGFydERyYXcnKSBjaGFydERyYXcgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY3VycmVudFpvb206IG51bWJlcjtcbiAgY3VycmVudExhdDogbnVtYmVyO1xuICBjdXJyZW50TG9uZzogbnVtYmVyO1xuICBtaW5UaW1lVmFsdWU6IG51bWJlcjtcbiAgbWF4VGltZVZhbHVlOiBudW1iZXI7XG4gIGRpdmlkZXIgPSAxO1xuICBsb3dlclRpbWVCb3VuZDogbnVtYmVyO1xuICB1cHBlclRpbWVCb3VuZDogbnVtYmVyO1xuICB0aW1lU3BhbjogbnVtYmVyO1xuICBfb3B0aW9uczogUGFyYW0gPSBuZXcgUGFyYW0oKTtcblxuICBwcml2YXRlIF9maXJzdERyYXcgPSB0cnVlO1xuICBwcml2YXRlIExPRzogTG9nZ2VyO1xuICBwcml2YXRlIF9kYXRhOiBhbnk7XG4gIHByaXZhdGUgX2RlYnVnID0gZmFsc2U7XG4gIHByaXZhdGUgZGVmT3B0aW9uczogUGFyYW0gPSBDaGFydExpYi5tZXJnZURlZXA8UGFyYW0+KFxuICAgIG5ldyBQYXJhbSgpLCB7XG4gICAgICBtYXA6IHtcbiAgICAgICAgaGVhdENvbnRyb2xzOiBmYWxzZSxcbiAgICAgICAgdGlsZXM6IFtdLFxuICAgICAgICBkb3RzTGltaXQ6IDEwMDAsXG4gICAgICAgIGFuaW1hdGU6IGZhbHNlXG4gICAgICB9LFxuICAgICAgdGltZU1vZGU6ICdkYXRlJyxcbiAgICAgIHNob3dSYW5nZVNlbGVjdG9yOiB0cnVlLFxuICAgICAgZ3JpZExpbmVDb2xvcjogJyM4ZThlOGUnLFxuICAgICAgc2hvd0RvdHM6IGZhbHNlLFxuICAgICAgdGltZVpvbmU6ICdVVEMnLFxuICAgICAgdGltZVVuaXQ6ICd1cycsXG4gICAgICBib3VuZHM6IHt9XG4gICAgfSk7XG5cbiAgcHJpdmF0ZSBfbWFwOiBMZWFmbGV0Lk1hcDtcbiAgcHJpdmF0ZSBfaGlkZGVuRGF0YTogbnVtYmVyW107XG4gIHByaXZhdGUgcG9pbnRzbGF5ZXIgPSBbXTtcbiAgcHJpdmF0ZSBhbm5vdGF0aW9uc01hcmtlcnMgPSBbXTtcbiAgcHJpdmF0ZSBwb3NpdGlvbkFycmF5c01hcmtlcnMgPSBbXTtcbiAgcHJpdmF0ZSBfaWNvbkFuY2hvcjogTGVhZmxldC5Qb2ludEV4cHJlc3Npb24gPSBbMjAsIDM4XTtcbiAgcHJpdmF0ZSBfcG9wdXBBbmNob3I6IExlYWZsZXQuUG9pbnRFeHByZXNzaW9uID0gWzAsIC01MF07XG4gIHByaXZhdGUgX2hlYXRMYXllcjogYW55O1xuICBwcml2YXRlIHBhdGhEYXRhOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIHBvc2l0aW9uRGF0YTogYW55W10gPSBbXTtcbiAgcHJpdmF0ZSBnZW9Kc29uOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIHRpbWVTdGFydDogbnVtYmVyO1xuICBwcml2YXRlIHRpbWVFbmQ6IG51bWJlcjtcbiAgcHJpdmF0ZSBmaXJzdERyYXcgPSB0cnVlO1xuICBwcml2YXRlIGZpbmFsSGVpZ2h0ID0gMDtcbiAgLy8gTGF5ZXJzXG4gIHByaXZhdGUgcGF0aERhdGFMYXllciA9IExlYWZsZXQuZmVhdHVyZUdyb3VwKCk7XG4gIHByaXZhdGUgcG9zaXRpb25EYXRhTGF5ZXIgPSBMZWFmbGV0LmZlYXR1cmVHcm91cCgpO1xuICBwcml2YXRlIHRpbGVMYXllckdyb3VwID0gTGVhZmxldC5mZWF0dXJlR3JvdXAoKTtcbiAgcHJpdmF0ZSBnZW9Kc29uTGF5ZXIgPSBMZWFmbGV0LmZlYXR1cmVHcm91cCgpO1xuICBwcml2YXRlIHRpbGVzTGF5ZXI6IExlYWZsZXQuVGlsZUxheWVyO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3TWFwQ29tcG9uZW50LCB0aGlzLmRlYnVnKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnN0cnVjdG9yJ10sIHRoaXMuZGVidWcpO1xuICAgIHRoaXMuc2l6ZVNlcnZpY2Uuc2l6ZUNoYW5nZWQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fbWFwKSB7XG4gICAgICAgIHRoaXMucmVzaXplTWUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAodGhpcy5kZWZPcHRpb25zLCB0aGlzLl9vcHRpb25zKSBhcyBQYXJhbTtcbiAgfVxuXG4gIHJlc2l6ZU1lKCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsncmVzaXplTWUnXSwgdGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gICAgbGV0IGhlaWdodCA9IHRoaXMud3JhcHBlci5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy5tYXAuc2hvd1RpbWVTbGlkZXIgJiYgdGhpcy50aW1lU2xpZGVyICYmIHRoaXMudGltZVNsaWRlci5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBoZWlnaHQgLT0gdGhpcy50aW1lU2xpZGVyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgIH1cbiAgICBpZiAodGhpcy5fb3B0aW9ucy5tYXAuc2hvd1RpbWVSYW5nZSAmJiB0aGlzLnRpbWVSYW5nZVNsaWRlciAmJiB0aGlzLnRpbWVSYW5nZVNsaWRlci5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBoZWlnaHQgLT0gdGhpcy50aW1lUmFuZ2VTbGlkZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgfVxuICAgIHRoaXMuZmluYWxIZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLm1hcERpdi5uYXRpdmVFbGVtZW50LCAnd2lkdGgnLCAnY2FsYygnICsgd2lkdGggKyAncHggLSAnXG4gICAgICArIGdldENvbXB1dGVkU3R5bGUodGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJy0td2FycC12aWV3LW1hcC1tYXJnaW4nKS50cmltKClcbiAgICAgICsgJyAtICdcbiAgICAgICsgZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLndyYXBwZXIubmF0aXZlRWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgnLS13YXJwLXZpZXctbWFwLW1hcmdpbicpLnRyaW0oKVxuICAgICAgKyAnKScpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5tYXBEaXYubmF0aXZlRWxlbWVudCwgJ2hlaWdodCcsICdjYWxjKCcgKyBoZWlnaHQgKyAncHggLSAnXG4gICAgICArIGdldENvbXB1dGVkU3R5bGUodGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJy0td2FycC12aWV3LW1hcC1tYXJnaW4nKS50cmltKClcbiAgICAgICsgJyAtICdcbiAgICAgICsgZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLndyYXBwZXIubmF0aXZlRWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgnLS13YXJwLXZpZXctbWFwLW1hcmdpbicpLnRyaW0oKVxuICAgICAgKyAnKScpO1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICBpZiAoISF0aGlzLl9tYXApIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fbWFwLmludmFsaWRhdGVTaXplKCkpO1xuICAgIH1cbiAgfVxuXG4gIGhlYXRSYWRpdXNEaWRDaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLl9oZWF0TGF5ZXIuc2V0T3B0aW9ucyh7cmFkaXVzOiBldmVudC5kZXRhaWwudmFsdWVBc051bWJlcn0pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGVhdFJhZGl1c0RpZENoYW5nZSddLCBldmVudC5kZXRhaWwudmFsdWVBc051bWJlcik7XG4gIH1cblxuICBoZWF0Qmx1ckRpZENoYW5nZShldmVudCkge1xuICAgIHRoaXMuX2hlYXRMYXllci5zZXRPcHRpb25zKHtibHVyOiBldmVudC5kZXRhaWwudmFsdWVBc051bWJlcn0pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGVhdEJsdXJEaWRDaGFuZ2UnXSwgZXZlbnQuZGV0YWlsLnZhbHVlQXNOdW1iZXIpO1xuICB9XG5cbiAgaGVhdE9wYWNpdHlEaWRDaGFuZ2UoZXZlbnQpIHtcbiAgICBjb25zdCBtaW5PcGFjaXR5ID0gZXZlbnQuZGV0YWlsLnZhbHVlQXNOdW1iZXIgLyAxMDA7XG4gICAgdGhpcy5faGVhdExheWVyLnNldE9wdGlvbnMoe21pbk9wYWNpdHl9KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hlYXRPcGFjaXR5RGlkQ2hhbmdlJ10sIGV2ZW50LmRldGFpbC52YWx1ZUFzTnVtYmVyKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd01hcChyZVpvb206IGJvb2xlYW4pIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdNYXAnXSwgdGhpcy5fZGF0YSk7XG4gICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLmRlZk9wdGlvbnMsIHRoaXMuX29wdGlvbnMpIGFzIFBhcmFtO1xuICAgIHRoaXMudGltZVN0YXJ0ID0gdGhpcy5fb3B0aW9ucy5tYXAudGltZVN0YXJ0O1xuICAgIG1vbWVudC50ei5zZXREZWZhdWx0KHRoaXMuX29wdGlvbnMudGltZVpvbmUpO1xuICAgIGxldCBndHM6IGFueSA9IHRoaXMuX2RhdGE7XG4gICAgaWYgKCFndHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBndHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBndHMgPSBKU09OLnBhcnNlKGd0cyBhcyBzdHJpbmcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoR1RTTGliLmlzQXJyYXkoZ3RzKSAmJiBndHNbMF0gJiYgKGd0c1swXSBpbnN0YW5jZW9mIERhdGFNb2RlbCB8fCBndHNbMF0uaGFzT3duUHJvcGVydHkoJ2RhdGEnKSkpIHtcbiAgICAgIGd0cyA9IGd0c1swXTtcbiAgICB9XG4gICAgaWYgKCEhdGhpcy5fbWFwKSB7XG4gICAgICB0aGlzLl9tYXAuaW52YWxpZGF0ZVNpemUodHJ1ZSk7XG4gICAgfVxuICAgIGxldCBkYXRhTGlzdDogYW55W107XG4gICAgbGV0IHBhcmFtczogYW55W107XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3TWFwJywgJ3RoaXMuX29wdGlvbnMnXSwgey4uLiB0aGlzLl9vcHRpb25zfSk7XG4gICAgaWYgKGd0cy5kYXRhKSB7XG4gICAgICBkYXRhTGlzdCA9IGd0cy5kYXRhIGFzIGFueVtdO1xuICAgICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcDxQYXJhbT4oZ3RzLmdsb2JhbFBhcmFtcyB8fCB7fSwgdGhpcy5fb3B0aW9ucyk7XG4gICAgICB0aGlzLnRpbWVTcGFuID0gdGhpcy50aW1lU3BhbiB8fCB0aGlzLl9vcHRpb25zLm1hcC50aW1lU3BhbjtcbiAgICAgIHBhcmFtcyA9IGd0cy5wYXJhbXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGFMaXN0ID0gZ3RzO1xuICAgICAgcGFyYW1zID0gW107XG4gICAgfVxuICAgIHRoaXMuZGl2aWRlciA9IEdUU0xpYi5nZXREaXZpZGVyKHRoaXMuX29wdGlvbnMudGltZVVuaXQpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd01hcCddLCBkYXRhTGlzdCwgdGhpcy5fb3B0aW9ucywgZ3RzLmdsb2JhbFBhcmFtcyk7XG4gICAgY29uc3QgZmxhdHRlbkdUUyA9IEdUU0xpYi5mbGF0RGVlcChkYXRhTGlzdCk7XG5cbiAgICBjb25zdCBzaXplID0gZmxhdHRlbkdUUy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBmbGF0dGVuR1RTW2ldO1xuICAgICAgaWYgKEdUU0xpYi5pc0d0cyhpdGVtKSkge1xuICAgICAgICBUaW1zb3J0LnNvcnQoaXRlbS52LCAoYSwgYikgPT4gYVswXSAtIGJbMF0pO1xuICAgICAgICBpdGVtLmkgPSBpO1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnR1RTTGliLmZsYXREZWVwKGRhdGFMaXN0KSddLCBmbGF0dGVuR1RTKTtcbiAgICB0aGlzLmRpc3BsYXlNYXAoe2d0czogZmxhdHRlbkdUUywgcGFyYW1zfSwgcmVab29tKTtcbiAgfVxuXG4gIHByaXZhdGUgaWNvbihjb2xvcjogc3RyaW5nLCBtYXJrZXIgPSAnJykge1xuICAgIGNvbnN0IGMgPSBgJHtjb2xvci5zbGljZSgxKX1gO1xuICAgIGNvbnN0IG0gPSBtYXJrZXIgIT09ICcnID8gbWFya2VyIDogJ2NpcmNsZSc7XG4gICAgcmV0dXJuIExlYWZsZXQuaWNvbih7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICBpY29uVXJsOiBgaHR0cHM6Ly9jZG4ubWFwbWFya2VyLmlvL2FwaS92MS9mb250LWF3ZXNvbWUvdjQvcGluP2ljb249ZmEtJHttfSZpY29uU2l6ZT0xNyZzaXplPTQwJmhvZmZzZXQ9JHttID09PSAnY2lyY2xlJyA/IDAgOiAtMX0mdm9mZnNldD0tNCZjb2xvcj1mZmYmYmFja2dyb3VuZD0ke2N9YCxcbiAgICAgIGljb25BbmNob3I6IHRoaXMuX2ljb25BbmNob3IsXG4gICAgICBwb3B1cEFuY2hvcjogdGhpcy5fcG9wdXBBbmNob3JcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcGF0Y2hNYXBUaWxlR2FwQnVnKCkge1xuICAgIC8vIFdvcmthcm91bmQgZm9yIDFweCBsaW5lcyBhcHBlYXJpbmcgaW4gc29tZSBicm93c2VycyBkdWUgdG8gZnJhY3Rpb25hbCB0cmFuc2Zvcm1zXG4gICAgLy8gYW5kIHJlc3VsdGluZyBhbnRpLWFsaWFzaW5nLiBhZGFwdGVkIGZyb20gQGNtdWxkZXJzJyBzb2x1dGlvbjpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTGVhZmxldC9MZWFmbGV0L2lzc3Vlcy8zNTc1I2lzc3VlY29tbWVudC0xNTA1NDQ3MzlcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3Qgb3JpZ2luYWxJbml0VGlsZSA9IExlYWZsZXQuR3JpZExheWVyLnByb3RvdHlwZS5faW5pdFRpbGU7XG4gICAgaWYgKG9yaWdpbmFsSW5pdFRpbGUuaXNQYXRjaGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIExlYWZsZXQuR3JpZExheWVyLmluY2x1ZGUoe1xuICAgICAgX2luaXRUaWxlKHRpbGUpIHtcbiAgICAgICAgb3JpZ2luYWxJbml0VGlsZS5jYWxsKHRoaXMsIHRpbGUpO1xuICAgICAgICBjb25zdCB0aWxlU2l6ZSA9IHRoaXMuZ2V0VGlsZVNpemUoKTtcbiAgICAgICAgdGlsZS5zdHlsZS53aWR0aCA9IHRpbGVTaXplLnggKyAxLjUgKyAncHgnO1xuICAgICAgICB0aWxlLnN0eWxlLmhlaWdodCA9IHRpbGVTaXplLnkgKyAxICsgJ3B4JztcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgTGVhZmxldC5HcmlkTGF5ZXIucHJvdG90eXBlLl9pbml0VGlsZS5pc1BhdGNoZWQgPSB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwbGF5TWFwKGRhdGE6IHsgZ3RzOiBhbnlbXSwgcGFyYW1zOiBhbnlbXSB9LCByZURyYXcgPSBmYWxzZSkge1xuICAgIHRoaXMucG9pbnRzbGF5ZXIgPSBbXTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdNYXAnXSwgZGF0YSwgdGhpcy5fb3B0aW9ucywgdGhpcy5faGlkZGVuRGF0YSB8fCBbXSk7XG4gICAgaWYgKCF0aGlzLmxvd2VyVGltZUJvdW5kKSB7XG4gICAgICB0aGlzLmxvd2VyVGltZUJvdW5kID0gdGhpcy5fb3B0aW9ucy5tYXAudGltZVNsaWRlck1pbiAvIHRoaXMuZGl2aWRlcjtcbiAgICAgIHRoaXMudXBwZXJUaW1lQm91bmQgPSB0aGlzLl9vcHRpb25zLm1hcC50aW1lU2xpZGVyTWF4IC8gdGhpcy5kaXZpZGVyO1xuICAgIH1cbiAgICBsZXQgaGVpZ2h0ID0gdGhpcy5oZWlnaHQgfHwgQ2hhcnRMaWIuREVGQVVMVF9IRUlHSFQ7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLndpZHRoIHx8IENoYXJ0TGliLkRFRkFVTFRfV0lEVEg7XG4gICAgaWYgKHRoaXMucmVzcG9uc2l2ZSAmJiB0aGlzLmZpbmFsSGVpZ2h0ID09PSAwKSB7XG4gICAgICB0aGlzLnJlc2l6ZU1lKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLl9vcHRpb25zLm1hcC5zaG93VGltZVNsaWRlciAmJiB0aGlzLnRpbWVTbGlkZXIgJiYgdGhpcy50aW1lU2xpZGVyLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgaGVpZ2h0IC09IHRoaXMudGltZVNsaWRlci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9vcHRpb25zLm1hcC5zaG93VGltZVJhbmdlICYmIHRoaXMudGltZVJhbmdlU2xpZGVyICYmIHRoaXMudGltZVJhbmdlU2xpZGVyLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgaGVpZ2h0IC09IHRoaXMudGltZVJhbmdlU2xpZGVyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgaWYgKGRhdGEuZ3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBhdGhEYXRhID0gTWFwTGliLnRvTGVhZmxldE1hcFBhdGhzKGRhdGEsIHRoaXMuX2hpZGRlbkRhdGEgfHwgW10sIHRoaXMuX29wdGlvbnMuc2NoZW1lKSB8fCBbXTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnXSwgJ3RoaXMucGF0aERhdGEnLCB0aGlzLnBhdGhEYXRhKTtcbiAgICB0aGlzLnBvc2l0aW9uRGF0YSA9IE1hcExpYi50b0xlYWZsZXRNYXBQb3NpdGlvbkFycmF5KGRhdGEsIHRoaXMuX2hpZGRlbkRhdGEgfHwgW10sIHRoaXMuX29wdGlvbnMuc2NoZW1lKSB8fCBbXTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnXSwgJ3RoaXMucG9zaXRpb25EYXRhJywgdGhpcy5wb3NpdGlvbkRhdGEpO1xuICAgIHRoaXMuZ2VvSnNvbiA9IE1hcExpYi50b0dlb0pTT04oZGF0YSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJ10sICd0aGlzLmdlb0pzb24nLCB0aGlzLmdlb0pzb24pO1xuICAgIGlmICh0aGlzLl9vcHRpb25zLm1hcC5tYXBUeXBlICE9PSAnTk9ORScpIHtcbiAgICAgIGNvbnN0IG1hcCA9IE1hcExpYi5tYXBUeXBlc1t0aGlzLl9vcHRpb25zLm1hcC5tYXBUeXBlIHx8ICdERUZBVUxUJ107XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnXSwgJ21hcCcsIG1hcCk7XG4gICAgICBjb25zdCBtYXBPcHRzOiBUaWxlTGF5ZXJPcHRpb25zID0ge1xuICAgICAgICBtYXhab29tOiAyNCxcbiAgICAgICAgbWF4TmF0aXZlWm9vbTogMTksXG4gICAgICB9O1xuICAgICAgaWYgKG1hcC5hdHRyaWJ1dGlvbikge1xuICAgICAgICBtYXBPcHRzLmF0dHJpYnV0aW9uID0gbWFwLmF0dHJpYnV0aW9uO1xuICAgICAgfVxuICAgICAgaWYgKG1hcC5zdWJkb21haW5zKSB7XG4gICAgICAgIG1hcE9wdHMuc3ViZG9tYWlucyA9IG1hcC5zdWJkb21haW5zO1xuICAgICAgfVxuICAgICAgdGhpcy50aWxlc0xheWVyID0gTGVhZmxldC50aWxlTGF5ZXIobWFwLmxpbmssIG1hcE9wdHMpO1xuICAgIH1cblxuICAgIGlmICghIXRoaXMuX21hcCkge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJ10sICdtYXAgZXhpc3RzJyk7XG4gICAgICB0aGlzLnBhdGhEYXRhTGF5ZXIuY2xlYXJMYXllcnMoKTtcbiAgICAgIHRoaXMucG9zaXRpb25EYXRhTGF5ZXIuY2xlYXJMYXllcnMoKTtcbiAgICAgIHRoaXMuZ2VvSnNvbkxheWVyLmNsZWFyTGF5ZXJzKCk7XG4gICAgICB0aGlzLnRpbGVMYXllckdyb3VwLmNsZWFyTGF5ZXJzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCddLCAnYnVpbGQgbWFwJyk7XG4gICAgICB0aGlzLl9tYXAgPSBMZWFmbGV0Lm1hcCh0aGlzLm1hcERpdi5uYXRpdmVFbGVtZW50LCB7XG4gICAgICAgIHByZWZlckNhbnZhczogdHJ1ZSxcbiAgICAgICAgbGF5ZXJzOiBbdGhpcy50aWxlTGF5ZXJHcm91cCwgdGhpcy5nZW9Kc29uTGF5ZXIsIHRoaXMucGF0aERhdGFMYXllciwgdGhpcy5wb3NpdGlvbkRhdGFMYXllcl0sXG4gICAgICAgIHpvb21BbmltYXRpb246IHRydWUsXG4gICAgICAgIG1heFpvb206IDI0XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZ2VvSnNvbkxheWVyLmJyaW5nVG9CYWNrKCk7XG4gICAgICB0aGlzLnRpbGVzTGF5ZXIuYnJpbmdUb0JhY2soKTsgLy8gVE9ETzogdGVzdGVyXG4gICAgICB0aGlzLl9tYXAub24oJ2xvYWQnLCAoKSA9PiB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnLCAnbG9hZCddLCB0aGlzLl9tYXAuZ2V0Q2VudGVyKCkubG5nLCB0aGlzLmN1cnJlbnRMb25nLCB0aGlzLl9tYXAuZ2V0Wm9vbSgpKSk7XG4gICAgICB0aGlzLl9tYXAub24oJ3pvb21lbmQnLCAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5maXJzdERyYXcpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRab29tID0gdGhpcy5fbWFwLmdldFpvb20oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9tYXAub24oJ21vdmVlbmQnLCAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5maXJzdERyYXcpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMYXQgPSB0aGlzLl9tYXAuZ2V0Q2VudGVyKCkubGF0O1xuICAgICAgICAgIHRoaXMuY3VycmVudExvbmcgPSB0aGlzLl9tYXAuZ2V0Q2VudGVyKCkubG5nO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy50aWxlc0xheWVyLmFkZFRvKHRoaXMudGlsZUxheWVyR3JvdXApO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCddLCAnYnVpbGQgbWFwJywgdGhpcy50aWxlc0xheWVyKTtcbiAgICAvLyBGb3IgZWFjaCBwYXRoXG4gICAgY29uc3QgcGF0aERhdGFTaXplID0gKHRoaXMucGF0aERhdGEgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGhEYXRhU2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBwYXRoID0gdGhpcy5wYXRoRGF0YVtpXTtcbiAgICAgIGlmICghIXBhdGgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVHdHNQYXRoKHBhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBGb3IgZWFjaCBwb3NpdGlvblxuICAgIGNvbnN0IHBvc2l0aW9uc1NpemUgPSAodGhpcy5wb3NpdGlvbkRhdGEgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9uc1NpemU7IGkrKykge1xuICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbkFycmF5KHRoaXMucG9zaXRpb25EYXRhW2ldKTtcbiAgICB9XG5cbiAgICAodGhpcy5fb3B0aW9ucy5tYXAudGlsZXMgfHwgW10pLmZvckVhY2goKHQpID0+IHsgLy8gVE9ETyB0byB0ZXN0XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnXSwgdCk7XG4gICAgICBpZiAodGhpcy5fb3B0aW9ucy5tYXAuc2hvd1RpbWVSYW5nZSkge1xuICAgICAgICB0aGlzLnRpbGVMYXllckdyb3VwLmFkZExheWVyKExlYWZsZXQudGlsZUxheWVyKHRcbiAgICAgICAgICAgIC5yZXBsYWNlKCd7c3RhcnR9JywgbW9tZW50KHRoaXMudGltZVN0YXJ0KS50b0lTT1N0cmluZygpKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ3tlbmR9JywgbW9tZW50KHRoaXMudGltZUVuZCkudG9JU09TdHJpbmcoKSksIHtcbiAgICAgICAgICAgIHN1YmRvbWFpbnM6ICdhYmNkJyxcbiAgICAgICAgICAgIG1heE5hdGl2ZVpvb206IDE5LFxuICAgICAgICAgICAgbWF4Wm9vbTogNDBcbiAgICAgICAgICB9XG4gICAgICAgICkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50aWxlTGF5ZXJHcm91cC5hZGRMYXllcihMZWFmbGV0LnRpbGVMYXllcih0LCB7XG4gICAgICAgICAgc3ViZG9tYWluczogJ2FiY2QnLFxuICAgICAgICAgIG1heE5hdGl2ZVpvb206IDE5LFxuICAgICAgICAgIG1heFpvb206IDQwXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnLCAnZ2VvSnNvbiddLCB0aGlzLmdlb0pzb24pO1xuICAgIGNvbnN0IHNpemUgPSAodGhpcy5nZW9Kc29uIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IG0gPSB0aGlzLmdlb0pzb25baV07XG4gICAgICBjb25zdCBjb2xvciA9IENvbG9yTGliLmdldENvbG9yKGksIHRoaXMuX29wdGlvbnMuc2NoZW1lKTtcbiAgICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAgIHN0eWxlOiAoKSA9PiAoe1xuICAgICAgICAgIGNvbG9yOiAoZGF0YS5wYXJhbXMgJiYgZGF0YS5wYXJhbXNbaV0pID8gZGF0YS5wYXJhbXNbaV0uY29sb3IgfHwgY29sb3IgOiBjb2xvcixcbiAgICAgICAgICBmaWxsQ29sb3I6IChkYXRhLnBhcmFtcyAmJiBkYXRhLnBhcmFtc1tpXSlcbiAgICAgICAgICAgID8gQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoZGF0YS5wYXJhbXNbaV0uZmlsbENvbG9yIHx8IGNvbG9yKVxuICAgICAgICAgICAgOiBDb2xvckxpYi50cmFuc3BhcmVudGl6ZShjb2xvciksXG4gICAgICAgIH0pXG4gICAgICB9IGFzIGFueTtcbiAgICAgIGlmIChtLmdlb21ldHJ5LnR5cGUgPT09ICdQb2ludCcpIHtcbiAgICAgICAgb3B0cy5wb2ludFRvTGF5ZXIgPSAoZ2VvSnNvblBvaW50LCBsYXRsbmcpID0+IExlYWZsZXQubWFya2VyKGxhdGxuZywge1xuICAgICAgICAgIGljb246IHRoaXMuaWNvbihjb2xvciwgKGRhdGEucGFyYW1zICYmIGRhdGEucGFyYW1zW2ldKSA/IGRhdGEucGFyYW1zW2ldLm1hcmtlciA6ICdjaXJjbGUnKSxcbiAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGxldCBkaXNwbGF5ID0gJyc7XG4gICAgICBjb25zdCBnZW9TaGFwZSA9IExlYWZsZXQuZ2VvSlNPTihtLCBvcHRzKTtcbiAgICAgIGlmIChtLnByb3BlcnRpZXMpIHtcbiAgICAgICAgT2JqZWN0LmtleXMobS5wcm9wZXJ0aWVzKS5mb3JFYWNoKGsgPT4gZGlzcGxheSArPSBgPGI+JHtrfTwvYj46ICR7bS5wcm9wZXJ0aWVzW2tdfTxiciAvPmApO1xuICAgICAgICBnZW9TaGFwZS5iaW5kUG9wdXAoZGlzcGxheSk7XG4gICAgICB9XG4gICAgICBnZW9TaGFwZS5hZGRUbyh0aGlzLmdlb0pzb25MYXllcik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGF0aERhdGEubGVuZ3RoID4gMCB8fCB0aGlzLnBvc2l0aW9uRGF0YS5sZW5ndGggPiAwIHx8IHRoaXMuZ2VvSnNvbi5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBGaXQgbWFwIHRvIGN1cnZlc1xuICAgICAgY29uc3QgZ3JvdXAgPSBMZWFmbGV0LmZlYXR1cmVHcm91cChbdGhpcy5nZW9Kc29uTGF5ZXIsIHRoaXMucG9zaXRpb25EYXRhTGF5ZXIsIHRoaXMucGF0aERhdGFMYXllcl0pO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJywgJ3NldFZpZXcnXSwgJ2ZpdEJvdW5kcycsIGdyb3VwLmdldEJvdW5kcygpKTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCcsICdzZXRWaWV3J10sIHtsYXQ6IHRoaXMuY3VycmVudExhdCwgbG5nOiB0aGlzLmN1cnJlbnRMb25nfSwge1xuICAgICAgICBsYXQ6IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TGF0LFxuICAgICAgICBsbmc6IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TG9uZ1xuICAgICAgfSk7XG4gICAgICB0aGlzLmJvdW5kcyA9IGdyb3VwLmdldEJvdW5kcygpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICghIXRoaXMuYm91bmRzICYmIHRoaXMuYm91bmRzLmlzVmFsaWQoKSkge1xuICAgICAgICAgIGlmICgodGhpcy5jdXJyZW50TGF0IHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TGF0KSAmJiAodGhpcy5jdXJyZW50TG9uZyB8fCB0aGlzLl9vcHRpb25zLm1hcC5zdGFydExvbmcpKSB7XG4gICAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnLCAnc2V0VmlldyddLCAnZml0Qm91bmRzJywgJ2FscmVhZHkgaGF2ZSBib3VuZHMnKTtcbiAgICAgICAgICAgIHRoaXMuX21hcC5zZXRWaWV3KHtcbiAgICAgICAgICAgICAgICBsYXQ6IHRoaXMuY3VycmVudExhdCB8fCB0aGlzLl9vcHRpb25zLm1hcC5zdGFydExhdCB8fCAwLFxuICAgICAgICAgICAgICAgIGxuZzogdGhpcy5jdXJyZW50TG9uZyB8fCB0aGlzLl9vcHRpb25zLm1hcC5zdGFydExvbmcgfHwgMFxuICAgICAgICAgICAgICB9LCB0aGlzLmN1cnJlbnRab29tIHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0Wm9vbSB8fCAxMCxcbiAgICAgICAgICAgICAge2FuaW1hdGU6IGZhbHNlLCBkdXJhdGlvbjogNTAwfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCcsICdzZXRWaWV3J10sICdmaXRCb3VuZHMnLCAndGhpcy5ib3VuZHMnLCB0aGlzLmJvdW5kcyk7XG4gICAgICAgICAgICB0aGlzLl9tYXAuZml0Qm91bmRzKHRoaXMuYm91bmRzLCB7cGFkZGluZzogWzEsIDFdLCBhbmltYXRlOiBmYWxzZSwgZHVyYXRpb246IDB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5jdXJyZW50TGF0ID0gdGhpcy5fbWFwLmdldENlbnRlcigpLmxhdDtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMb25nID0gdGhpcy5fbWFwLmdldENlbnRlcigpLmxuZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnLCAnc2V0VmlldyddLCAnaW52YWxpZCBib3VuZHMnLCB7bGF0OiB0aGlzLmN1cnJlbnRMYXQsIGxuZzogdGhpcy5jdXJyZW50TG9uZ30pO1xuICAgICAgICAgIHRoaXMuX21hcC5zZXRWaWV3KHtcbiAgICAgICAgICAgICAgbGF0OiB0aGlzLmN1cnJlbnRMYXQgfHwgdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRMYXQgfHwgMCxcbiAgICAgICAgICAgICAgbG5nOiB0aGlzLmN1cnJlbnRMb25nIHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TG9uZyB8fCAwXG4gICAgICAgICAgICB9LCB0aGlzLmN1cnJlbnRab29tIHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0Wm9vbSB8fCAxMCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYW5pbWF0ZTogZmFsc2UsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCAxMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCcsICdsb3N0J10sICdsb3N0JywgdGhpcy5jdXJyZW50Wm9vbSwgdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRab29tKTtcbiAgICAgIHRoaXMuX21hcC5zZXRWaWV3KFxuICAgICAgICBbXG4gICAgICAgICAgdGhpcy5jdXJyZW50TGF0IHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TGF0IHx8IDAsXG4gICAgICAgICAgdGhpcy5jdXJyZW50TG9uZyB8fCB0aGlzLl9vcHRpb25zLm1hcC5zdGFydExvbmcgfHwgMFxuICAgICAgICBdLFxuICAgICAgICB0aGlzLmN1cnJlbnRab29tIHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0Wm9vbSB8fCAyLFxuICAgICAgICB7XG4gICAgICAgICAgYW5pbWF0ZTogZmFsc2UsXG4gICAgICAgICAgZHVyYXRpb246IDBcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGVhdERhdGEgJiYgdGhpcy5oZWF0RGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9oZWF0TGF5ZXIgPSAoTGVhZmxldCBhcyBhbnkpLmhlYXRMYXllcih0aGlzLmhlYXREYXRhLCB7XG4gICAgICAgIHJhZGl1czogdGhpcy5fb3B0aW9ucy5tYXAuaGVhdFJhZGl1cyxcbiAgICAgICAgYmx1cjogdGhpcy5fb3B0aW9ucy5tYXAuaGVhdEJsdXIsXG4gICAgICAgIG1pbk9wYWNpdHk6IHRoaXMuX29wdGlvbnMubWFwLmhlYXRPcGFjaXR5XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2hlYXRMYXllci5hZGRUbyh0aGlzLl9tYXApO1xuICAgIH1cbiAgICB0aGlzLmZpcnN0RHJhdyA9IGZhbHNlO1xuICAgIHRoaXMucmVzaXplTWUoKTtcbiAgICB0aGlzLnBhdGNoTWFwVGlsZUdhcEJ1ZygpO1xuICAgIHRoaXMuY2hhcnREcmF3LmVtaXQodHJ1ZSk7XG4gIH1cblxuICBwcml2YXRlIGdldEdUU0RvdHMoZ3RzKSB7XG5cbiAgICBjb25zdCBkb3RzID0gW107XG4gICAgbGV0IGljb247XG4gICAgbGV0IHNpemU7XG4gICAgc3dpdGNoIChndHMucmVuZGVyKSB7XG4gICAgICBjYXNlICdtYXJrZXInOlxuICAgICAgICBpY29uID0gdGhpcy5pY29uKGd0cy5jb2xvciwgZ3RzLm1hcmtlcik7XG4gICAgICAgIHNpemUgPSAoZ3RzLnBhdGggfHwgW10pLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBnID0gZ3RzLnBhdGhbaV07XG4gICAgICAgICAgY29uc3QgbWFya2VyID0gTGVhZmxldC5tYXJrZXIoZywge2ljb24sIG9wYWNpdHk6IDF9KTtcbiAgICAgICAgICB0aGlzLmFkZFBvcHVwKGd0cywgZy52YWwsIGcudHMsIG1hcmtlcik7XG4gICAgICAgICAgZG90cy5wdXNoKG1hcmtlcik7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3ZWlnaHRlZERvdHMnOlxuICAgICAgICBzaXplID0gKGd0cy5wYXRoIHx8IFtdKS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgcCA9IGd0cy5wYXRoW2ldO1xuICAgICAgICAgIGlmICgodGhpcy5faGlkZGVuRGF0YSB8fCBbXSkuZmlsdGVyKGggPT4gaCA9PT0gZ3RzLmtleSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBsZXQgdiA9IHBhcnNlSW50KHAudmFsLCAxMCk7XG4gICAgICAgICAgICBpZiAoaXNOYU4odikpIHtcbiAgICAgICAgICAgICAgdiA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByYWRpdXMgPSA1MCAqIHYgLyAoKGd0cy5tYXhWYWx1ZSB8fCAxKSAtIChndHMubWluVmFsdWUgfHwgMCkpO1xuICAgICAgICAgICAgY29uc3QgbWFya2VyID0gTGVhZmxldC5jaXJjbGVNYXJrZXIoXG4gICAgICAgICAgICAgIHAsIHtcbiAgICAgICAgICAgICAgICByYWRpdXM6IHJhZGl1cyA9PT0gMCA/IDEgOiByYWRpdXMsXG4gICAgICAgICAgICAgICAgY29sb3I6IGd0cy5ib3JkZXJDb2xvciB8fCAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogZ3RzLmNvbG9yLCBmaWxsT3BhY2l0eTogMC41LFxuICAgICAgICAgICAgICAgIHdlaWdodDogMVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYWRkUG9wdXAoZ3RzLCBwLnZhbCwgcC50cywgbWFya2VyKTtcbiAgICAgICAgICAgIGRvdHMucHVzaChtYXJrZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RvdHMnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgc2l6ZSA9IChndHMucGF0aCB8fCBbXSkubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGcgPSBndHMucGF0aFtpXTtcbiAgICAgICAgICBjb25zdCBtYXJrZXIgPSBMZWFmbGV0LmNpcmNsZU1hcmtlcihcbiAgICAgICAgICAgIGcsIHtcbiAgICAgICAgICAgICAgcmFkaXVzOiBndHMuYmFzZVJhZGl1cyB8fCBNYXBMaWIuQkFTRV9SQURJVVMsXG4gICAgICAgICAgICAgIGNvbG9yOiBndHMuY29sb3IsXG4gICAgICAgICAgICAgIGZpbGxDb2xvcjogZ3RzLmNvbG9yLFxuICAgICAgICAgICAgICBmaWxsT3BhY2l0eTogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5hZGRQb3B1cChndHMsIGcudmFsLCBnLnRzLCBtYXJrZXIpO1xuICAgICAgICAgIGRvdHMucHVzaChtYXJrZXIpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZG90cztcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlR3RzUGF0aChndHM6IGFueSkge1xuICAgIGNvbnN0IHBhdGggPSBNYXBMaWIucGF0aERhdGFUb0xlYWZsZXQoZ3RzLnBhdGgpO1xuICAgIGNvbnN0IGdyb3VwID0gTGVhZmxldC5mZWF0dXJlR3JvdXAoKTtcbiAgICBpZiAoKHBhdGggfHwgW10pLmxlbmd0aCA+IDEgJiYgISFndHMubGluZSAmJiBndHMucmVuZGVyID09PSAnZG90cycpIHtcbiAgICAgIGlmICghIXRoaXMuX29wdGlvbnMubWFwLmFuaW1hdGUpIHtcbiAgICAgICAgZ3JvdXAuYWRkTGF5ZXIoYW50UGF0aChwYXRoIHx8IFtdLCB7XG4gICAgICAgICAgZGVsYXk6IDgwMCwgZGFzaEFycmF5OiBbMTAsIDEwMF0sXG4gICAgICAgICAgd2VpZ2h0OiA1LCBjb2xvcjogQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoZ3RzLmNvbG9yLCAwLjUpLFxuICAgICAgICAgIHB1bHNlQ29sb3I6IGd0cy5jb2xvcixcbiAgICAgICAgICBwYXVzZWQ6IGZhbHNlLCByZXZlcnNlOiBmYWxzZSwgaGFyZHdhcmVBY2NlbGVyYXRlZDogdHJ1ZSwgaGFyZHdhcmVBY2NlbGVyYXRpb246IHRydWVcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ3JvdXAuYWRkTGF5ZXIoTGVhZmxldC5wb2x5bGluZShwYXRoIHx8IFtdLCB7Y29sb3I6IGd0cy5jb2xvciwgb3BhY2l0eTogMC41fSkpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBkb3RzID0gdGhpcy5nZXRHVFNEb3RzKGd0cyk7XG4gICAgY29uc3Qgc2l6ZSA9IChkb3RzIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGdyb3VwLmFkZExheWVyKGRvdHNbaV0pO1xuICAgIH1cbiAgICB0aGlzLnBhdGhEYXRhTGF5ZXIuYWRkTGF5ZXIoZ3JvdXApO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRQb3B1cChwb3NpdGlvbkRhdGE6IGFueSwgdmFsdWU6IGFueSwgdHM6IGFueSwgbWFya2VyOiBhbnkpIHtcbiAgICBpZiAoISFwb3NpdGlvbkRhdGEpIHtcbiAgICAgIGxldCBkYXRlO1xuICAgICAgaWYgKHRzICYmICF0aGlzLl9vcHRpb25zLnRpbWVNb2RlIHx8IHRoaXMuX29wdGlvbnMudGltZU1vZGUgIT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICAgIGRhdGUgPSAoR1RTTGliLnRvSVNPU3RyaW5nKHRzLCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpIHx8ICcnKVxuICAgICAgICAgIC5yZXBsYWNlKCdaJywgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSA9PT0gJ1VUQycgPyAnWicgOiAnJyk7XG4gICAgICB9XG4gICAgICBsZXQgY29udGVudCA9ICcnO1xuICAgICAgY29udGVudCA9IGA8cD4ke2RhdGV9PC9wPjxwPjxiPiR7cG9zaXRpb25EYXRhLmtleX08L2I+OiAke3ZhbHVlIHx8ICduYSd9PC9wPmA7XG4gICAgICBPYmplY3Qua2V5cyhwb3NpdGlvbkRhdGEucHJvcGVydGllcyB8fCBbXSkuZm9yRWFjaChrID0+IGNvbnRlbnQgKz0gYDxiPiR7a308L2I+OiAke3Bvc2l0aW9uRGF0YS5wcm9wZXJ0aWVzW2tdfTxiciAvPmApO1xuICAgICAgbWFya2VyLmJpbmRQb3B1cChjb250ZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVBvc2l0aW9uQXJyYXkocG9zaXRpb25EYXRhOiBhbnkpIHtcbiAgICBjb25zdCBncm91cCA9IExlYWZsZXQuZmVhdHVyZUdyb3VwKCk7XG4gICAgaWYgKCh0aGlzLl9oaWRkZW5EYXRhIHx8IFtdKS5maWx0ZXIoaCA9PiBoID09PSBwb3NpdGlvbkRhdGEua2V5KS5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IHBhdGggPSBNYXBMaWIudXBkYXRlUG9zaXRpb25BcnJheVRvTGVhZmxldChwb3NpdGlvbkRhdGEucG9zaXRpb25zKTtcbiAgICAgIGlmICgocG9zaXRpb25EYXRhLnBvc2l0aW9ucyB8fCBbXSkubGVuZ3RoID4gMSAmJiAhIXBvc2l0aW9uRGF0YS5saW5lKSB7XG4gICAgICAgIGlmICghIXRoaXMuX29wdGlvbnMubWFwLmFuaW1hdGUpIHtcbiAgICAgICAgICBncm91cC5hZGRMYXllcihhbnRQYXRoKHBhdGggfHwgW10sIHtcbiAgICAgICAgICAgIGRlbGF5OiA4MDAsIGRhc2hBcnJheTogWzEwLCAxMDBdLFxuICAgICAgICAgICAgd2VpZ2h0OiA1LCBjb2xvcjogQ29sb3JMaWIudHJhbnNwYXJlbnRpemUocG9zaXRpb25EYXRhLmNvbG9yLCAwLjUpLFxuICAgICAgICAgICAgcHVsc2VDb2xvcjogcG9zaXRpb25EYXRhLmNvbG9yLFxuICAgICAgICAgICAgcGF1c2VkOiBmYWxzZSwgcmV2ZXJzZTogZmFsc2UsIGhhcmR3YXJlQWNjZWxlcmF0ZWQ6IHRydWUsIGhhcmR3YXJlQWNjZWxlcmF0aW9uOiB0cnVlXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyb3VwLmFkZExheWVyKExlYWZsZXQucG9seWxpbmUocGF0aCB8fCBbXSwge2NvbG9yOiBwb3NpdGlvbkRhdGEuY29sb3IsIG9wYWNpdHk6IDAuNX0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IGljb247XG4gICAgICBsZXQgcmVzdWx0O1xuICAgICAgbGV0IGluU3RlcDtcbiAgICAgIGxldCBzaXplO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVQb3NpdGlvbkFycmF5J10sIHBvc2l0aW9uRGF0YSk7XG5cbiAgICAgIHN3aXRjaCAocG9zaXRpb25EYXRhLnJlbmRlcikge1xuICAgICAgICBjYXNlICdtYXJrZXInOlxuICAgICAgICAgIGljb24gPSB0aGlzLmljb24ocG9zaXRpb25EYXRhLmNvbG9yLCBwb3NpdGlvbkRhdGEubWFya2VyKTtcbiAgICAgICAgICBzaXplID0gKHBvc2l0aW9uRGF0YS5wb3NpdGlvbnMgfHwgW10pLmxlbmd0aDtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcCA9IHBvc2l0aW9uRGF0YS5wb3NpdGlvbnNbaV07XG4gICAgICAgICAgICBjb25zdCBtYXJrZXIgPSBMZWFmbGV0Lm1hcmtlcih7bGF0OiBwWzBdLCBsbmc6IHBbMV19LCB7aWNvbiwgb3BhY2l0eTogMX0pO1xuICAgICAgICAgICAgdGhpcy5hZGRQb3B1cChwb3NpdGlvbkRhdGEsIHBbMl0sIHVuZGVmaW5lZCwgbWFya2VyKTtcbiAgICAgICAgICAgIGdyb3VwLmFkZExheWVyKG1hcmtlcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlUG9zaXRpb25BcnJheScsICdidWlsZCBtYXJrZXInXSwgaWNvbik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NvbG9yZWRXZWlnaHRlZERvdHMnOlxuICAgICAgICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlUG9zaXRpb25BcnJheScsICdjb2xvcmVkV2VpZ2h0ZWREb3RzJ10sIHBvc2l0aW9uRGF0YSk7XG4gICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgICAgaW5TdGVwID0gW107XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwb3NpdGlvbkRhdGEubnVtQ29sb3JTdGVwczsgaisrKSB7XG4gICAgICAgICAgICByZXN1bHRbal0gPSAwO1xuICAgICAgICAgICAgaW5TdGVwW2pdID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2l6ZSA9IChwb3NpdGlvbkRhdGEucG9zaXRpb25zIHx8IFtdKS5sZW5ndGg7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBwb3NpdGlvbkRhdGEucG9zaXRpb25zW2ldO1xuICAgICAgICAgICAgY29uc3QgcmFkaXVzID0gKHBhcnNlSW50KHBbMl0sIDEwKSAtIChwb3NpdGlvbkRhdGEubWluVmFsdWUgfHwgMCkpICogNTAgLyAocG9zaXRpb25EYXRhLm1heFZhbHVlIHx8IDUwKTtcblxuICAgICAgICAgICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVQb3NpdGlvbkFycmF5JywgJ2NvbG9yZWRXZWlnaHRlZERvdHMnLCAncmFkaXVzJ10sIHBvc2l0aW9uRGF0YS5iYXNlUmFkaXVzICogcFs0XSk7XG4gICAgICAgICAgICBjb25zdCBtYXJrZXIgPSBMZWFmbGV0LmNpcmNsZU1hcmtlcihcbiAgICAgICAgICAgICAge2xhdDogcFswXSwgbG5nOiBwWzFdfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJhZGl1cyxcbiAgICAgICAgICAgICAgICBjb2xvcjogcG9zaXRpb25EYXRhLmJvcmRlckNvbG9yIHx8IHBvc2l0aW9uRGF0YS5jb2xvcixcbiAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IENvbG9yTGliLnJnYjJoZXgoXG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbkRhdGEuY29sb3JHcmFkaWVudFtwWzVdXS5yLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb25EYXRhLmNvbG9yR3JhZGllbnRbcFs1XV0uZyxcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uRGF0YS5jb2xvckdyYWRpZW50W3BbNV1dLmIpLFxuICAgICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjMsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5hZGRQb3B1cChwb3NpdGlvbkRhdGEsIHBbMl0sIHVuZGVmaW5lZCwgbWFya2VyKTtcbiAgICAgICAgICAgIGdyb3VwLmFkZExheWVyKG1hcmtlcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3ZWlnaHRlZERvdHMnOlxuICAgICAgICAgIHNpemUgPSAocG9zaXRpb25EYXRhLnBvc2l0aW9ucyB8fCBbXSkubGVuZ3RoO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gcG9zaXRpb25EYXRhLnBvc2l0aW9uc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHJhZGl1cyA9IChwYXJzZUludChwWzJdLCAxMCkgLSAocG9zaXRpb25EYXRhLm1pblZhbHVlIHx8IDApKSAqIDUwIC8gKHBvc2l0aW9uRGF0YS5tYXhWYWx1ZSB8fCA1MCk7XG4gICAgICAgICAgICBjb25zdCBtYXJrZXIgPSBMZWFmbGV0LmNpcmNsZU1hcmtlcihcbiAgICAgICAgICAgICAge2xhdDogcFswXSwgbG5nOiBwWzFdfSwge1xuICAgICAgICAgICAgICAgIHJhZGl1cyxcbiAgICAgICAgICAgICAgICBjb2xvcjogcG9zaXRpb25EYXRhLmJvcmRlckNvbG9yIHx8IHBvc2l0aW9uRGF0YS5jb2xvcixcbiAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IHBvc2l0aW9uRGF0YS5jb2xvcixcbiAgICAgICAgICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDAuMyxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmFkZFBvcHVwKHBvc2l0aW9uRGF0YSwgcFsyXSwgdW5kZWZpbmVkLCBtYXJrZXIpO1xuICAgICAgICAgICAgZ3JvdXAuYWRkTGF5ZXIobWFya2VyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2RvdHMnOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHNpemUgPSAocG9zaXRpb25EYXRhLnBvc2l0aW9ucyB8fCBbXSkubGVuZ3RoO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gcG9zaXRpb25EYXRhLnBvc2l0aW9uc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlciA9IExlYWZsZXQuY2lyY2xlTWFya2VyKFxuICAgICAgICAgICAgICB7bGF0OiBwWzBdLCBsbmc6IHBbMV19LCB7XG4gICAgICAgICAgICAgICAgcmFkaXVzOiBwb3NpdGlvbkRhdGEuYmFzZVJhZGl1cyB8fCBNYXBMaWIuQkFTRV9SQURJVVMsXG4gICAgICAgICAgICAgICAgY29sb3I6IHBvc2l0aW9uRGF0YS5ib3JkZXJDb2xvciB8fCBwb3NpdGlvbkRhdGEuY29sb3IsXG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiBwb3NpdGlvbkRhdGEuY29sb3IsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAyLFxuICAgICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjcsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5hZGRQb3B1cChwb3NpdGlvbkRhdGEsIHBbMl0gfHwgJ25hJywgdW5kZWZpbmVkLCBtYXJrZXIpO1xuICAgICAgICAgICAgZ3JvdXAuYWRkTGF5ZXIobWFya2VyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucG9zaXRpb25EYXRhTGF5ZXIuYWRkTGF5ZXIoZ3JvdXApO1xuICB9XG5cbiAgcHVibGljIHJlc2l6ZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4ocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnJlc2l6ZU1lKCk7XG4gICAgICByZXNvbHZlKHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgb25SYW5nZVNsaWRlckNoYW5nZShldmVudCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnb25SYW5nZVNsaWRlckNoYW5nZSddLCBldmVudCk7XG4gICAgdGhpcy50aW1lU3RhcnQgPSBldmVudC52YWx1ZSB8fCBtb21lbnQoKS52YWx1ZU9mKCk7XG4gICAgdGhpcy50aW1lRW5kID0gZXZlbnQuaGlnaFZhbHVlIHx8IG1vbWVudCgpLnZhbHVlT2YoKTtcbiAgICB0aGlzLmRyYXdNYXAodHJ1ZSk7XG4gIH1cblxuICBvblJhbmdlU2xpZGVyV2luZG93Q2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvblJhbmdlU2xpZGVyV2luZG93Q2hhbmdlJ10sIGV2ZW50KTtcbiAgICBpZiAodGhpcy5sb3dlclRpbWVCb3VuZCAhPT0gZXZlbnQubWluIHx8IHRoaXMudXBwZXJUaW1lQm91bmQgIT09IGV2ZW50Lm1heCkge1xuICAgICAgdGhpcy5sb3dlclRpbWVCb3VuZCA9IGV2ZW50Lm1pbjtcbiAgICAgIHRoaXMudXBwZXJUaW1lQm91bmQgPSBldmVudC5tYXg7XG4gICAgfVxuICB9XG5cbiAgb25TbGlkZXJDaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uU2xpZGVyQ2hhbmdlJ10sIGV2ZW50LCBtb21lbnQoZXZlbnQudmFsdWUpLnRvSVNPU3RyaW5nKCkpO1xuICAgIHRoaXMuX2ZpcnN0RHJhdyA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnRpbWVFbmQgIT09IGV2ZW50LnZhbHVlKSB7XG4gICAgICB0aGlzLnRpbWVTcGFuID0gdGhpcy50aW1lU3BhbiB8fCB0aGlzLl9vcHRpb25zLm1hcC50aW1lU3BhbjtcbiAgICAgIHRoaXMudGltZUVuZCA9IGV2ZW50LnZhbHVlIHx8IG1vbWVudCgpLnZhbHVlT2YoKTtcbiAgICAgIHRoaXMudGltZVN0YXJ0ID0gKGV2ZW50LnZhbHVlIHx8IG1vbWVudCgpLnZhbHVlT2YoKSkgLSB0aGlzLnRpbWVTcGFuIC8gdGhpcy5kaXZpZGVyO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydvblNsaWRlckNoYW5nZSddLCBtb21lbnQodGhpcy50aW1lU3RhcnQpLnRvSVNPU3RyaW5nKCksIG1vbWVudCh0aGlzLnRpbWVFbmQpLnRvSVNPU3RyaW5nKCkpO1xuICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh0aGlzLnRpbWVTdGFydCk7XG4gICAgICB0aGlzLmRyYXdNYXAodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlVGltZVNwYW4oZXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZVRpbWVTcGFuJ10sIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgaWYgKHRoaXMudGltZVNwYW4gIT09IGV2ZW50LnRhcmdldC52YWx1ZSkge1xuICAgICAgdGhpcy50aW1lU3BhbiA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMudGltZVN0YXJ0ID0gKHRoaXMudGltZUVuZCB8fCBtb21lbnQoKS52YWx1ZU9mKCkpIC0gdGhpcy50aW1lU3BhbiAvIHRoaXMuZGl2aWRlcjtcbiAgICAgIHRoaXMuZHJhd01hcCh0cnVlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==