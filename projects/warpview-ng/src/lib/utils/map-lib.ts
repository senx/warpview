/*
 *  Copyright 2021  SenX S.A.S.
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

import {GTSLib} from './gts.lib';
import {ColorLib} from './color-lib';
import {Logger} from './logger';
import {Param} from '../model/param';

export class MapLib {
  static BASE_RADIUS = 2;
  private static LOG: Logger = new Logger(MapLib, true);

  static mapTypes: any = {
    NONE: undefined,
    DEFAULT: {
      link: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    HOT: {
      link: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles
 style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by
 <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>`
    },
    TOPO: {
      link: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: `Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,
 <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>
  (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)`
    },
    TOPO2: {
      link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: `Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN,
       GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community`
    },
    STADIA: {
      link: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
      attribution: `&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors`
    },
    STADIA_DARK: {
      link: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      attribution: `&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors`
    },
    TONER: {
      link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
      attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
 <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy;
  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
      subdomains: 'abcd'
    },
    TONER_LITE: {
      link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
      attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
 <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy;
  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
      subdomains: 'abcd',
    },
    TERRAIN: {
      link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
      attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
 <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy;
 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
      subdomains: 'abcd',
    },
    ESRI: {
      link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: `Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan,
 METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012`
    },
    SATELLITE: {
      link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: `Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN,
 IGP, UPR-EGP, and the GIS User Community`
    },
    OCEANS: {
      link: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
    },
    GRAY: {
      link: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attibs: ''
    },
    GRAYSCALE: {
      link: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    },
    WATERCOLOR: {
      link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
      attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
 <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy;
  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
      subdomains: 'abcd',
    },
    CARTODB: {
      link: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy;
 <a href="https://carto.com/attributions">CartoDB</a>`,
      subdomains: 'abcd',
    },
    CARTODB_DARK: {
      link: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
      attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy;
 <a href="https://carto.com/attributions">CartoDB</a>`,
      subdomains: 'abcd',
    },
  };

  static toLeafletMapPaths(data: { gts: any[]; params: any[] }, hiddenData: number[], scheme: string) {
    const paths = [];
    const size = (data.gts || []).length;
    for (let i = 0; i < size; i++) {
      const gts = data.gts[i];
      let params = (data.params || [])[i];
      if (!params) {
        params = {};
      }
      if (GTSLib.isGtsToPlotOnMap(gts) && (hiddenData || []).filter(id => id === gts.id).length === 0) {
        const path: any = {};
        MapLib.extractCommonParameters(path, params, i, scheme);

        path.path = MapLib.gtsToPath(gts);
        if (!!params.render) {
          path.render = params.render;
        }
        if (!!params.marker) {
          path.marker = params.marker;
        }
        path.line = params.hasOwnProperty('line') ? params.line : true;
        path.render = path.render || 'dots';
        if (path.render === 'weightedDots') {
          MapLib.validateWeightedDotsPositionArray(path, params);
        }
        if (path.render === 'coloredWeightedDots') {
          MapLib.validateWeightedColoredDotsPositionArray(path, params);
        }
        if (data.params && data.params[i] && data.params[i].key) {
          path.key = data.params[i].key;
        } else {
          path.key = GTSLib.serializeGtsMetadata(gts);
        }
        if (data.params && data.params[i] && data.params[i].color) {
          path.color = data.params[i].color;
        } else {
          path.color = ColorLib.getColor(i, scheme);
        }
        paths.push(path);
      }
    }
    return paths;
  }

  static gtsToPath(gts) {
    const path = [];
    const size = (gts.v || []).length;
    for (let i = 0; i < size; i++) {
      const v = gts.v[i];
      const l = v.length;
      if (l >= 4) {
        // timestamp, lat, lon, elev?, value
        path.push({ts: Math.floor(v[0]), lat: v[1], lon: v[2], val: v[l - 1]});
      }
    }
    return path;
  }

  private static extractCommonParameters(obj, params, index, scheme: string) {
    params = params || {};
    obj.key = params.key || '';
    obj.color = params.color || ColorLib.getColor(index, scheme);
    obj.borderColor = params.borderColor;
    obj.properties = params.properties || {};
    if (params.baseRadius === undefined
      || isNaN(parseInt(params.baseRadius, 10))
      || parseInt(params.baseRadius, 10) < 0) {
      obj.baseRadius = MapLib.BASE_RADIUS;
    } else {
      obj.baseRadius = params.baseRadius;
    }
  }

  private static validateWeightedDotsPositionArray(posArray, params) {
    if (params.minValue === undefined || params.maxValue === undefined) {
      MapLib.LOG.error(['validateWeightedDotsPositionArray'], 'When using \'weightedDots\' or ' +
        '\'weightedColoredDots\' rendering, \'maxValue\' and \'minValue\' parameters are compulsory');
      posArray.render = undefined;
      return;
    }
    posArray.maxValue = params.maxValue;
    posArray.minValue = params.minValue;
    if (typeof posArray.minValue !== 'number' ||
      typeof posArray.maxValue !== 'number' ||
      posArray.minValue >= posArray.maxValue) {
      MapLib.LOG.error(['validateWeightedDotsPositionArray'], 'When using \'weightedDots\' or ' +
        '\'weightedColoredDots\' rendering, \'maxValue\' and \'minValue\' must be numbers and \'maxValue\' ' +
        'must be greater than \'minValue\'');
      posArray.render = undefined;
      return;
    }
    if (!GTSLib.isPositionsArrayWithValues(posArray) && !GTSLib.isPositionsArrayWithTwoValues(posArray)) {
      MapLib.LOG.error(['validateWeightedDotsPositionArray'], 'When using \'weightedDots\' or ' +
        '\'weightedColoredDots\' rendering, positions must have an associated value');
      posArray.render = undefined;
      return;
    }

    if (params.numSteps === undefined || isNaN(parseInt(params.numSteps, 10)) || parseInt(params.numSteps, 10) < 0) {
      posArray.numSteps = 5;
    } else {
      posArray.numSteps = params.numSteps;
    }
    const step = (posArray.maxValue - posArray.minValue) / posArray.numSteps;
    const steps = [];
    for (let i = 0; i < posArray.numSteps - 1; i++) {
      steps[i] = posArray.minValue + (i + 1) * step;
    }
    steps[posArray.numSteps - 1] = posArray.maxValue;

    const size = (posArray || []).length;
    for (let i = 0; i < size; i++) {
      const pos = posArray[i];
      const value = pos[2];
      pos[4] = posArray.numSteps - 1;
      for (const k in steps) {
        if (value <= steps[k]) {
          pos[4] = k;
          break;
        }
      }
    }
    return true;
  }

  static toLeafletMapPositionArray(data: { gts: any[]; params: any[] }, hiddenData: number[], scheme: string) {
    const positions = [];
    const size = (data.gts || []).length;
    for (let i = 0; i < size; i++) {
      const gts = data.gts[i];
      if (GTSLib.isPositionArray(gts) && (hiddenData || []).filter(id => id === gts.id).length === 0) {
        this.LOG.debug(['toLeafletMapPositionArray'], gts, data.params ? data.params[i] : '');
        const posArray = gts;
        const params = data.params ? data.params[i] || {} : {};
        MapLib.extractCommonParameters(posArray, params, i, scheme);
        posArray.render = params.render || 'dots';
        posArray.maxValue = params.maxValue || 0;
        posArray.minValue = params.minValue || 0;
        posArray.line = params.hasOwnProperty('line') ? params.line : false;
        if (posArray.render === 'weightedDots') {
          MapLib.validateWeightedDotsPositionArray(posArray, params);
        }
        if (posArray.render === 'coloredWeightedDots') {
          MapLib.validateWeightedColoredDotsPositionArray(posArray, params);
        }
        if (posArray.render === 'marker') {
          posArray.marker = params.marker;
        }
        if (data.params && data.params[i] && data.params[i].color) {
          posArray.color = data.params[i].color;
        } else {
          posArray.color = ColorLib.getColor(i, scheme);
        }
        this.LOG.debug(['toLeafletMapPositionArray', 'posArray'], posArray);
        positions.push(posArray);
      }
    }
    return positions;
  }

  private static validateWeightedColoredDotsPositionArray(posArray: any, params: Param) {
    if (!MapLib.validateWeightedDotsPositionArray(posArray, params)) {
      return;
    }
    if (!params.minColor || !params.maxColor || !params.startColor || !params.endColor) {
      MapLib.LOG.error(['validateWeightedColoredDotsPositionArray'], 'When using ' +
        '\'weightedColoredDots\' rendering, \'maxColorValue\', \'minColorValue\', \'startColor\' ' +
        'and \'endColor\' parameters are compulsory');
      posArray.render = undefined;
      return;
    }

    posArray.maxColorValue = params.maxColor;
    posArray.minColorValue = params.minColor;

    if (typeof posArray.minColorValue !== 'number' ||
      typeof posArray.maxColorValue !== 'number' ||
      posArray.minColorValue >= posArray.maxColorValue) {
      MapLib.LOG.error(['validateWeightedColoredDotsPositionArray'], ['When using ' +
      'weightedColoredDots\' rendering, \'maxColorValue\' and \'minColorValue\' must be numbers ' +
      'and \'maxColorValue\' must be greater than \'minColorValue\'', {
        maxColorValue: posArray.maxColorValue,
        minColorValue: posArray.minColorValue,
      }]);
      posArray.render = undefined;
      return;
    }
    const re = /^#(?:[0-9a-f]{3}){1,2}$/i;
    if (typeof params.startColor !== 'string'
      || typeof params.endColor !== 'string'
      || !re.test(params.startColor)
      || !re.test(params.endColor)) {
      MapLib.LOG.error(['validateWeightedColoredDotsPositionArray'], ['When using ' +
      'weightedColoredDots\' rendering, \'startColor\' and \'endColor\' parameters must be RGB ' +
      'colors in #rrggbb format', {
        startColor: params.startColor,
        endColor: params.endColor,
        tests: [
          typeof params.startColor,
          typeof params.endColor,
          re.test(params.startColor),
          re.test(params.endColor),
          re.test(params.startColor),
        ],
      }]);
      posArray.render = undefined;
      return;
    }

    posArray.startColor = {
      r: parseInt(params.startColor.substring(1, 3), 16),
      g: parseInt(params.startColor.substring(3, 5), 16),
      b: parseInt(params.startColor.substring(5, 7), 16),
    };

    posArray.endColor = {
      r: parseInt(params.endColor.substring(1, 3), 16),
      g: parseInt(params.endColor.substring(3, 5), 16),
      b: parseInt(params.endColor.substring(5, 7), 16),
    };

    if (!params.numColorSteps) {
      posArray.numColorSteps = 5;
    } else {
      posArray.numColorSteps = params.numColorSteps;
    }

    posArray.colorGradient = ColorLib.hsvGradientFromRgbColors(
      posArray.startColor,
      posArray.endColor,
      posArray.numColorSteps);

    const step = (posArray.maxColorValue - posArray.minColorValue) / posArray.numColorSteps;
    const steps = [];
    for (let j = 0; j < posArray.numColorSteps; j++) {
      steps[j] = posArray.minColorValue + (j + 1) * step;
    }

    posArray.steps = steps;

    posArray.positions.forEach(pos => {
      const colorValue = pos[3];
      pos[5] = posArray.numColorSteps - 1;
      for (let k = 0; k < steps.length - 1; k++) {
        if (colorValue < steps[k]) {
          pos[5] = k;
          break;
        }
      }
    });
  }

  static getBoundsArray(paths, positionsData, annotationsData, geoJson) {
    const pointsArray = [];
    let size;
    this.LOG.debug(['getBoundsArray', 'paths'], paths);
    size = (paths || []).length;
    for (let i = 0; i < size; i++) {
      const path = paths[i];
      const s = (path.path || []).length;
      for (let j = 0; j < s; j++) {
        const p = path.path[j];
        pointsArray.push([p.lat, p.lon]);
      }
    }
    this.LOG.debug(['getBoundsArray', 'positionsData'], positionsData);
    size = (positionsData || []).length;
    for (let i = 0; i < size; i++) {
      const position = positionsData[i];
      const s = (position.positions || []).length;
      for (let j = 0; j < s; j++) {
        const p = position.positions[j];
        pointsArray.push([p[0], p[1]]);
      }
    }
    this.LOG.debug(['getBoundsArray', 'annotationsData'], annotationsData);
    size = (annotationsData || []).length;
    for (let i = 0; i < size; i++) {
      const annotation = annotationsData[i];
      const s = (annotation.path || []).length;
      for (let j = 0; j < s; j++) {
        const p = annotation.path[j];
        pointsArray.push([p.lat, p.lon]);
      }
    }
    size = (geoJson || []).length;
    for (let i = 0; i < size; i++) {
      const g = geoJson[i];
      switch (g.geometry.type) {
        case 'MultiPolygon':
          g.geometry.coordinates.forEach(c => c.forEach(m => m.forEach(p => pointsArray.push([p[1], p[0]]))));
          break;
        case 'Polygon':
          g.geometry.coordinates.forEach(c => c.forEach(p => pointsArray.push([p[1], p[0]])));
          break;
        case 'LineString':
          g.geometry.coordinates.forEach(p => pointsArray.push([p[1], p[0]]));
          break;
        case 'Point':
          pointsArray.push([g.geometry.coordinates[1], g.geometry.coordinates[0]]);
          break;
      }
    }
    if (pointsArray.length === 1) {
      return pointsArray;
    }
    let south = 90;
    let west = -180;
    let north = -90;
    let east = 180;
    this.LOG.debug(['getBoundsArray'], pointsArray);
    size = (pointsArray || []).length;
    for (let i = 0; i < size; i++) {
      const point = pointsArray[i];
      if (point[0] > north) {
        north = point[0];
      }
      if (point[0] < south) {
        south = point[0];
      }
      if (point[1] > west) {
        west = point[1];
      }
      if (point[1] < east) {
        east = point[1];
      }
    }
    return [[south, west], [north, east]];
  }

  static pathDataToLeaflet(pathData: any[]) {
    const path = [];
    const size = pathData.length;
    for (let i = 0; i < size; i++) {
      path.push([pathData[i].lat, pathData[i].lon]);
    }
    return path;
  }

  static toGeoJSON(data: { gts: any[]; params: any[] }) {
    const defShapes = ['Point', 'LineString', 'Polygon', 'MultiPolygon'];
    const geoJsons = [];
    data.gts.forEach(d => {
      if (d && d.type && d.type === 'Feature' && d.geometry && d.geometry.type && defShapes.indexOf(d.geometry.type) > -1) {
        geoJsons.push(d);
      } else if (d && d.type && defShapes.indexOf(d.type) > -1) {
        geoJsons.push({type: 'Feature', geometry: d});
      }
    });
    return geoJsons;
  }

  static updatePositionArrayToLeaflet(positionArray: any[]) {
    const latLng = [];
    const size = (positionArray || []).length;
    for (let i = 0; i < size; i++) {
      const pos = positionArray[i];
      latLng.push([pos[0], pos[1]]);
    }
    return latLng;
  }
}
