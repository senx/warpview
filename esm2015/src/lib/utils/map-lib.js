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
import { GTSLib } from './gts.lib';
import { ColorLib } from './color-lib';
import { Logger } from './logger';
export class MapLib {
    static toLeafletMapPaths(data, hiddenData, scheme) {
        const paths = [];
        const size = (data.gts || []).length;
        for (let i = 0; i < size; i++) {
            const gts = data.gts[i];
            let params = (data.params || [])[i];
            if (!params) {
                params = {};
            }
            if (GTSLib.isGtsToPlotOnMap(gts) && (hiddenData || []).filter(id => id === gts.id).length === 0) {
                const path = {};
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
                }
                else {
                    path.key = GTSLib.serializeGtsMetadata(gts);
                }
                if (data.params && data.params[i] && data.params[i].color) {
                    path.color = data.params[i].color;
                }
                else {
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
                path.push({ ts: Math.floor(v[0]), lat: v[1], lon: v[2], val: v[l - 1] });
            }
        }
        return path;
    }
    static extractCommonParameters(obj, params, index, scheme) {
        params = params || {};
        obj.key = params.key || '';
        obj.color = params.color || ColorLib.getColor(index, scheme);
        obj.borderColor = params.borderColor;
        obj.properties = params.properties || {};
        if (params.baseRadius === undefined
            || isNaN(parseInt(params.baseRadius, 10))
            || parseInt(params.baseRadius, 10) < 0) {
            obj.baseRadius = MapLib.BASE_RADIUS;
        }
        else {
            obj.baseRadius = params.baseRadius;
        }
    }
    static validateWeightedDotsPositionArray(posArray, params) {
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
        }
        else {
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
    static toLeafletMapPositionArray(data, hiddenData, scheme) {
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
                }
                else {
                    posArray.color = ColorLib.getColor(i, scheme);
                }
                this.LOG.debug(['toLeafletMapPositionArray', 'posArray'], posArray);
                positions.push(posArray);
            }
        }
        return positions;
    }
    static validateWeightedColoredDotsPositionArray(posArray, params) {
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
        }
        else {
            posArray.numColorSteps = params.numColorSteps;
        }
        posArray.colorGradient = ColorLib.hsvGradientFromRgbColors(posArray.startColor, posArray.endColor, posArray.numColorSteps);
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
    static pathDataToLeaflet(pathData) {
        const path = [];
        const size = pathData.length;
        for (let i = 0; i < size; i++) {
            path.push([pathData[i].lat, pathData[i].lon]);
        }
        return path;
    }
    static toGeoJSON(data) {
        const defShapes = ['Point', 'LineString', 'Polygon', 'MultiPolygon'];
        const geoJsons = [];
        data.gts.forEach(d => {
            if (d && d.type && d.type === 'Feature' && d.geometry && d.geometry.type && defShapes.indexOf(d.geometry.type) > -1) {
                geoJsons.push(d);
            }
            else if (d && d.type && defShapes.indexOf(d.type) > -1) {
                geoJsons.push({ type: 'Feature', geometry: d });
            }
        });
        return geoJsons;
    }
    static updatePositionArrayToLeaflet(positionArray) {
        const latLng = [];
        const size = (positionArray || []).length;
        for (let i = 0; i < size; i++) {
            const pos = positionArray[i];
            latLng.push([pos[0], pos[1]]);
        }
        return latLng;
    }
}
MapLib.BASE_RADIUS = 2;
MapLib.LOG = new Logger(MapLib, true);
MapLib.mapTypes = {
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
    SURFER: {
        link: 'https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png',
        attribution: `Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of
 Heidelberg</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
    },
    HYDRA: {
        link: 'https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
        attribution: `Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a>
 &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
    },
    HYDRA2: {
        link: 'https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png',
        attribution: `Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a>
 &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWxpYi5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnAtdmlldy9wcm9qZWN0cy93YXJwdmlldy1uZy8iLCJzb3VyY2VzIjpbInNyYy9saWIvdXRpbHMvbWFwLWxpYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDckMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUdoQyxNQUFNLE9BQU8sTUFBTTtJQTBHakIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQW1DLEVBQUUsVUFBb0IsRUFBRSxNQUFjO1FBQ2hHLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3JDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDWCxNQUFNLEdBQUcsRUFBRSxDQUFDO2FBQ2I7WUFDRCxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FB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LEVBQUU7WUFDOUcsUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7U0FDdkI7YUFBTTtZQUNMLFFBQVEsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztTQUNyQztRQUNELE1BQU0sSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUN6RSxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzlDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUMvQztRQUNELEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFFakQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3JDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0IsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDL0IsS0FBSyxNQUFNLENBQUMsSUFBSSxLQUFLLEVBQUU7Z0JBQ3JCLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDckIsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDWCxN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LEVBQUUseUVBQXlFO1FBQy9FLFdBQVcsRUFBRTs7bUZBRWdFO1FBQzdFLFVBQVUsRUFBRSxNQUFNO0tBQ25CO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLHNFQUFzRTtRQUM1RSxXQUFXLEVBQUU7O2tGQUUrRDtRQUM1RSxVQUFVLEVBQUUsTUFBTTtLQUNuQjtJQUNELElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxrR0FBa0c7UUFDeEcsV0FBVyxFQUFFOzZEQUMwQztLQUN4RDtJQUNELFNBQVMsRUFBRTtRQUNULElBQUksRUFBRSwrRkFBK0Y7UUFDckcsV0FBVyxFQUFFOzBDQUN1QjtLQUNyQztJQUNELE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSwrRkFBK0Y7UUFDckcsV0FBVyxFQUFFLHNIQUFzSDtLQUNwSTtJQUNELElBQUksRUFBRTtRQUNKLElBQUksRUFBRSw4R0FBOEc7UUFDcEgsTUFBTSxFQUFFLEVBQUU7S0FDWDtJQUNELFNBQVMsRUFBRTtRQUNULElBQUksRUFBRSw4R0FBOEc7UUFDcEgsV0FBVyxFQUFFLGlEQUFpRDtLQUMvRDtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSxzRUFBc0U7UUFDNUUsV0FBVyxFQUFFOzttRkFFZ0U7UUFDN0UsVUFBVSxFQUFFLE1BQU07S0FDbkI7SUFDRCxPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsZ0VBQWdFO1FBQ3RFLFdBQVcsRUFBRTtzREFDbUM7UUFDaEQsVUFBVSxFQUFFLE1BQU07S0FDbkI7SUFDRCxZQUFZLEVBQUU7UUFDWixJQUFJLEVBQUUsNkVBQTZFO1FBQ25GLFdBQVcsRUFBRTtzREFDbUM7UUFDaEQsVUFBVSxFQUFFLE1BQU07S0FDbkI7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi9ndHMubGliJztcbmltcG9ydCB7Q29sb3JMaWJ9IGZyb20gJy4vY29sb3ItbGliJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi9tb2RlbC9wYXJhbSc7XG5cbmV4cG9ydCBjbGFzcyBNYXBMaWIge1xuICBzdGF0aWMgQkFTRV9SQURJVVMgPSAyO1xuICBwcml2YXRlIHN0YXRpYyBMT0c6IExvZ2dlciA9IG5ldyBMb2dnZXIoTWFwTGliLCB0cnVlKTtcblxuICBzdGF0aWMgbWFwVHlwZXM6IGFueSA9IHtcbiAgICBOT05FOiB1bmRlZmluZWQsXG4gICAgREVGQVVMVDoge1xuICAgICAgbGluazogJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5vcmcve3p9L3t4fS97eX0ucG5nJyxcbiAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMnXG4gICAgfSxcbiAgICBIT1Q6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAuZnIvaG90L3t6fS97eH0ve3l9LnBuZycsXG4gICAgICBhdHRyaWJ1dGlvbjogYCZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCBUaWxlc1xuIHN0eWxlIGJ5IDxhIGhyZWY9XCJodHRwczovL3d3dy5ob3Rvc20ub3JnL1wiIHRhcmdldD1cIl9ibGFua1wiPkh1bWFuaXRhcmlhbiBPcGVuU3RyZWV0TWFwIFRlYW08L2E+IGhvc3RlZCBieVxuIDxhIGhyZWY9XCJodHRwczovL29wZW5zdHJlZXRtYXAuZnIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+T3BlblN0cmVldE1hcCBGcmFuY2U8L2E+YFxuICAgIH0sXG4gICAgVE9QTzoge1xuICAgICAgbGluazogJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnRvcG9tYXAub3JnL3t6fS97eH0ve3l9LnBuZycsXG4gICAgICBhdHRyaWJ1dGlvbjogYE1hcCBkYXRhOiAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycyxcbiA8YSBocmVmPVwiaHR0cDovL3ZpZXdmaW5kZXJwYW5vcmFtYXMub3JnXCI+U1JUTTwvYT4gfCBNYXAgc3R5bGU6ICZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly9vcGVudG9wb21hcC5vcmdcIj5PcGVuVG9wb01hcDwvYT5cbiAgKDxhIGhyZWY9XCJodHRwczovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnktc2EvMy4wL1wiPkNDLUJZLVNBPC9hPilgXG4gICAgfSxcbiAgICBUT1BPMjoge1xuICAgICAgbGluazogJ2h0dHBzOi8vc2VydmVyLmFyY2dpc29ubGluZS5jb20vQXJjR0lTL3Jlc3Qvc2VydmljZXMvV29ybGRfVG9wb19NYXAvTWFwU2VydmVyL3RpbGUve3p9L3t5fS97eH0nLFxuICAgICAgYXR0cmlidXRpb246IGBUaWxlcyAmY29weTsgRXNyaSAmbWRhc2g7IEVzcmksIERlTG9ybWUsIE5BVlRFUSwgVG9tVG9tLCBJbnRlcm1hcCwgaVBDLCBVU0dTLCBGQU8sIE5QUywgTlJDQU4sXG4gICAgICAgR2VvQmFzZSwgS2FkYXN0ZXIgTkwsIE9yZG5hbmNlIFN1cnZleSwgRXNyaSBKYXBhbiwgTUVUSSwgRXNyaSBDaGluYSAoSG9uZyBLb25nKSwgYW5kIHRoZSBHSVMgVXNlciBDb21tdW5pdHlgXG4gICAgfSxcbiAgICBTVVJGRVI6IHtcbiAgICAgIGxpbms6ICdodHRwczovL21hcHMuaGVpZ2l0Lm9yZy9vcGVubWFwc3VyZmVyL3RpbGVzL3JvYWRzL3dlYm1lcmNhdG9yL3t6fS97eH0ve3l9LnBuZycsXG4gICAgICBhdHRyaWJ1dGlvbjogYEltYWdlcnkgZnJvbSA8YSBocmVmPVwiaHR0cDovL2dpc2NpZW5jZS51bmktaGQuZGUvXCI+R0lTY2llbmNlIFJlc2VhcmNoIEdyb3VwIEAgVW5pdmVyc2l0eSBvZlxuIEhlaWRlbGJlcmc8L2E+IHwgTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnNgXG4gICAgfSxcbiAgICBIWURSQToge1xuICAgICAgbGluazogJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5zZS9oeWRkYS9mdWxsL3t6fS97eH0ve3l9LnBuZycsXG4gICAgICBhdHRyaWJ1dGlvbjogYFRpbGVzIGNvdXJ0ZXN5IG9mIDxhIGhyZWY9XCJodHRwOi8vb3BlbnN0cmVldG1hcC5zZS9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5PcGVuU3RyZWV0TWFwIFN3ZWRlbjwvYT5cbiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzYFxuICAgIH0sXG4gICAgSFlEUkEyOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLnNlL2h5ZGRhL2Jhc2Uve3p9L3t4fS97eX0ucG5nJyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgVGlsZXMgY291cnRlc3kgb2YgPGEgaHJlZj1cImh0dHA6Ly9vcGVuc3RyZWV0bWFwLnNlL1wiIHRhcmdldD1cIl9ibGFua1wiPk9wZW5TdHJlZXRNYXAgU3dlZGVuPC9hPlxuICZtZGFzaDsgTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnNgXG4gICAgfSxcbiAgICBUT05FUjoge1xuICAgICAgbGluazogJ2h0dHBzOi8vc3RhbWVuLXRpbGVzLXtzfS5hLnNzbC5mYXN0bHkubmV0L3RvbmVyL3t6fS97eH0ve3l9e3J9LnBuZycsXG4gICAgICBhdHRyaWJ1dGlvbjogYE1hcCB0aWxlcyBieSA8YSBocmVmPVwiaHR0cDovL3N0YW1lbi5jb21cIj5TdGFtZW4gRGVzaWduPC9hPixcbiA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wXCI+Q0MgQlkgMy4wPC9hPiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5O1xuICA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzYCxcbiAgICAgIHN1YmRvbWFpbnM6ICdhYmNkJ1xuICAgIH0sXG4gICAgVE9ORVJfTElURToge1xuICAgICAgbGluazogJ2h0dHBzOi8vc3RhbWVuLXRpbGVzLXtzfS5hLnNzbC5mYXN0bHkubmV0L3RvbmVyLWxpdGUve3p9L3t4fS97eX17cn0ucG5nJyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgTWFwIHRpbGVzIGJ5IDxhIGhyZWY9XCJodHRwOi8vc3RhbWVuLmNvbVwiPlN0YW1lbiBEZXNpZ248L2E+LFxuIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjBcIj5DQyBCWSAzLjA8L2E+ICZtZGFzaDsgTWFwIGRhdGEgJmNvcHk7XG4gIDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnNgLFxuICAgICAgc3ViZG9tYWluczogJ2FiY2QnLFxuICAgIH0sXG4gICAgVEVSUkFJTjoge1xuICAgICAgbGluazogJ2h0dHBzOi8vc3RhbWVuLXRpbGVzLXtzfS5hLnNzbC5mYXN0bHkubmV0L3RlcnJhaW4ve3p9L3t4fS97eX17cn0ucG5nJyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgTWFwIHRpbGVzIGJ5IDxhIGhyZWY9XCJodHRwOi8vc3RhbWVuLmNvbVwiPlN0YW1lbiBEZXNpZ248L2E+LFxuIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjBcIj5DQyBCWSAzLjA8L2E+ICZtZGFzaDsgTWFwIGRhdGEgJmNvcHk7XG4gPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9yc2AsXG4gICAgICBzdWJkb21haW5zOiAnYWJjZCcsXG4gICAgfSxcbiAgICBFU1JJOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9zZXJ2ZXIuYXJjZ2lzb25saW5lLmNvbS9BcmNHSVMvcmVzdC9zZXJ2aWNlcy9Xb3JsZF9TdHJlZXRfTWFwL01hcFNlcnZlci90aWxlL3t6fS97eX0ve3h9JyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgVGlsZXMgJmNvcHk7IEVzcmkgJm1kYXNoOyBTb3VyY2U6IEVzcmksIERlTG9ybWUsIE5BVlRFUSwgVVNHUywgSW50ZXJtYXAsIGlQQywgTlJDQU4sIEVzcmkgSmFwYW4sXG4gTUVUSSwgRXNyaSBDaGluYSAoSG9uZyBLb25nKSwgRXNyaSAoVGhhaWxhbmQpLCBUb21Ub20sIDIwMTJgXG4gICAgfSxcbiAgICBTQVRFTExJVEU6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3NlcnZlci5hcmNnaXNvbmxpbmUuY29tL0FyY0dJUy9yZXN0L3NlcnZpY2VzL1dvcmxkX0ltYWdlcnkvTWFwU2VydmVyL3RpbGUve3p9L3t5fS97eH0nLFxuICAgICAgYXR0cmlidXRpb246IGBUaWxlcyAmY29weTsgRXNyaSAmbWRhc2g7IFNvdXJjZTogRXNyaSwgaS1jdWJlZCwgVVNEQSwgVVNHUywgQUVYLCBHZW9FeWUsIEdldG1hcHBpbmcsIEFlcm9ncmlkLCBJR04sXG4gSUdQLCBVUFItRUdQLCBhbmQgdGhlIEdJUyBVc2VyIENvbW11bml0eWBcbiAgICB9LFxuICAgIE9DRUFOUzoge1xuICAgICAgbGluazogJ2h0dHBzOi8vc2VydmVyLmFyY2dpc29ubGluZS5jb20vQXJjR0lTL3Jlc3Qvc2VydmljZXMvT2NlYW5fQmFzZW1hcC9NYXBTZXJ2ZXIvdGlsZS97en0ve3l9L3t4fScsXG4gICAgICBhdHRyaWJ1dGlvbjogJ1RpbGVzICZjb3B5OyBFc3JpICZtZGFzaDsgU291cmNlczogR0VCQ08sIE5PQUEsIENIUywgT1NVLCBVTkgsIENTVU1CLCBOYXRpb25hbCBHZW9ncmFwaGljLCBEZUxvcm1lLCBOQVZURVEsIGFuZCBFc3JpJyxcbiAgICB9LFxuICAgIEdSQVk6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3NlcnZlci5hcmNnaXNvbmxpbmUuY29tL0FyY0dJUy9yZXN0L3NlcnZpY2VzL0NhbnZhcy9Xb3JsZF9MaWdodF9HcmF5X0Jhc2UvTWFwU2VydmVyL3RpbGUve3p9L3t5fS97eH0nLFxuICAgICAgYXR0aWJzOiAnJ1xuICAgIH0sXG4gICAgR1JBWVNDQUxFOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9zZXJ2ZXIuYXJjZ2lzb25saW5lLmNvbS9BcmNHSVMvcmVzdC9zZXJ2aWNlcy9DYW52YXMvV29ybGRfTGlnaHRfR3JheV9CYXNlL01hcFNlcnZlci90aWxlL3t6fS97eX0ve3h9JyxcbiAgICAgIGF0dHJpYnV0aW9uOiAnVGlsZXMgJmNvcHk7IEVzcmkgJm1kYXNoOyBFc3JpLCBEZUxvcm1lLCBOQVZURVEnLFxuICAgIH0sXG4gICAgV0FURVJDT0xPUjoge1xuICAgICAgbGluazogJ2h0dHBzOi8vc3RhbWVuLXRpbGVzLXtzfS5hLnNzbC5mYXN0bHkubmV0L3dhdGVyY29sb3Ive3p9L3t4fS97eX0uanBnJyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgTWFwIHRpbGVzIGJ5IDxhIGhyZWY9XCJodHRwOi8vc3RhbWVuLmNvbVwiPlN0YW1lbiBEZXNpZ248L2E+LFxuIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjBcIj5DQyBCWSAzLjA8L2E+ICZtZGFzaDsgTWFwIGRhdGEgJmNvcHk7XG4gIDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnNgLFxuICAgICAgc3ViZG9tYWluczogJ2FiY2QnLFxuICAgIH0sXG4gICAgQ0FSVE9EQjoge1xuICAgICAgbGluazogJ2h0dHBzOi8ve3N9LmJhc2VtYXBzLmNhcnRvY2RuLmNvbS9saWdodF9hbGwve3p9L3t4fS97eX17cn0ucG5nJyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMgJmNvcHk7XG4gPGEgaHJlZj1cImh0dHBzOi8vY2FydG8uY29tL2F0dHJpYnV0aW9uc1wiPkNhcnRvREI8L2E+YCxcbiAgICAgIHN1YmRvbWFpbnM6ICdhYmNkJyxcbiAgICB9LFxuICAgIENBUlRPREJfREFSSzoge1xuICAgICAgbGluazogJ2h0dHBzOi8vY2FydG9kYi1iYXNlbWFwcy17c30uZ2xvYmFsLnNzbC5mYXN0bHkubmV0L2RhcmtfYWxsL3t6fS97eH0ve3l9LnBuZycsXG4gICAgICBhdHRyaWJ1dGlvbjogYCZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzICZjb3B5O1xuIDxhIGhyZWY9XCJodHRwczovL2NhcnRvLmNvbS9hdHRyaWJ1dGlvbnNcIj5DYXJ0b0RCPC9hPmAsXG4gICAgICBzdWJkb21haW5zOiAnYWJjZCcsXG4gICAgfSxcbiAgfTtcblxuICBzdGF0aWMgdG9MZWFmbGV0TWFwUGF0aHMoZGF0YTogeyBndHM6IGFueVtdOyBwYXJhbXM6IGFueVtdIH0sIGhpZGRlbkRhdGE6IG51bWJlcltdLCBzY2hlbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHBhdGhzID0gW107XG4gICAgY29uc3Qgc2l6ZSA9IChkYXRhLmd0cyB8fCBbXSkubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBndHMgPSBkYXRhLmd0c1tpXTtcbiAgICAgIGxldCBwYXJhbXMgPSAoZGF0YS5wYXJhbXMgfHwgW10pW2ldO1xuICAgICAgaWYgKCFwYXJhbXMpIHtcbiAgICAgICAgcGFyYW1zID0ge307XG4gICAgICB9XG4gICAgICBpZiAoR1RTTGliLmlzR3RzVG9QbG90T25NYXAoZ3RzKSAmJiAoaGlkZGVuRGF0YSB8fCBbXSkuZmlsdGVyKGlkID0+IGlkID09PSBndHMuaWQpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zdCBwYXRoOiBhbnkgPSB7fTtcbiAgICAgICAgTWFwTGliLmV4dHJhY3RDb21tb25QYXJhbWV0ZXJzKHBhdGgsIHBhcmFtcywgaSwgc2NoZW1lKTtcblxuICAgICAgICBwYXRoLnBhdGggPSBNYXBMaWIuZ3RzVG9QYXRoKGd0cyk7XG4gICAgICAgIGlmICghIXBhcmFtcy5yZW5kZXIpIHtcbiAgICAgICAgICBwYXRoLnJlbmRlciA9IHBhcmFtcy5yZW5kZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEhcGFyYW1zLm1hcmtlcikge1xuICAgICAgICAgIHBhdGgubWFya2VyID0gcGFyYW1zLm1hcmtlcjtcbiAgICAgICAgfVxuICAgICAgICBwYXRoLmxpbmUgPSBwYXJhbXMuaGFzT3duUHJvcGVydHkoJ2xpbmUnKSA/IHBhcmFtcy5saW5lIDogdHJ1ZTtcbiAgICAgICAgcGF0aC5yZW5kZXIgPSBwYXRoLnJlbmRlciB8fCAnZG90cyc7XG4gICAgICAgIGlmIChwYXRoLnJlbmRlciA9PT0gJ3dlaWdodGVkRG90cycpIHtcbiAgICAgICAgICBNYXBMaWIudmFsaWRhdGVXZWlnaHRlZERvdHNQb3NpdGlvbkFycmF5KHBhdGgsIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhdGgucmVuZGVyID09PSAnY29sb3JlZFdlaWdodGVkRG90cycpIHtcbiAgICAgICAgICBNYXBMaWIudmFsaWRhdGVXZWlnaHRlZENvbG9yZWREb3RzUG9zaXRpb25BcnJheShwYXRoLCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLnBhcmFtcyAmJiBkYXRhLnBhcmFtc1tpXSAmJiBkYXRhLnBhcmFtc1tpXS5rZXkpIHtcbiAgICAgICAgICBwYXRoLmtleSA9IGRhdGEucGFyYW1zW2ldLmtleTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXRoLmtleSA9IEdUU0xpYi5zZXJpYWxpemVHdHNNZXRhZGF0YShndHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLnBhcmFtcyAmJiBkYXRhLnBhcmFtc1tpXSAmJiBkYXRhLnBhcmFtc1tpXS5jb2xvcikge1xuICAgICAgICAgIHBhdGguY29sb3IgPSBkYXRhLnBhcmFtc1tpXS5jb2xvcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXRoLmNvbG9yID0gQ29sb3JMaWIuZ2V0Q29sb3IoaSwgc2NoZW1lKTtcbiAgICAgICAgfVxuICAgICAgICBwYXRocy5wdXNoKHBhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGF0aHM7XG4gIH1cblxuICBzdGF0aWMgZ3RzVG9QYXRoKGd0cykge1xuICAgIGNvbnN0IHBhdGggPSBbXTtcbiAgICBjb25zdCBzaXplID0gKGd0cy52IHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IHYgPSBndHMudltpXTtcbiAgICAgIGNvbnN0IGwgPSB2Lmxlbmd0aDtcbiAgICAgIGlmIChsID49IDQpIHtcbiAgICAgICAgLy8gdGltZXN0YW1wLCBsYXQsIGxvbiwgZWxldj8sIHZhbHVlXG4gICAgICAgIHBhdGgucHVzaCh7dHM6IE1hdGguZmxvb3IodlswXSksIGxhdDogdlsxXSwgbG9uOiB2WzJdLCB2YWw6IHZbbCAtIDFdfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXRoO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZXh0cmFjdENvbW1vblBhcmFtZXRlcnMob2JqLCBwYXJhbXMsIGluZGV4LCBzY2hlbWU6IHN0cmluZykge1xuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICBvYmoua2V5ID0gcGFyYW1zLmtleSB8fCAnJztcbiAgICBvYmouY29sb3IgPSBwYXJhbXMuY29sb3IgfHwgQ29sb3JMaWIuZ2V0Q29sb3IoaW5kZXgsIHNjaGVtZSk7XG4gICAgb2JqLmJvcmRlckNvbG9yID0gcGFyYW1zLmJvcmRlckNvbG9yO1xuICAgIG9iai5wcm9wZXJ0aWVzID0gcGFyYW1zLnByb3BlcnRpZXMgfHwge307XG4gICAgaWYgKHBhcmFtcy5iYXNlUmFkaXVzID09PSB1bmRlZmluZWRcbiAgICAgIHx8IGlzTmFOKHBhcnNlSW50KHBhcmFtcy5iYXNlUmFkaXVzLCAxMCkpXG4gICAgICB8fCBwYXJzZUludChwYXJhbXMuYmFzZVJhZGl1cywgMTApIDwgMCkge1xuICAgICAgb2JqLmJhc2VSYWRpdXMgPSBNYXBMaWIuQkFTRV9SQURJVVM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iai5iYXNlUmFkaXVzID0gcGFyYW1zLmJhc2VSYWRpdXM7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgdmFsaWRhdGVXZWlnaHRlZERvdHNQb3NpdGlvbkFycmF5KHBvc0FycmF5LCBwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zLm1pblZhbHVlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLm1heFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIE1hcExpYi5MT0cuZXJyb3IoWyd2YWxpZGF0ZVdlaWdodGVkRG90c1Bvc2l0aW9uQXJyYXknXSwgJ1doZW4gdXNpbmcgXFwnd2VpZ2h0ZWREb3RzXFwnIG9yICcgK1xuICAgICAgICAnXFwnd2VpZ2h0ZWRDb2xvcmVkRG90c1xcJyByZW5kZXJpbmcsIFxcJ21heFZhbHVlXFwnIGFuZCBcXCdtaW5WYWx1ZVxcJyBwYXJhbWV0ZXJzIGFyZSBjb21wdWxzb3J5Jyk7XG4gICAgICBwb3NBcnJheS5yZW5kZXIgPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHBvc0FycmF5Lm1heFZhbHVlID0gcGFyYW1zLm1heFZhbHVlO1xuICAgIHBvc0FycmF5Lm1pblZhbHVlID0gcGFyYW1zLm1pblZhbHVlO1xuICAgIGlmICh0eXBlb2YgcG9zQXJyYXkubWluVmFsdWUgIT09ICdudW1iZXInIHx8XG4gICAgICB0eXBlb2YgcG9zQXJyYXkubWF4VmFsdWUgIT09ICdudW1iZXInIHx8XG4gICAgICBwb3NBcnJheS5taW5WYWx1ZSA+PSBwb3NBcnJheS5tYXhWYWx1ZSkge1xuICAgICAgTWFwTGliLkxPRy5lcnJvcihbJ3ZhbGlkYXRlV2VpZ2h0ZWREb3RzUG9zaXRpb25BcnJheSddLCAnV2hlbiB1c2luZyBcXCd3ZWlnaHRlZERvdHNcXCcgb3IgJyArXG4gICAgICAgICdcXCd3ZWlnaHRlZENvbG9yZWREb3RzXFwnIHJlbmRlcmluZywgXFwnbWF4VmFsdWVcXCcgYW5kIFxcJ21pblZhbHVlXFwnIG11c3QgYmUgbnVtYmVycyBhbmQgXFwnbWF4VmFsdWVcXCcgJyArXG4gICAgICAgICdtdXN0IGJlIGdyZWF0ZXIgdGhhbiBcXCdtaW5WYWx1ZVxcJycpO1xuICAgICAgcG9zQXJyYXkucmVuZGVyID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIUdUU0xpYi5pc1Bvc2l0aW9uc0FycmF5V2l0aFZhbHVlcyhwb3NBcnJheSkgJiYgIUdUU0xpYi5pc1Bvc2l0aW9uc0FycmF5V2l0aFR3b1ZhbHVlcyhwb3NBcnJheSkpIHtcbiAgICAgIE1hcExpYi5MT0cuZXJyb3IoWyd2YWxpZGF0ZVdlaWdodGVkRG90c1Bvc2l0aW9uQXJyYXknXSwgJ1doZW4gdXNpbmcgXFwnd2VpZ2h0ZWREb3RzXFwnIG9yICcgK1xuICAgICAgICAnXFwnd2VpZ2h0ZWRDb2xvcmVkRG90c1xcJyByZW5kZXJpbmcsIHBvc2l0aW9ucyBtdXN0IGhhdmUgYW4gYXNzb2NpYXRlZCB2YWx1ZScpO1xuICAgICAgcG9zQXJyYXkucmVuZGVyID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXMubnVtU3RlcHMgPT09IHVuZGVmaW5lZCB8fCBpc05hTihwYXJzZUludChwYXJhbXMubnVtU3RlcHMsIDEwKSkgfHwgcGFyc2VJbnQocGFyYW1zLm51bVN0ZXBzLCAxMCkgPCAwKSB7XG4gICAgICBwb3NBcnJheS5udW1TdGVwcyA9IDU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc0FycmF5Lm51bVN0ZXBzID0gcGFyYW1zLm51bVN0ZXBzO1xuICAgIH1cbiAgICBjb25zdCBzdGVwID0gKHBvc0FycmF5Lm1heFZhbHVlIC0gcG9zQXJyYXkubWluVmFsdWUpIC8gcG9zQXJyYXkubnVtU3RlcHM7XG4gICAgY29uc3Qgc3RlcHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc0FycmF5Lm51bVN0ZXBzIC0gMTsgaSsrKSB7XG4gICAgICBzdGVwc1tpXSA9IHBvc0FycmF5Lm1pblZhbHVlICsgKGkgKyAxKSAqIHN0ZXA7XG4gICAgfVxuICAgIHN0ZXBzW3Bvc0FycmF5Lm51bVN0ZXBzIC0gMV0gPSBwb3NBcnJheS5tYXhWYWx1ZTtcblxuICAgIGNvbnN0IHNpemUgPSAocG9zQXJyYXkgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgcG9zID0gcG9zQXJyYXlbaV07XG4gICAgICBjb25zdCB2YWx1ZSA9IHBvc1syXTtcbiAgICAgIHBvc1s0XSA9IHBvc0FycmF5Lm51bVN0ZXBzIC0gMTtcbiAgICAgIGZvciAoY29uc3QgayBpbiBzdGVwcykge1xuICAgICAgICBpZiAodmFsdWUgPD0gc3RlcHNba10pIHtcbiAgICAgICAgICBwb3NbNF0gPSBrO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc3RhdGljIHRvTGVhZmxldE1hcFBvc2l0aW9uQXJyYXkoZGF0YTogeyBndHM6IGFueVtdOyBwYXJhbXM6IGFueVtdIH0sIGhpZGRlbkRhdGE6IG51bWJlcltdLCBzY2hlbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHBvc2l0aW9ucyA9IFtdO1xuICAgIGNvbnN0IHNpemUgPSAoZGF0YS5ndHMgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgZ3RzID0gZGF0YS5ndHNbaV07XG4gICAgICBpZiAoR1RTTGliLmlzUG9zaXRpb25BcnJheShndHMpICYmIChoaWRkZW5EYXRhIHx8IFtdKS5maWx0ZXIoaWQgPT4gaWQgPT09IGd0cy5pZCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsndG9MZWFmbGV0TWFwUG9zaXRpb25BcnJheSddLCBndHMsIGRhdGEucGFyYW1zID8gZGF0YS5wYXJhbXNbaV0gOiAnJyk7XG4gICAgICAgIGNvbnN0IHBvc0FycmF5ID0gZ3RzO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBkYXRhLnBhcmFtcyA/IGRhdGEucGFyYW1zW2ldIHx8IHt9IDoge307XG4gICAgICAgIE1hcExpYi5leHRyYWN0Q29tbW9uUGFyYW1ldGVycyhwb3NBcnJheSwgcGFyYW1zLCBpLCBzY2hlbWUpO1xuICAgICAgICBwb3NBcnJheS5yZW5kZXIgPSBwYXJhbXMucmVuZGVyIHx8ICdkb3RzJztcbiAgICAgICAgcG9zQXJyYXkubWF4VmFsdWUgPSBwYXJhbXMubWF4VmFsdWUgfHwgMDtcbiAgICAgICAgcG9zQXJyYXkubWluVmFsdWUgPSBwYXJhbXMubWluVmFsdWUgfHwgMDtcbiAgICAgICAgcG9zQXJyYXkubGluZSA9IHBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgnbGluZScpID8gcGFyYW1zLmxpbmUgOiBmYWxzZTtcbiAgICAgICAgaWYgKHBvc0FycmF5LnJlbmRlciA9PT0gJ3dlaWdodGVkRG90cycpIHtcbiAgICAgICAgICBNYXBMaWIudmFsaWRhdGVXZWlnaHRlZERvdHNQb3NpdGlvbkFycmF5KHBvc0FycmF5LCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NBcnJheS5yZW5kZXIgPT09ICdjb2xvcmVkV2VpZ2h0ZWREb3RzJykge1xuICAgICAgICAgIE1hcExpYi52YWxpZGF0ZVdlaWdodGVkQ29sb3JlZERvdHNQb3NpdGlvbkFycmF5KHBvc0FycmF5LCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NBcnJheS5yZW5kZXIgPT09ICdtYXJrZXInKSB7XG4gICAgICAgICAgcG9zQXJyYXkubWFya2VyID0gcGFyYW1zLm1hcmtlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5wYXJhbXMgJiYgZGF0YS5wYXJhbXNbaV0gJiYgZGF0YS5wYXJhbXNbaV0uY29sb3IpIHtcbiAgICAgICAgICBwb3NBcnJheS5jb2xvciA9IGRhdGEucGFyYW1zW2ldLmNvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBvc0FycmF5LmNvbG9yID0gQ29sb3JMaWIuZ2V0Q29sb3IoaSwgc2NoZW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3RvTGVhZmxldE1hcFBvc2l0aW9uQXJyYXknLCAncG9zQXJyYXknXSwgcG9zQXJyYXkpO1xuICAgICAgICBwb3NpdGlvbnMucHVzaChwb3NBcnJheSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwb3NpdGlvbnM7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyB2YWxpZGF0ZVdlaWdodGVkQ29sb3JlZERvdHNQb3NpdGlvbkFycmF5KHBvc0FycmF5OiBhbnksIHBhcmFtczogUGFyYW0pIHtcbiAgICBpZiAoIU1hcExpYi52YWxpZGF0ZVdlaWdodGVkRG90c1Bvc2l0aW9uQXJyYXkocG9zQXJyYXksIHBhcmFtcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFwYXJhbXMubWluQ29sb3IgfHwgIXBhcmFtcy5tYXhDb2xvciB8fCAhcGFyYW1zLnN0YXJ0Q29sb3IgfHwgIXBhcmFtcy5lbmRDb2xvcikge1xuICAgICAgTWFwTGliLkxPRy5lcnJvcihbJ3ZhbGlkYXRlV2VpZ2h0ZWRDb2xvcmVkRG90c1Bvc2l0aW9uQXJyYXknXSwgJ1doZW4gdXNpbmcgJyArXG4gICAgICAgICdcXCd3ZWlnaHRlZENvbG9yZWREb3RzXFwnIHJlbmRlcmluZywgXFwnbWF4Q29sb3JWYWx1ZVxcJywgXFwnbWluQ29sb3JWYWx1ZVxcJywgXFwnc3RhcnRDb2xvclxcJyAnICtcbiAgICAgICAgJ2FuZCBcXCdlbmRDb2xvclxcJyBwYXJhbWV0ZXJzIGFyZSBjb21wdWxzb3J5Jyk7XG4gICAgICBwb3NBcnJheS5yZW5kZXIgPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcG9zQXJyYXkubWF4Q29sb3JWYWx1ZSA9IHBhcmFtcy5tYXhDb2xvcjtcbiAgICBwb3NBcnJheS5taW5Db2xvclZhbHVlID0gcGFyYW1zLm1pbkNvbG9yO1xuXG4gICAgaWYgKHR5cGVvZiBwb3NBcnJheS5taW5Db2xvclZhbHVlICE9PSAnbnVtYmVyJyB8fFxuICAgICAgdHlwZW9mIHBvc0FycmF5Lm1heENvbG9yVmFsdWUgIT09ICdudW1iZXInIHx8XG4gICAgICBwb3NBcnJheS5taW5Db2xvclZhbHVlID49IHBvc0FycmF5Lm1heENvbG9yVmFsdWUpIHtcbiAgICAgIE1hcExpYi5MT0cuZXJyb3IoWyd2YWxpZGF0ZVdlaWdodGVkQ29sb3JlZERvdHNQb3NpdGlvbkFycmF5J10sIFsnV2hlbiB1c2luZyAnICtcbiAgICAgICd3ZWlnaHRlZENvbG9yZWREb3RzXFwnIHJlbmRlcmluZywgXFwnbWF4Q29sb3JWYWx1ZVxcJyBhbmQgXFwnbWluQ29sb3JWYWx1ZVxcJyBtdXN0IGJlIG51bWJlcnMgJyArXG4gICAgICAnYW5kIFxcJ21heENvbG9yVmFsdWVcXCcgbXVzdCBiZSBncmVhdGVyIHRoYW4gXFwnbWluQ29sb3JWYWx1ZVxcJycsIHtcbiAgICAgICAgbWF4Q29sb3JWYWx1ZTogcG9zQXJyYXkubWF4Q29sb3JWYWx1ZSxcbiAgICAgICAgbWluQ29sb3JWYWx1ZTogcG9zQXJyYXkubWluQ29sb3JWYWx1ZSxcbiAgICAgIH1dKTtcbiAgICAgIHBvc0FycmF5LnJlbmRlciA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcmUgPSAvXiMoPzpbMC05YS1mXXszfSl7MSwyfSQvaTtcbiAgICBpZiAodHlwZW9mIHBhcmFtcy5zdGFydENvbG9yICE9PSAnc3RyaW5nJ1xuICAgICAgfHwgdHlwZW9mIHBhcmFtcy5lbmRDb2xvciAhPT0gJ3N0cmluZydcbiAgICAgIHx8ICFyZS50ZXN0KHBhcmFtcy5zdGFydENvbG9yKVxuICAgICAgfHwgIXJlLnRlc3QocGFyYW1zLmVuZENvbG9yKSkge1xuICAgICAgTWFwTGliLkxPRy5lcnJvcihbJ3ZhbGlkYXRlV2VpZ2h0ZWRDb2xvcmVkRG90c1Bvc2l0aW9uQXJyYXknXSwgWydXaGVuIHVzaW5nICcgK1xuICAgICAgJ3dlaWdodGVkQ29sb3JlZERvdHNcXCcgcmVuZGVyaW5nLCBcXCdzdGFydENvbG9yXFwnIGFuZCBcXCdlbmRDb2xvclxcJyBwYXJhbWV0ZXJzIG11c3QgYmUgUkdCICcgK1xuICAgICAgJ2NvbG9ycyBpbiAjcnJnZ2JiIGZvcm1hdCcsIHtcbiAgICAgICAgc3RhcnRDb2xvcjogcGFyYW1zLnN0YXJ0Q29sb3IsXG4gICAgICAgIGVuZENvbG9yOiBwYXJhbXMuZW5kQ29sb3IsXG4gICAgICAgIHRlc3RzOiBbXG4gICAgICAgICAgdHlwZW9mIHBhcmFtcy5zdGFydENvbG9yLFxuICAgICAgICAgIHR5cGVvZiBwYXJhbXMuZW5kQ29sb3IsXG4gICAgICAgICAgcmUudGVzdChwYXJhbXMuc3RhcnRDb2xvciksXG4gICAgICAgICAgcmUudGVzdChwYXJhbXMuZW5kQ29sb3IpLFxuICAgICAgICAgIHJlLnRlc3QocGFyYW1zLnN0YXJ0Q29sb3IpLFxuICAgICAgICBdLFxuICAgICAgfV0pO1xuICAgICAgcG9zQXJyYXkucmVuZGVyID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBvc0FycmF5LnN0YXJ0Q29sb3IgPSB7XG4gICAgICByOiBwYXJzZUludChwYXJhbXMuc3RhcnRDb2xvci5zdWJzdHJpbmcoMSwgMyksIDE2KSxcbiAgICAgIGc6IHBhcnNlSW50KHBhcmFtcy5zdGFydENvbG9yLnN1YnN0cmluZygzLCA1KSwgMTYpLFxuICAgICAgYjogcGFyc2VJbnQocGFyYW1zLnN0YXJ0Q29sb3Iuc3Vic3RyaW5nKDUsIDcpLCAxNiksXG4gICAgfTtcblxuICAgIHBvc0FycmF5LmVuZENvbG9yID0ge1xuICAgICAgcjogcGFyc2VJbnQocGFyYW1zLmVuZENvbG9yLnN1YnN0cmluZygxLCAzKSwgMTYpLFxuICAgICAgZzogcGFyc2VJbnQocGFyYW1zLmVuZENvbG9yLnN1YnN0cmluZygzLCA1KSwgMTYpLFxuICAgICAgYjogcGFyc2VJbnQocGFyYW1zLmVuZENvbG9yLnN1YnN0cmluZyg1LCA3KSwgMTYpLFxuICAgIH07XG5cbiAgICBpZiAoIXBhcmFtcy5udW1Db2xvclN0ZXBzKSB7XG4gICAgICBwb3NBcnJheS5udW1Db2xvclN0ZXBzID0gNTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zQXJyYXkubnVtQ29sb3JTdGVwcyA9IHBhcmFtcy5udW1Db2xvclN0ZXBzO1xuICAgIH1cblxuICAgIHBvc0FycmF5LmNvbG9yR3JhZGllbnQgPSBDb2xvckxpYi5oc3ZHcmFkaWVudEZyb21SZ2JDb2xvcnMoXG4gICAgICBwb3NBcnJheS5zdGFydENvbG9yLFxuICAgICAgcG9zQXJyYXkuZW5kQ29sb3IsXG4gICAgICBwb3NBcnJheS5udW1Db2xvclN0ZXBzKTtcblxuICAgIGNvbnN0IHN0ZXAgPSAocG9zQXJyYXkubWF4Q29sb3JWYWx1ZSAtIHBvc0FycmF5Lm1pbkNvbG9yVmFsdWUpIC8gcG9zQXJyYXkubnVtQ29sb3JTdGVwcztcbiAgICBjb25zdCBzdGVwcyA9IFtdO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgcG9zQXJyYXkubnVtQ29sb3JTdGVwczsgaisrKSB7XG4gICAgICBzdGVwc1tqXSA9IHBvc0FycmF5Lm1pbkNvbG9yVmFsdWUgKyAoaiArIDEpICogc3RlcDtcbiAgICB9XG5cbiAgICBwb3NBcnJheS5zdGVwcyA9IHN0ZXBzO1xuXG4gICAgcG9zQXJyYXkucG9zaXRpb25zLmZvckVhY2gocG9zID0+IHtcbiAgICAgIGNvbnN0IGNvbG9yVmFsdWUgPSBwb3NbM107XG4gICAgICBwb3NbNV0gPSBwb3NBcnJheS5udW1Db2xvclN0ZXBzIC0gMTtcbiAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgc3RlcHMubGVuZ3RoIC0gMTsgaysrKSB7XG4gICAgICAgIGlmIChjb2xvclZhbHVlIDwgc3RlcHNba10pIHtcbiAgICAgICAgICBwb3NbNV0gPSBrO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0Qm91bmRzQXJyYXkocGF0aHMsIHBvc2l0aW9uc0RhdGEsIGFubm90YXRpb25zRGF0YSwgZ2VvSnNvbikge1xuICAgIGNvbnN0IHBvaW50c0FycmF5ID0gW107XG4gICAgbGV0IHNpemU7XG4gICAgdGhpcy5MT0cuZGVidWcoWydnZXRCb3VuZHNBcnJheScsICdwYXRocyddLCBwYXRocyk7XG4gICAgc2l6ZSA9IChwYXRocyB8fCBbXSkubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBwYXRoID0gcGF0aHNbaV07XG4gICAgICBjb25zdCBzID0gKHBhdGgucGF0aCB8fCBbXSkubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzOyBqKyspIHtcbiAgICAgICAgY29uc3QgcCA9IHBhdGgucGF0aFtqXTtcbiAgICAgICAgcG9pbnRzQXJyYXkucHVzaChbcC5sYXQsIHAubG9uXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnZ2V0Qm91bmRzQXJyYXknLCAncG9zaXRpb25zRGF0YSddLCBwb3NpdGlvbnNEYXRhKTtcbiAgICBzaXplID0gKHBvc2l0aW9uc0RhdGEgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSBwb3NpdGlvbnNEYXRhW2ldO1xuICAgICAgY29uc3QgcyA9IChwb3NpdGlvbi5wb3NpdGlvbnMgfHwgW10pLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgczsgaisrKSB7XG4gICAgICAgIGNvbnN0IHAgPSBwb3NpdGlvbi5wb3NpdGlvbnNbal07XG4gICAgICAgIHBvaW50c0FycmF5LnB1c2goW3BbMF0sIHBbMV1dKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydnZXRCb3VuZHNBcnJheScsICdhbm5vdGF0aW9uc0RhdGEnXSwgYW5ub3RhdGlvbnNEYXRhKTtcbiAgICBzaXplID0gKGFubm90YXRpb25zRGF0YSB8fCBbXSkubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBhbm5vdGF0aW9uID0gYW5ub3RhdGlvbnNEYXRhW2ldO1xuICAgICAgY29uc3QgcyA9IChhbm5vdGF0aW9uLnBhdGggfHwgW10pLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgczsgaisrKSB7XG4gICAgICAgIGNvbnN0IHAgPSBhbm5vdGF0aW9uLnBhdGhbal07XG4gICAgICAgIHBvaW50c0FycmF5LnB1c2goW3AubGF0LCBwLmxvbl0pO1xuICAgICAgfVxuICAgIH1cbiAgICBzaXplID0gKGdlb0pzb24gfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgZyA9IGdlb0pzb25baV07XG4gICAgICBzd2l0Y2ggKGcuZ2VvbWV0cnkudHlwZSkge1xuICAgICAgICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICAgICAgICAgIGcuZ2VvbWV0cnkuY29vcmRpbmF0ZXMuZm9yRWFjaChjID0+IGMuZm9yRWFjaChtID0+IG0uZm9yRWFjaChwID0+IHBvaW50c0FycmF5LnB1c2goW3BbMV0sIHBbMF1dKSkpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnUG9seWdvbic6XG4gICAgICAgICAgZy5nZW9tZXRyeS5jb29yZGluYXRlcy5mb3JFYWNoKGMgPT4gYy5mb3JFYWNoKHAgPT4gcG9pbnRzQXJyYXkucHVzaChbcFsxXSwgcFswXV0pKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0xpbmVTdHJpbmcnOlxuICAgICAgICAgIGcuZ2VvbWV0cnkuY29vcmRpbmF0ZXMuZm9yRWFjaChwID0+IHBvaW50c0FycmF5LnB1c2goW3BbMV0sIHBbMF1dKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1BvaW50JzpcbiAgICAgICAgICBwb2ludHNBcnJheS5wdXNoKFtnLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzFdLCBnLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwb2ludHNBcnJheS5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBwb2ludHNBcnJheTtcbiAgICB9XG4gICAgbGV0IHNvdXRoID0gOTA7XG4gICAgbGV0IHdlc3QgPSAtMTgwO1xuICAgIGxldCBub3J0aCA9IC05MDtcbiAgICBsZXQgZWFzdCA9IDE4MDtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2dldEJvdW5kc0FycmF5J10sIHBvaW50c0FycmF5KTtcbiAgICBzaXplID0gKHBvaW50c0FycmF5IHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IHBvaW50ID0gcG9pbnRzQXJyYXlbaV07XG4gICAgICBpZiAocG9pbnRbMF0gPiBub3J0aCkge1xuICAgICAgICBub3J0aCA9IHBvaW50WzBdO1xuICAgICAgfVxuICAgICAgaWYgKHBvaW50WzBdIDwgc291dGgpIHtcbiAgICAgICAgc291dGggPSBwb2ludFswXTtcbiAgICAgIH1cbiAgICAgIGlmIChwb2ludFsxXSA+IHdlc3QpIHtcbiAgICAgICAgd2VzdCA9IHBvaW50WzFdO1xuICAgICAgfVxuICAgICAgaWYgKHBvaW50WzFdIDwgZWFzdCkge1xuICAgICAgICBlYXN0ID0gcG9pbnRbMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbW3NvdXRoLCB3ZXN0XSwgW25vcnRoLCBlYXN0XV07XG4gIH1cblxuICBzdGF0aWMgcGF0aERhdGFUb0xlYWZsZXQocGF0aERhdGE6IGFueVtdKSB7XG4gICAgY29uc3QgcGF0aCA9IFtdO1xuICAgIGNvbnN0IHNpemUgPSBwYXRoRGF0YS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIHBhdGgucHVzaChbcGF0aERhdGFbaV0ubGF0LCBwYXRoRGF0YVtpXS5sb25dKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cblxuICBzdGF0aWMgdG9HZW9KU09OKGRhdGE6IHsgZ3RzOiBhbnlbXTsgcGFyYW1zOiBhbnlbXSB9KSB7XG4gICAgY29uc3QgZGVmU2hhcGVzID0gWydQb2ludCcsICdMaW5lU3RyaW5nJywgJ1BvbHlnb24nLCAnTXVsdGlQb2x5Z29uJ107XG4gICAgY29uc3QgZ2VvSnNvbnMgPSBbXTtcbiAgICBkYXRhLmd0cy5mb3JFYWNoKGQgPT4ge1xuICAgICAgaWYgKGQgJiYgZC50eXBlICYmIGQudHlwZSA9PT0gJ0ZlYXR1cmUnICYmIGQuZ2VvbWV0cnkgJiYgZC5nZW9tZXRyeS50eXBlICYmIGRlZlNoYXBlcy5pbmRleE9mKGQuZ2VvbWV0cnkudHlwZSkgPiAtMSkge1xuICAgICAgICBnZW9Kc29ucy5wdXNoKGQpO1xuICAgICAgfSBlbHNlIGlmIChkICYmIGQudHlwZSAmJiBkZWZTaGFwZXMuaW5kZXhPZihkLnR5cGUpID4gLTEpIHtcbiAgICAgICAgZ2VvSnNvbnMucHVzaCh7dHlwZTogJ0ZlYXR1cmUnLCBnZW9tZXRyeTogZH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBnZW9Kc29ucztcbiAgfVxuXG4gIHN0YXRpYyB1cGRhdGVQb3NpdGlvbkFycmF5VG9MZWFmbGV0KHBvc2l0aW9uQXJyYXk6IGFueVtdKSB7XG4gICAgY29uc3QgbGF0TG5nID0gW107XG4gICAgY29uc3Qgc2l6ZSA9IChwb3NpdGlvbkFycmF5IHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IHBvcyA9IHBvc2l0aW9uQXJyYXlbaV07XG4gICAgICBsYXRMbmcucHVzaChbcG9zWzBdLCBwb3NbMV1dKTtcbiAgICB9XG4gICAgcmV0dXJuIGxhdExuZztcbiAgfVxufVxuIl19