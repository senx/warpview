import Leaflet /*, { geoJSON }*/ /*, { geoJSON }*/ from 'leaflet';
import 'leaflet.heat';
import { GTSLib } from "../../gts.lib";
//import { GeoJsonObject } from 'geojson';
import 'leaflet.markercluster';
export class QuantumHeatmap {
    constructor() {
        this.mapTitle = "";
        this.responsive = false;
        this.data = "[]";
        this.startLat = 90;
        this.startLong = 90;
        this.startZoom = 2;
        this.dotsLimit = 1000;
        this.heatData = "[]";
        this._token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
        this._pathStyle = {
            weight: 5,
            opacity: 0.65
        };
        this._dotStyle = {
            radius: 8,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        this._iconAnchor = [20, 52];
        this._popupAnchor = [0, -50];
    }
    radiuschange(event) {
        this._heatLayer.setOptions({ radius: event.detail.valueAsNumber });
    }
    blurChange(event) {
        this._heatLayer.setOptions({ blur: event.detail.valueAsNumber });
        console.log(event.detail.valueAsNumber);
    }
    opacityChange(event) {
        let minOpacity = event.detail.valueAsNumber / 100;
        this._heatLayer.setOptions({ minOpacity: minOpacity });
        console.log(minOpacity);
    }
    drawMap() {
        let ctx = this.el.shadowRoot.querySelector('#mymap');
        this._map = Leaflet.map(ctx).setView([this.startLat, this.startLong], this.startZoom);
        Leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this._token, {
            maxZoom: 30,
            id: 'mapbox.streets'
        }).addTo(this._map);
        let geoData = this.gtsToGeoJSON(JSON.parse(this.data));
        if (geoData.length > this.dotsLimit) {
            let cluster = Leaflet.markerClusterGroup();
            geoData.forEach(d => {
                cluster.addLayer(d);
            });
            this._map.addLayer(cluster);
        }
        else {
            geoData.forEach(d => {
                d.addTo(this._map);
            });
        }
        this._heatLayer = Leaflet.heatLayer(JSON.parse(this.heatData), { radius: this.heatRadius,
            blur: this.heatBlur,
            minOpacity: this.heatOpacity
        });
        this._heatLayer.addTo(this._map);
    }
    icon(color, marker = "") {
        let c = "+" + color.slice(1);
        let m = marker !== ""
            ? "-" + marker
            : "";
        return Leaflet.icon({
            iconUrl: 'https://api.mapbox.com/v4/marker/pin-s' + m + c + '@2x.png?access_token=' + this._token,
            iconAnchor: this._iconAnchor,
            popupAnchor: this._popupAnchor
        });
    }
    gtsToGeoJSON(data) {
        let geoData = [];
        data.forEach(d => {
            d.gts.forEach((g, i) => {
                let key = d.params[i].key.toLowerCase();
                switch (key) {
                    case 'path':
                        let style = {
                            color: !!d.params[i].color
                                ? d.params[i].color
                                : GTSLib.getColor(i),
                            weight: this._pathStyle.weight,
                            opacity: this._pathStyle.opacity,
                            popupContent: d.params[i].legend
                        };
                        const coordinates = [];
                        let path = {
                            type: 'LineString'
                        };
                        g.v.forEach(p => {
                            coordinates.push([p[2], p[1]]);
                        });
                        geoData.push(Leaflet.geoJSON(path, {
                            style: style,
                            onEachFeature: function (feature, layer) {
                                layer.bindPopup(feature.properties.popupContent);
                            }
                        }));
                        break;
                    case 'point':
                        let point = {};
                        if (!!g.positions) {
                            g.positions.forEach(p => {
                                point = {
                                    'type': 'Feature',
                                    'properties': {
                                        'style': {
                                            'color': !!d.params[i].color
                                                ? d.params[i].color
                                                : GTSLib.getColor(i)
                                        },
                                        'popupContent': 'lat : ' + p[0] + '<br/>long : ' + p[1]
                                    },
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': [p[1], p[0]]
                                    }
                                };
                                if (d.params[i].render === 'dot') {
                                    point.properties.style.radius = d.params[i].radius
                                        ? d.params[i].radius
                                        : this._dotStyle.radius;
                                    point.properties.style.weight = !!d.params[i].weight
                                        ? d.params[i].weight
                                        : this._dotStyle.weight;
                                    point.properties.style.opacity = !!d.params[i].opacity
                                        ? d.params[i].opacity
                                        : this._dotStyle.opacity;
                                    point.properties.style.fillOpacity = !!d.params[i].fillOpacity
                                        ? d.params[i].fillOpacity
                                        : this._dotStyle.fillOpacity;
                                    point.properties.style.fillColor = !!d.params[i].fillColor
                                        ? d.params[i].fillColor
                                        : GTSLib.getColor(i);
                                }
                                else {
                                    point.properties.icon = this.icon(point.properties.style.color, d.params[i].marker);
                                }
                                if (p.length === 4) {
                                    point.properties.popupContent += "<br/>alt : " + p[2] + "<br/>value : " + p[3];
                                }
                                else if (p.length === 3) {
                                    point.properties.popupContent += "<br/>value : " + p[2];
                                }
                                if (d.params[i].render === 'dot') {
                                    geoData.push(Leaflet.geoJSON(point, {
                                        pointToLayer: function (feature, latlng) {
                                            return Leaflet.circleMarker(latlng, feature.properties.style);
                                        },
                                        onEachFeature: function (feature, layer) {
                                            layer.bindPopup(feature.properties.popupContent);
                                        }
                                    }));
                                }
                                else {
                                    geoData.push(Leaflet.geoJSON(point, {
                                        pointToLayer: function (feature, latlng) {
                                            return Leaflet.marker(latlng, { icon: feature.properties.icon });
                                        },
                                        onEachFeature: function (feature, layer) {
                                            layer.bindPopup(feature.properties.popupContent);
                                        }
                                    }));
                                }
                            });
                        }
                        else {
                            g.v.forEach(p => {
                                point = {
                                    'type': 'Feature',
                                    'properties': {
                                        'style': {
                                            'color': !!d.params[i].color
                                                ? d.params[i].color
                                                : GTSLib.getColor(i),
                                        },
                                        'value': p[p.lenght - 1],
                                        'popupContent': 'timestamp : ' + p[0] + '<br/>date : ' + new Date(p[0]) + '<br/>lat : ' + p[1] + '<br/>long : ' + p[2]
                                    },
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': [p[2], p[1]]
                                    }
                                };
                                if (d.params[i].render === 'dot') {
                                    point.properties.style.radius = !!d.params[i].radius
                                        ? d.params[i].radius
                                        : this._dotStyle.radius;
                                    point.properties.style.weight = !!d.params[i].weight
                                        ? d.params[i].weight
                                        : this._dotStyle.weight;
                                    point.properties.style.opacity = !!d.params[i].opacity
                                        ? d.params[i].opacity
                                        : this._dotStyle.opacity;
                                    point.properties.style.fillOpacity = !!d.params[i].fillOpacity
                                        ? d.params[i].fillOpacity
                                        : this._dotStyle.fillOpacity;
                                    point.properties.style.fillColor = !!d.params[i].fillColor
                                        ? d.params[i].fillColor
                                        : GTSLib.getColor(i);
                                }
                                else {
                                    point.properties.icon = this.icon(point.properties.style.color, d.params[i].marker);
                                }
                                if (p.length === 5) {
                                    point.properties.popupContent += "<br/>alt : " + p[3] + "<br/>value : " + p[4];
                                }
                                else if (p.length === 4) {
                                    point.properties.popupContent += "<br/>value : " + p[3];
                                }
                                if (d.params[i].render === 'dot') {
                                    geoData.push(Leaflet.geoJSON(point, {
                                        pointToLayer: function (feature, latlng) {
                                            return Leaflet.circleMarker(latlng, feature.properties.style);
                                        },
                                        onEachFeature: function (feature, layer) {
                                            layer.bindPopup(feature.properties.popupContent);
                                        }
                                    }));
                                }
                                else {
                                    geoData.push(Leaflet.geoJSON(point, {
                                        pointToLayer: function (feature, latlng) {
                                            return Leaflet.marker(latlng, { icon: feature.properties.icon });
                                        },
                                        onEachFeature: function (feature, layer) {
                                            layer.bindPopup(feature.properties.popupContent);
                                        }
                                    }));
                                }
                            });
                        }
                        break;
                }
            });
        });
        return geoData;
    }
    componentDidLoad() {
        this.drawMap();
    }
    render() {
        return (h("div", null,
            h("h1", null, this.mapTitle),
            h("div", { class: "map-container" },
                h("div", { id: "mymap", style: { 'width': '100%', 'height': '800px' } })),
            this.heatData !== "[]"
                ? h("quantum-heatmap-sliders", null)
                : ""));
    }
    static get is() { return "quantum-heatmap"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": String,
            "attr": "data"
        },
        "dotsLimit": {
            "type": Number,
            "attr": "dots-limit"
        },
        "el": {
            "elementRef": true
        },
        "heatBlur": {
            "type": Number,
            "attr": "heat-blur"
        },
        "heatData": {
            "type": String,
            "attr": "heat-data"
        },
        "heatOpacity": {
            "type": Number,
            "attr": "heat-opacity"
        },
        "heatRadius": {
            "type": Number,
            "attr": "heat-radius"
        },
        "height": {
            "type": Number,
            "attr": "height"
        },
        "mapTitle": {
            "type": String,
            "attr": "map-title"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "startLat": {
            "type": Number,
            "attr": "start-lat"
        },
        "startLong": {
            "type": Number,
            "attr": "start-long"
        },
        "startZoom": {
            "type": Number,
            "attr": "start-zoom"
        },
        "width": {
            "type": Number,
            "attr": "width"
        }
    }; }
    static get listeners() { return [{
            "name": "heatRadiusDidChange",
            "method": "radiuschange"
        }, {
            "name": "heatBlurDidChange",
            "method": "blurChange"
        }, {
            "name": "heatOpacityDidChange",
            "method": "opacityChange"
        }]; }
    static get style() { return "/**style-placeholder:quantum-heatmap:**/"; }
}
