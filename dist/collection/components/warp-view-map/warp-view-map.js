/*
 *  Copyright 2018  SenX S.A.S.
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
import Leaflet from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';
import { ColorLib } from "../../utils/color-lib";
import { ChartLib } from "../../utils/chart-lib";
import { Logger } from "../../utils/logger";
import { DataModel } from "../../model/dataModel";
import { MapLib } from "../../utils/map-lib";
import { GTSLib } from "../../utils/gts.lib";
import moment from "moment-timezone";
export class WarpViewMap {
    constructor() {
        this.responsive = false;
        this.heatData = [];
        this.options = {};
        this.hiddenData = [];
        this.debug = false;
        this._options = {
            dotsLimit: 1000,
            heatControls: false,
            mapType: 'DEFAULT',
            timeZone: 'UTC',
            timeUnit: 'us'
        };
        this.mapTypes = {
            DEFAULT: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            TOPO: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            ESRI: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
            SATELLITE: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            OCEANS: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
            GRAY: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            GRAYSCALE: 'https://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}',
            WATERCOLOR: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png'
        };
        this.uuid = 'map-' + ChartLib.guid().split('-').join('');
        this.polylinesBeforeCurrentValue = [];
        this.polylinesAfterCurrentValue = [];
        this.currentValuesMarkers = [];
        this.annotationsMarkers = [];
        this.positionArraysMarkers = [];
        this._iconAnchor = [20, 52];
        this._popupAnchor = [0, -50];
        this.parentWidth = -1;
        this.parentHeight = -1;
    }
    onResize() {
        if (this.el.parentElement.getBoundingClientRect().width !== this.parentWidth || this.parentWidth <= 0 || this.el.parentElement.getBoundingClientRect().height !== this.parentHeight) {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.parentWidth = this.el.parentElement.getBoundingClientRect().width;
                this.parentHeight = this.el.parentElement.getBoundingClientRect().height;
                if (this.el.parentElement.getBoundingClientRect().width > 0) {
                    this.LOG.debug(['onResize'], this.el.parentElement.getBoundingClientRect().width);
                    this.drawMap();
                }
                else {
                    this.onResize();
                }
            }, 150);
        }
    }
    onHideData(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.LOG.debug(['hiddenData'], newValue);
            this.drawMap();
        }
    }
    onData(newValue) {
        this.LOG.debug(['data'], newValue);
        this.drawMap();
    }
    onOptions(newValue) {
        let optionChanged = false;
        Object.keys(newValue).forEach(opt => {
            if (this._options.hasOwnProperty(opt)) {
                optionChanged = optionChanged || (newValue[opt] !== (this._options[opt]));
            }
            else {
                optionChanged = true; //new unknown option
            }
        });
        if (optionChanged) {
            this.LOG.debug(['options'], newValue);
            this.drawMap();
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
        let minOpacity = event.detail.valueAsNumber / 100;
        this._heatLayer.setOptions({ minOpacity: minOpacity });
        this.LOG.debug(['heatOpacityDidChange'], event.detail.valueAsNumber);
    }
    drawMap() {
        this.LOG.debug(['drawMap'], this.data);
        this._options = ChartLib.mergeDeep(this._options, this.options);
        moment.tz.setDefault(this._options.timeZone);
        let gts = this.data;
        if (!gts) {
            return;
        }
        if (typeof gts === 'string') {
            try {
                gts = JSON.parse(gts);
            }
            catch (error) {
                // empty
            }
        }
        if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
            gts = gts[0];
        }
        if (this._map) {
            this._map.invalidateSize(true);
        }
        let dataList;
        let params;
        if (gts.data) {
            dataList = gts.data;
            this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {});
            params = gts.params;
        }
        else {
            dataList = gts;
            params = [];
        }
        this.LOG.debug(['drawMap'], dataList);
        if (!dataList) {
            return;
        }
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
        this.displayMap({ gts: flattenGTS, params: params });
        this.onResize();
    }
    icon(color, marker = '') {
        let c = "+" + color.slice(1);
        let m = marker !== '' ? '-' + marker : '';
        return Leaflet.icon({
            iconUrl: 'https://api.mapbox.com/v3/marker/pin-s' + m + c + '@2x.png',
            iconAnchor: this._iconAnchor,
            popupAnchor: this._popupAnchor
        });
    }
    displayMap(data) {
        this.LOG.debug(['drawMap'], this.data, this._options, this.hiddenData);
        let divider = GTSLib.getDivider(this._options.timeUnit);
        this.pathData = MapLib.toLeafletMapPaths(data, this.hiddenData, divider);
        this.annotationsData = MapLib.annotationsToLeafletPositions(data, this.hiddenData, divider);
        this.positionData = MapLib.toLeafletMapPositionArray(data, this.hiddenData);
        this.geoJson = MapLib.toGeoJSON(data);
        if (!this.data) {
            return;
        }
        if (this._map) {
            this._map.remove();
        }
        this.mapElement = this.el.shadowRoot.querySelector('#' + this.uuid);
        const height = (this.responsive ? this.mapElement.parentElement.getBoundingClientRect().height : (this.height || WarpViewMap.DEFAULT_HEIGHT)) - 30;
        const width = (this.responsive ? this.mapElement.parentElement.getBoundingClientRect().width : this.width || WarpViewMap.DEFAULT_WIDTH);
        this.mapElement.style.width = width + 'px';
        this.mapElement.style.height = height + 'px';
        this._map = Leaflet.map(this.mapElement)
            .setView([this._options.startLat || 0, this._options.startLong || 0], this._options.startZoom || 2);
        Leaflet.tileLayer(this.mapTypes[this._options.mapType || 'DEFAULT'], {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this._map);
        this.pathData.forEach(d => {
            let plottedGts = this.updateGtsPath(d);
            if (plottedGts) {
                this.polylinesBeforeCurrentValue.push(plottedGts.beforeCurrentValue);
                this.polylinesAfterCurrentValue.push(plottedGts.afterCurrentValue);
                this.currentValuesMarkers.push(plottedGts.currentValue);
            }
        });
        this.annotationsData.forEach(d => {
            //   this.annotationsMarkers = this.annotationsMarkers.concat(this.updateAnnotation(d));
            let plottedGts = this.updateGtsPath(d);
            if (plottedGts) {
                this.polylinesBeforeCurrentValue.push(plottedGts.beforeCurrentValue);
                this.polylinesAfterCurrentValue.push(plottedGts.afterCurrentValue);
                this.currentValuesMarkers.push(plottedGts.currentValue);
            }
        });
        this.LOG.debug(['displayMap', 'annotationsMarkers'], this.annotationsMarkers);
        this.LOG.debug(['displayMap', 'this.hiddenData'], this.hiddenData);
        // Create the positions arrays
        this.positionData.forEach(d => {
            this.positionArraysMarkers = this.positionArraysMarkers.concat(this.updatePositionArray(d));
        });
        (this.tiles || []).forEach((t) => {
            Leaflet.tileLayer(t).addTo(this._map);
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
            const color = ColorLib.getColor(index);
            const opts = {
                style: () => ({
                    color: (data.params && data.params[index]) ? data.params[index].color || color : color,
                    fillColor: (data.params && data.params[index]) ? data.params[index].fillColor || ColorLib.transparentize(color) : ColorLib.transparentize(color),
                })
            };
            switch (m.geometry.type) {
                case 'Point':
                    opts.pointToLayer = (geoJsonPoint, latlng) => Leaflet.marker(latlng, {
                        icon: this.icon(color, ''),
                        opacity: 1,
                    });
                    break;
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
            let bounds = MapLib.getBoundsArray(this.pathData, this.positionData, this.annotationsData, this.geoJson);
            window.setTimeout(() => {
                this._options.startZoom = this._options.startZoom || 2;
                // Without the timeout tiles doesn't show, see https://github.com/Leaflet/Leaflet/issues/694
                this._map.invalidateSize();
                if (bounds.length > 1) {
                    this._map.fitBounds(Leaflet.latLngBounds(bounds[0], bounds[1]), {
                        padding: [20, 20],
                        animate: false,
                        duration: 0
                    });
                    this._map.setZoom(Math.max(this._options.startZoom, this._map.getZoom()), {
                        animate: false,
                        duration: 0
                    });
                }
                else {
                    this._map.setView({
                        lat: this._options.startLat || 0,
                        lng: this._options.startLong || 0
                    }, this._options.startZoom);
                }
            }, 1000);
        }
        else {
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
    updateGtsPath(gts) {
        let beforeCurrentValue = Leaflet.polyline(MapLib.pathDataToLeaflet(gts.path, { to: 0 }), {
            color: gts.color,
            opacity: 1,
        }).addTo(this._map);
        let afterCurrentValue = Leaflet.polyline(MapLib.pathDataToLeaflet(gts.path, { from: 0 }), {
            color: gts.color,
            opacity: 0.7,
        }).addTo(this._map);
        let currentValue;
        // Let's verify we have a path... No path, no marker
        gts.path.map(p => {
            let date;
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                date = parseInt(p.ts);
            }
            else {
                date = (moment(parseInt(p.ts)).utc(true).toISOString() || '').replace('Z', this._options.timeZone == 'UTC' ? 'Z' : '');
            }
            currentValue = Leaflet.circleMarker([p.lat, p.lon], { radius: MapLib.BASE_RADIUS, color: gts.color, fillColor: gts.color, fillOpacity: 0.7 })
                .bindPopup(`<p>${date}</p><p><b>${gts.key}</b>: ${p.val.toString()}</p>`).addTo(this._map);
            return {
                beforeCurrentValue: beforeCurrentValue,
                afterCurrentValue: afterCurrentValue,
                currentValue: currentValue,
            };
        });
    }
    updatePositionArray(positionData) {
        let positions = [];
        let polyline;
        let icon;
        let result;
        let inStep;
        this.LOG.debug(['updatePositionArray'], positionData);
        switch (positionData.render) {
            case 'path':
                polyline = Leaflet.polyline(positionData.positions, { color: positionData.color, opacity: 1 });
                positions.push(polyline);
                break;
            case 'marker':
                icon = this.icon(positionData.color, positionData.marker);
                for (let j = 0; j < positionData.positions.length; j++) {
                    if (this.hiddenData.filter((i) => i === positionData.key).length === 0) {
                        let marker = Leaflet.marker({
                            lat: positionData.positions[j][0],
                            lng: positionData.positions[j][1]
                        }, {
                            icon: icon,
                            opacity: 1,
                        });
                        marker.bindPopup(`<p><b>${positionData.key}</b>: ${positionData.positions[j][2] || ''}</p>`);
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
                for (let j = 0; j < positionData.positions.length; j++) {
                    if (this.hiddenData.filter((i) => i === positionData.key).length === 0) {
                        this.LOG.debug(['updatePositionArray', 'coloredWeightedDots', 'radius'], positionData.baseRadius * positionData.positions[j][4]);
                        let marker = Leaflet.circleMarker({ lat: positionData.positions[j][0], lng: positionData.positions[j][1] }, {
                            radius: positionData.baseRadius * (parseInt(positionData.positions[j][4]) + 1),
                            color: positionData.borderColor,
                            fillColor: ColorLib.rgb2hex(positionData.colorGradient[positionData.positions[j][5]].r, positionData.colorGradient[positionData.positions[j][5]].g, positionData.colorGradient[positionData.positions[j][5]].b),
                            fillOpacity: 0.7,
                        });
                        this.LOG.debug(['updatePositionArray', 'coloredWeightedDots'], marker);
                        marker.bindPopup(`<p><b>${positionData.key}</b>: ${positionData.positions[j][2] || ''}</p>`);
                        positions.push(marker);
                    }
                }
                break;
            case 'weightedDots':
                for (let j = 0; j < positionData.positions.length; j++) {
                    if (this.hiddenData.filter((i) => i === positionData.key).length === 0) {
                        let marker = Leaflet.circleMarker({ lat: positionData.positions[j][0], lng: positionData.positions[j][1] }, {
                            radius: positionData.baseRadius * (parseInt(positionData.positions[j][4]) + 1),
                            color: positionData.borderColor,
                            fillColor: positionData.color, fillOpacity: 0.7,
                        });
                        marker.bindPopup(`<p><b>${positionData.key}</b>: ${positionData.positions[j][2] || ''}</p>`);
                        positions.push(marker);
                    }
                }
                break;
            case 'dots':
            default:
                for (let j = 0; j < positionData.positions.length; j++) {
                    if (this.hiddenData.filter((i) => i === positionData.key).length === 0) {
                        let marker = Leaflet.circleMarker({ lat: positionData.positions[j][0], lng: positionData.positions[j][1] }, {
                            radius: positionData.baseRadius,
                            color: positionData.borderColor,
                            fillColor: positionData.color,
                            fillOpacity: 1,
                        });
                        marker.bindPopup(`<p><b>${positionData.key}</b>: ${positionData.positions[j][2] || ''}</p>`);
                        positions.push(marker);
                    }
                }
                break;
        }
        return positions;
    }
    /**
     *
     * @returns {Promise<boolean>}
     */
    resize() {
        return new Promise(resolve => {
            this.mapElement = this.el.shadowRoot.querySelector('#' + this.uuid);
            const height = (this.responsive ? this.mapElement.parentElement.getBoundingClientRect().height : WarpViewMap.DEFAULT_HEIGHT) - 30;
            const width = (this.responsive ? this.mapElement.parentElement.getBoundingClientRect().width : WarpViewMap.DEFAULT_WIDTH);
            this.mapElement.style.width = width + 'px';
            this.mapElement.style.height = height + 'px';
            resolve(true);
        });
    }
    componentWillLoad() {
        this.LOG = new Logger(WarpViewMap, this.debug);
    }
    componentDidLoad() {
        this.drawMap();
        ChartLib.resizeWatchTimer(this.el, this.onResize.bind(this));
    }
    render() {
        return (h("div", { class: "wrapper" },
            h("div", { class: "map-container" },
                h("div", { id: this.uuid })),
            !!this._options.heatControls ? h("warp-view-heatmap-sliders", null) : ""));
    }
    static get is() { return "warp-view-map"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "debug": {
            "type": Boolean,
            "attr": "debug"
        },
        "el": {
            "elementRef": true
        },
        "heatData": {
            "type": "Any",
            "attr": "heat-data"
        },
        "height": {
            "type": Number,
            "attr": "height"
        },
        "hiddenData": {
            "type": "Any",
            "attr": "hidden-data",
            "watchCallbacks": ["onHideData"]
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        },
        "resize": {
            "method": true
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "width": {
            "type": Number,
            "attr": "width"
        }
    }; }
    static get listeners() { return [{
            "name": "window:resize",
            "method": "onResize",
            "passive": true
        }, {
            "name": "heatRadiusDidChange",
            "method": "heatRadiusDidChange"
        }, {
            "name": "heatBlurDidChange",
            "method": "heatBlurDidChange"
        }, {
            "name": "heatOpacityDidChange",
            "method": "heatOpacityDidChange"
        }]; }
    static get style() { return "/**style-placeholder:warp-view-map:**/"; }
}
WarpViewMap.DEFAULT_HEIGHT = 600;
WarpViewMap.DEFAULT_WIDTH = 800;
