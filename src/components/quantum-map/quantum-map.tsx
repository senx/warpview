import {Component, Element, Listen, Prop} from '@stencil/core';

import Leaflet, {GeoJSONOptions, PathOptions} from 'leaflet';
import 'leaflet.heat';
import {GTSLib} from "../../utils/gts.lib";
import 'leaflet.markercluster';
import {LineString} from 'geojson';

@Component({
  tag: 'quantum-map',
  styleUrls: [
    '../../../node_modules/leaflet/dist/leaflet.css',
    '../../../node_modules/leaflet.markercluster/dist/MarkerCluster.css',
    '../../../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
    'quantum-map.scss'
  ],
  shadow: true
})

export class QuantumMap {

  @Prop() mapTitle: string = "";
  @Prop() width: string;
  @Prop() height: string;
  @Prop() responsive: boolean = false;
  @Prop() data: string = "[]";
  @Prop() startLat: number = 90;
  @Prop() startLong: number = 90;
  @Prop() startZoom: number = 2;
  @Prop() dotsLimit: number = 1000;

  @Prop() heatRadius: number;
  @Prop() heatBlur: number;
  @Prop() heatOpacity: number;
  @Prop() heatData: string = "[]";
  @Prop() heatControls: boolean = false;
  @Element() el: HTMLElement;

  private _map;
  
  private _mapSize = {
    width: this.width,
    height: this.height
  };
  
  private _pathStyle = {
    weight: 5,
    opacity: 0.65,
    dotsWeight: 5
  };

  private _dotStyle = {
    radius: 8,
    weight: 1,
    edgeOpacity: 1,
    fillOpacity: 0.8,
    edgeColor: "#000000"
  };

  private _iconAnchor: Leaflet.PointExpression = [20, 52];
  private _popupAnchor: Leaflet.PointExpression = [0, -50];

  private _heatLayer;

  @Listen('heatRadiusDidChange')
  radiuschange(event) {
    this._heatLayer.setOptions({radius: event.detail.valueAsNumber});
  }

  @Listen('heatBlurDidChange')
  blurChange(event) {
    this._heatLayer.setOptions({blur: event.detail.valueAsNumber});
    console.log(event.detail.valueAsNumber);
  }

  @Listen('heatOpacityDidChange')
  opacityChange(event) {
    let minOpacity = event.detail.valueAsNumber / 100;
    this._heatLayer.setOptions({minOpacity: minOpacity});
    console.log(minOpacity);
  }

  drawMap() {
    let ctx = this.el.shadowRoot.querySelector('#mymap');
    this._map = Leaflet.map(ctx as HTMLElement).setView([this.startLat, this.startLong], this.startZoom);

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map);

    let geoData = this.gtsToGeoJSON(JSON.parse(this.data));

    if (geoData.length > this.dotsLimit) {
      let cluster = (Leaflet as any).markerClusterGroup();
      geoData.forEach(d => {
        cluster.addLayer(d);
      });
      this._map.addLayer(cluster);
    } else {
      geoData.forEach(d => {
        d.addTo(this._map)
      });
    }

    this._heatLayer = Leaflet.heatLayer(JSON.parse(this.heatData),
      {
        radius: this.heatRadius,
        blur: this.heatBlur,
        minOpacity: this.heatOpacity
      });
    this._heatLayer.addTo(this._map);

