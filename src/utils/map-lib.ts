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

import {GTSLib} from "./gts.lib";
import {ColorLib} from "./color-lib";
import {Logger} from "./logger";

export class MapLib {
  private static BASE_RADIUS: number = 10;
  private static LOG: Logger = new Logger(MapLib);

  /**
   *
   * @param data
   */
  static toLeafletMapPaths(data: { gts: any[]; params: any[] }) {
    let paths = [];
    for (let i = 0; i < data.gts.length; i++) {
      if (GTSLib.isGtsToPlot(data.gts[i])) {
        let sl: any = {};
        sl.path = GTSLib.gtsToPath(data.gts[i]);

        if (data.params && data.params[i] && data.params[i].key) {
          sl.key = data.params[i].key;
        } else {
          sl.key = GTSLib.serializeGtsMetadata(data.gts[i]);
        }

        if (data.params && data.params[i] && data.params[i].color) {
          sl.color = data.params[i].color;
        } else {
          sl.color = ColorLib.getColor(i);
        }
        paths.push(sl);
      }
    }
    return paths;
  }

  static annotationsToLeafletPositions(data: { gts: any[]; params: any[] }) {
    let annotations = [];
    for (let i = 0; i < data.gts.length; i++) {
      if (GTSLib.isGtsToAnnotate(data.gts[i])) {
        let annotation: any = {};
        let params = data.params[i];
        annotation.path = GTSLib.gtsToPath(data.gts[i]);
        MapLib.extractCommonParameters(annotation, params, i);

        if (params.render !== undefined) {
          annotation.render = params.render;
        }
        if (annotation.render === 'marker') {
          if (params.marker) {
            annotation.marker = params.marker;
          } else {
            annotation.marker = 'circle';
          }
        }
        if (annotation.render === 'weightedDots') {
          MapLib.validateWeightedDotsPositionArray(annotation, params);
        }
        annotations.push(annotation);
      }
    }
    return annotations;
  }

  private static extractCommonParameters(obj, params, index) {
    if (params.key !== undefined) {
      obj.key = params.key;
    }
    if (params.color !== undefined) {
      obj.color = params.color;
    } else {
      obj.color = ColorLib.getColor(index);
    }
    if (params.borderColor !== undefined) {
      obj.borderColor = params.borderColor;
    } else {
      obj.borderColor = '#000';
    }

    if (params.baseRadius === undefined || isNaN(parseInt(params.baseRadius)) || parseInt(params.baseRadius) < 0) {
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

    if (params.numSteps === undefined || isNaN(parseInt(params.numSteps)) || parseInt(params.numSteps) < 0) {
      posArray.numSteps = 5;
    } else {
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

  static toLeafletMapPositionArray(data: { gts: any[]; params: any[] }) {
    let positions = [];

    for (let i = 0; i < data.gts.length; i++) {
      if (GTSLib.isPositionArray(data.gts[i])) {
        let posArray = data.gts[i];
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
        positions.push(posArray);
      }
    }
    return positions;
  }

  private static validateWeightedColoredDotsPositionArray(posArray: any, params: any) {
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
    } else {
      posArray.numColorSteps = params.numColorSteps;
    }

    posArray.colorGradient = ColorLib.hsvGradientFromRgbColors(
      posArray.startColor,
      posArray.endColor,
      posArray.numColorSteps);

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
      if (point[0] > north) north = point[0];
      if (point[0] < south) south = point[0];
      if (point[1] > west) west = point[1];
      if (point[1] < east) east = point[1];
    });

    return [[south, west], [north, east]];

  }

  static pathDataToLeaflet(pathData, options) {
    let path = [];

    let firstIndex = ((options === undefined) ||
      (options.from === undefined) ||
      (options.from < 0) ) ? 0 : options.from;
    let lastIndex = ((options === undefined) || (options.to === undefined) || (options.to >= pathData.length) ) ?
      pathData.length - 1 : options.to;

    for (let i = firstIndex; i <= lastIndex; i++) {
      path.push([pathData[i].lat, pathData[i].lon]);
    }

    return path;
  }
}
