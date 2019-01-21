import { GTSLib } from "./gts.lib";
import { ColorLib } from "./color-lib";
import { Logger } from "./logger";
export class MapLib {
    static toLeafletMapPaths(data, hiddenData, divider = 1000) {
        let paths = [];
        data.gts.map((gts, i) => {
            if (GTSLib.isGtsToPlot(gts) && hiddenData.filter((i) => i === gts.id).length === 0) {
                let sl = {};
                sl.path = GTSLib.gtsToPath(gts, divider);
                if (data.params && data.params[i] && data.params[i].key) {
                    sl.key = data.params[i].key;
                }
                else {
                    sl.key = GTSLib.serializeGtsMetadata(gts);
                }
                if (data.params && data.params[i] && data.params[i].color) {
                    sl.color = data.params[i].color;
                }
                else {
                    sl.color = ColorLib.getColor(i);
                }
                paths.push(sl);
            }
        });
        return paths;
    }
    static annotationsToLeafletPositions(data, hiddenData, divider = 1000) {
        let annotations = [];
        data.gts.map((gts, i) => {
            if (GTSLib.isGtsToAnnotate(gts) && hiddenData.filter((i) => i === gts.id).length === 0) {
                this.LOG.debug(['annotationsToLeafletPositions'], gts);
                let annotation = {};
                let params = (data.params || [])[i];
                if (!params) {
                    params = {};
                }
                annotation.path = GTSLib.gtsToPath(gts, divider);
                MapLib.extractCommonParameters(annotation, params, i);
                if (params.render) {
                    annotation.render = params.render;
                }
                if (annotation.render === 'marker') {
                    annotation.marker = 'circle';
                }
                if (annotation.render === 'weightedDots') {
                    MapLib.validateWeightedDotsPositionArray(annotation, params);
                }
                this.LOG.debug(['annotationsToLeafletPositions', 'annotations'], annotation);
                annotations.push(annotation);
            }
        });
        return annotations;
    }
    static extractCommonParameters(obj, params, index) {
        obj.key = params.key || '';
        obj.color = params.color || ColorLib.getColor(index);
        obj.borderColor = params.borderColor || '#000';
        if (params.baseRadius === undefined || isNaN(parseInt(params.baseRadius)) || parseInt(params.baseRadius) < 0) {
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
        if (params.numSteps === undefined || isNaN(parseInt(params.numSteps)) || parseInt(params.numSteps) < 0) {
            posArray.numSteps = 5;
        }
        else {
            posArray.numSteps = params.numSteps;
        }
        let step = (posArray.maxValue - posArray.minValue) / posArray.numSteps;
        let steps = [];
        for (let j = 0; j < posArray.numSteps - 1; j++) {
            steps[j] = posArray.minValue + (j + 1) * step;
        }
        steps[posArray.numSteps - 1] = posArray.maxValue;
        posArray.positions.forEach((pos) => {
            let value = pos[2];
            pos[4] = posArray.numSteps - 1;
            for (let k in steps) {
                if (value <= steps[k]) {
                    pos[4] = k;
                    break;
                }
            }
        });
        return true;
    }
    static toLeafletMapPositionArray(data, hiddenData) {
        let positions = [];
        data.gts.map((gts, i) => {
            if (GTSLib.isPositionArray(gts) && hiddenData.filter((i) => i === gts.id).length === 0) {
                this.LOG.debug(['toLeafletMapPositionArray'], gts, data.params[i]);
                let posArray = gts;
                let params = data.params[i];
                MapLib.extractCommonParameters(posArray, params, i);
                if (params.render !== undefined) {
                    posArray.render = params.render;
                }
                if (posArray.render === 'weightedDots') {
                    MapLib.validateWeightedDotsPositionArray(posArray, params);
                }
                if (posArray.render === 'coloredWeightedDots') {
                    MapLib.validateWeightedColoredDotsPositionArray(posArray, params);
                }
                if (posArray.render === 'marker') {
                    posArray.marker = params.marker;
                }
                this.LOG.debug(['toLeafletMapPositionArray', 'posArray'], posArray);
                positions.push(posArray);
            }
        });
        return positions;
    }
    static validateWeightedColoredDotsPositionArray(posArray, params) {
        if (!MapLib.validateWeightedDotsPositionArray(posArray, params)) {
            return;
        }
        if (params.minColorValue === undefined ||
            params.maxColorValue === undefined ||
            params.startColor === undefined ||
            params.endColor === undefined) {
            MapLib.LOG.error(['validateWeightedColoredDotsPositionArray'], 'When using ' +
                '\'weightedColoredDots\' rendering, \'maxColorValue\', \'minColorValue\', \'startColor\' ' +
                'and \'endColor\' parameters are compulsory');
            posArray.render = undefined;
            return;
        }
        posArray.maxColorValue = params.maxColorValue;
        posArray.minColorValue = params.minColorValue;
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
        let re = /^#(?:[0-9a-f]{3}){1,2}$/i;
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
        if (params.numColorSteps === undefined ||
            isNaN(parseInt(params.numColorSteps)) ||
            parseInt(params.numColorSteps) < 0) {
            posArray.numColorSteps = 5;
        }
        else {
            posArray.numColorSteps = params.numColorSteps;
        }
        posArray.colorGradient = ColorLib.hsvGradientFromRgbColors(posArray.startColor, posArray.endColor, posArray.numColorSteps);
        let step = (posArray.maxColorValue - posArray.minColorValue) / posArray.numColorSteps;
        let steps = [];
        for (let j = 0; j < posArray.numColorSteps; j++) {
            steps[j] = posArray.minColorValue + (j + 1) * step;
        }
        posArray.steps = steps;
        posArray.positions.forEach(pos => {
            let colorValue = pos[3];
            pos[5] = posArray.numColorSteps - 1;
            for (let k = 0; k < steps.length - 1; k++) {
                if (colorValue < steps[k]) {
                    pos[5] = k;
                    break;
                }
            }
        });
    }
    static getBoundsArray(paths, positionsData, annotationsData) {
        let pointsArray = [];
        for (let i = 0; i < paths.length; i++) {
            for (let j = 0; j < paths[i].path.length; j++) {
                pointsArray.push([parseFloat(paths[i].path[j].lat), paths[i].path[j].lon]);
            }
        }
        for (let i = 0; i < positionsData.length; i++) {
            for (let j = 0; j < positionsData[i].positions.length; j++) {
                pointsArray.push([positionsData[i].positions[j][0], positionsData[i].positions[j][1]]);
            }
        }
        for (let i = 0; i < annotationsData.length; i++) {
            for (let j = 0; j < annotationsData[i].path.length; j++) {
                pointsArray.push([annotationsData[i].path[j].lat, annotationsData[i].path[j].lon]);
            }
        }
        if (pointsArray.length === 1) {
            return pointsArray;
        }
        let south = 90;
        let west = -180;
        let north = -90;
        let east = 180;
        pointsArray.forEach((point) => {
            if (point[0] > north)
                north = point[0];
            if (point[0] < south)
                south = point[0];
            if (point[1] > west)
                west = point[1];
            if (point[1] < east)
                east = point[1];
        });
        return [[south, west], [north, east]];
    }
    static pathDataToLeaflet(pathData, options) {
        let path = [];
        let firstIndex = ((options === undefined) ||
            (options.from === undefined) ||
            (options.from < 0)) ? 0 : options.from;
        let lastIndex = ((options === undefined) || (options.to === undefined) || (options.to >= pathData.length)) ?
            pathData.length - 1 : options.to;
        for (let i = firstIndex; i <= lastIndex; i++) {
            path.push([pathData[i].lat, pathData[i].lon]);
        }
        return path;
    }
}
MapLib.BASE_RADIUS = 2;
MapLib.LOG = new Logger(MapLib);