    this._map.on('move', function(e) {
      //console.log(this._map.getCenter());
    });
  }

  icon(color, marker = "") {
    let c = "+" + color.slice(1);
    let m = marker !== ""
      ? "-" + marker
      : "";
    return Leaflet.icon({
      iconUrl:  'https://api.mapbox.com/v3/marker/pin-s' + m + c + '@2x.png',
      iconAnchor: this._iconAnchor,
      popupAnchor: this._popupAnchor
    });
  }

  gtsToGeoJSON(data) {
    let geoData = [];
    data.forEach(d => {
      d.gts.forEach((g, i) => {

      if (!!g.positions) {
        let point = {} as any;
        g.positions.forEach(p => {
          point = {
            'type': 'Feature',
            'properties': {
              'style': {},
              'popupContent': 'lat : ' + p[0] + '<br/>long : ' + p[1]
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [p[1], p[0]]
            }
          };
          
          if(!!p[3]){
            point.properties.style.fillColor = GTSLib.getColor(p[3])
          }else if(!!d.params[i].fillColor){
            point.properties.style.fillColor = d.params[i].fillColor;
          }else{
            point.properties.style.fillColor = GTSLib.getColor(i);
          }

          point.properties.style.radius = !!p[2]
            ? p[2]
            : this._dotStyle.radius;
          point.properties.style.color = !!d.params[i].edgeColor
            ? d.params[i].edgeColor
            : this._dotStyle.edgeColor;
          point.properties.style.weight = !!d.params[i].weight
            ? d.params[i].weight
            : this._dotStyle.weight;
          point.properties.style.opacity = !!d.params[i].edgeOpacity
            ? d.params[i].edgeOpacity
            : this._dotStyle.edgeOpacity;
          point.properties.style.fillOpacity = !!d.params[i].fillOpacity
            ? d.params[i].fillOpacity
            : this._dotStyle.fillOpacity;

          if (p.length === 4) {
            point.properties.popupContent += "<br/>value 1 : " + p[2] + "<br/>value 2 : " + p[3] + !!d.params[i].legend ? "<br/>legend : " + d.params[i].legend :"";
          } else if (p.length === 3) {
            point.properties.popupContent += "<br/>value : " + p[2] + !!d.params[i].legend ? "<br/>legend : " + d.params[i].legend :"";
          }
          geoData.push(Leaflet.geoJSON(point, {
            pointToLayer: function (feature, latlng) {
              return Leaflet.circleMarker(latlng, feature.properties.style);
            },
            onEachFeature: function (feature, layer) {
              layer.bindPopup(feature.properties.popupContent);
            }
          }));
        });

      }else{
        let key = d.params[i].key.toLowerCase();
        if(key === "path") {
          let style = {
            color: !!d.params[i].color
              ? d.params[i].color
              : GTSLib.getColor(i),
            weight: this._pathStyle.weight,
            opacity: this._pathStyle.opacity,
          };
          let path: LineString = {
            type: 'LineString',
            coordinates: []
          };
          let previous: any = null;

          let junctionPoints = [];
          g.v.forEach(p => {
            if(!!previous){

              if(p[2] >= -180 && p[2] < -90 && previous[2] > 90 && previous[2] <= 180){
                let diff1 = 180 + p[2];
                let diff2 = 180 - previous[2];
                let pProj = p[2] * -1 + diff1 + diff2;
                let a = (p[1] - previous[1])/(pProj - previous[2]);
                let b = previous[1] - previous[2] * a;
                let borderY = a * (previous[2] + diff2) + b;

                path.coordinates.push([(previous[2] + diff2), borderY]);
                geoData.push(Leaflet.geoJSON(path, {
                  style: style as PathOptions,
                  onEachFeature: function (feature, layer) {
                    layer.bindPopup(!!d.params[i].legend ? "legend : " + d.params[i].legend : "");
                  }
                } as GeoJSONOptions));
                path.coordinates= [];
                path.coordinates.push([(previous[2] + diff2) * -1, borderY]);
                junctionPoints.push([[(previous[2] + diff2), borderY], [(previous[2] + diff2) * -1, borderY]]);

              }else if(p[2] > 90 && p[2] <= 180 && previous[2] >= -180 && previous[2] < -90){
                let diff1 = 180 - p[2];
                let diff2 = 180 + previous[2];
                let pProj = (previous[2] + diff1 + diff2) * -1;
                let a = (p[1] - previous[1])/(p[2] - pProj);
                let b = p[1] - a * p[2];
                let borderY = a * (p[2] - diff1) + b;

                path.coordinates.push([(previous[2] - diff2), borderY]);
                geoData.push(Leaflet.geoJSON(path, {
                  style: style as PathOptions,
                  onEachFeature: function (feature, layer) {
                    layer.bindPopup(!!d.params[i].legend ? "legend : " + d.params[i].legend : "");
                  }
                } as GeoJSONOptions));
                path.coordinates = [];
                path.coordinates.push([(previous[2] - diff2) * -1, borderY]);
                junctionPoints.push([[(previous[2] - diff2), borderY], [(previous[2] - diff2) * -1, borderY]]);

              }
            }
            previous = p;
            path.coordinates.push([p[2], p[1]]);
          });

          geoData.push(Leaflet.geoJSON(path, {
            style: style as PathOptions,
            onEachFeature: function (feature, layer) {
              layer.bindPopup(!!d.params[i].legend ? "legend : " + d.params[i].legend : "");
            }
          } as GeoJSONOptions));

          let point = {} as any;
          junctionPoints.forEach((j, i) => {
            j.forEach((p, n) => {
              point = {
                'type': 'Feature',
                'properties': {
                  'style': {
                    'color': "#645858",
                    "radius": this._pathStyle.dotsWeight,
                    "fillOpacity": this._pathStyle.opacity,
                    "opacity": this._pathStyle.opacity
                  },
                  'value': null,
                  'popupContent': "Junction " + (i) + (n == 0 ? " IN" : " OUT") 
                },
                'geometry': {
                  'type': 'Point',
                  'coordinates': p
                }
              };
              geoData.push(Leaflet.geoJSON(point, {
                pointToLayer: function (feature, latlng) {
                  return Leaflet.circleMarker(latlng, feature.properties.style);
                },
                onEachFeature: function (feature, layer) {
                  layer.bindPopup(feature.properties.popupContent);
                }
              }));
            });
          });

          if(d.params[i].displayDots === "true"){
            let point = {} as any;
            g.v.forEach(p => {
              point = {
                'type': 'Feature',
                'properties': {
                  'style': {
                    'color': !!d.params[i].color
                      ? d.params[i].color
                      : GTSLib.getColor(i),
                    "radius": this._pathStyle.dotsWeight,
                    "fillOpacity": this._pathStyle.opacity,
                    "opacity": this._pathStyle.opacity
                  },
                  'value': p[p.length - 1],
                  'popupContent': 'timestamp : ' + p[0] + '<br/>date : ' + new Date(p[0]) + '<br/>lat : ' + p[1] + '<br/>long : ' + p[2]
                },
                'geometry': {
                  'type': 'Point',
                  'coordinates': [p[2], p[1]]
                }
              };

              if (p.length === 5) {
                point.properties.popupContent += "<br/>alt : " + p[3] + "<br/>value : " + p[4];
              } else if (p.length === 4) {
                point.properties.popupContent += "<br/>value : " + p[3];
              }

              geoData.push(Leaflet.geoJSON(point, {
                pointToLayer: function (feature, latlng) {
                  return Leaflet.circleMarker(latlng, feature.properties.style);
                },
                onEachFeature: function (feature, layer) {
                  layer.bindPopup(feature.properties.popupContent);
                }
              }));
            });     
          }
        }else{
          let point = {} as any;
          g.v.forEach(p => {
            point = {
              'type': 'Feature',
              'properties': {
                'style': {
                  'color': !!d.params[i].color
                    ? d.params[i].color
                    : GTSLib.getColor(i),
                },
                'value': p[p.length - 1],
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
              point.properties.style.opacity = !!d.params[i].edgeOpacity
                ? d.params[i].opacity
                : this._dotStyle.edgeOpacity;
              point.properties.style.fillOpacity = !!d.params[i].fillOpacity
                ? d.params[i].fillOpacity
                : this._dotStyle.fillOpacity;
              point.properties.style.fillColor = !!d.params[i].fillColor
                ? d.params[i].fillColor
                : GTSLib.getColor(i);

            } else {
              point.properties.icon = this.icon(point.properties.style.color, d.params[i].marker);
            }

            if (p.length === 5) {
              point.properties.popupContent += "<br/>alt : " + p[3] + "<br/>value : " + p[4];
            } else if (p.length === 4) {
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
            } else {
              geoData.push(Leaflet.geoJSON(point, {
                pointToLayer: function (feature, latlng) {
                  return Leaflet.marker(latlng, {icon: feature.properties.icon});
                },
                onEachFeature: function (feature, layer) {
                  layer.bindPopup(feature.properties.popupContent);
                }
              }));
            }
          });
        }
      }
      });
    });
    return geoData;
  }
  componentDidLoad() {
    this.drawMap();
  }

  render() {
    return (
      <div>
        <h1>{this.mapTitle}</h1>
        <div class="map-container">
          <div id="mymap" style={{"width": this.width, "height": this.height}}/>
        </div>
        {this.heatControls == true
          ? <quantum-heatmap-sliders />
          : ""}
      </div>
    );
  }
}
