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

import {DataModel} from '../model/dataModel';
import {GTS} from '../model/GTS';
import {Logger} from './logger';
import moment from 'moment-timezone';

// @dynamic
export class GTSLib {
  private static LOG: Logger = new Logger(GTSLib);

  static cleanArray(actual: any[]) {
    return actual.filter((i) => !!i);
  }

  static unique(arr) {
    const u = {};
    const a = [];
    for (let i = 0, l = arr.length; i < l; ++i) {
      if (!u.hasOwnProperty(arr[i])) {
        a.push(arr[i]);
        u[arr[i]] = 1;
      }
    }
    return a;
  }

  static isArray(value) {
    return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number'
      && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
  }

  static formatElapsedTime(elapsed: number) {
    if (elapsed < 1000) {
      return elapsed.toFixed(3) + ' ns';
    }
    if (elapsed < 1000000) {
      return (elapsed / 1000).toFixed(3) + ' μs';
    }
    if (elapsed < 1000000000) {
      return (elapsed / 1000000).toFixed(3) + ' ms';
    }
    if (elapsed < 1000000000000) {
      return (elapsed / 1000000000).toFixed(3) + ' s ';
    }
    // Max exec time for nice output: 999.999 minutes (should be OK, timeout should happen before that).
    return (elapsed / 60000000000).toFixed(3) + ' m ';
  }

  static isValidResponse(data) {
    let response;
    try {
      response = JSON.parse(data);
    } catch (e) {
      this.LOG.error(['isValidResponse'], 'Response non JSON compliant', data);
      return false;
    }
    if (!GTSLib.isArray(response)) {
      this.LOG.error(['isValidResponse'], 'Response isn\'t an Array', response);
      return false;
    }
    return true;
  }

  static isEmbeddedImage(item) {
    return !(typeof item !== 'string' || !/^data:image/.test(item));
  }

  static isEmbeddedImageObject(item) {
    return !((item === null) || (item.image === null) ||
      (item.caption === null) || !GTSLib.isEmbeddedImage(item.image));
  }

  static isPositionArray(item) {
    if (!item || !item.positions) {
      return false;
    }
    if (GTSLib.isPositionsArrayWithValues(item) || GTSLib.isPositionsArrayWithTwoValues(item)) {
      return true;
    }
    (item.positions || []).forEach(p => {
      if (p.length < 2 || p.length > 3) {
        return false;
      }
      for (const j in p) {
        if (typeof p[j] !== 'number') {
          return false;
        }
      }
    });
    return true;
  }

  static isPositionsArrayWithValues(item) {
    if ((item === null) || (item.positions === null)) {
      return false;
    }
    (item.positions || []).forEach(p => {
      if (p.length !== 3) {
        return false;
      }
      for (const j in p) {
        if (typeof p[j] !== 'number') {
          return false;
        }
      }
    });
    return true;
  }

  static isPositionsArrayWithTwoValues(item) {
    if ((item === null) || (item.positions === null)) {
      return false;
    }
    (item.positions || []).forEach(p => {
      if (p.length !== 4) {
        return false;
      }
      for (const j in p) {
        if (typeof p[j] !== 'number') {
          return false;
        }
      }
    });
    return true;
  }

  static gtsFromJSON(json, id) {
    return {gts: {c: json.c, l: json.l, a: json.a, v: json.v, id}};
  }

  static gtsFromJSONList(jsonList, prefixId) {
    const gtsList = [];
    let id;
    (jsonList || []).forEach((item, i) => {
      let gts = item;
      if (item.gts) {
        gts = item.gts;
      }
      if ((prefixId !== undefined) && (prefixId !== '')) {
        id = prefixId + '-' + i;
      } else {
        id = i;
      }
      if (GTSLib.isArray(gts)) {
        gtsList.push(GTSLib.gtsFromJSONList(gts, id));
      }
      if (GTSLib.isGts(gts)) {
        gtsList.push(GTSLib.gtsFromJSON(gts, id));
      }
      if (GTSLib.isEmbeddedImage(gts)) {
        gtsList.push({image: gts, caption: 'Image', id});
      }
      if (GTSLib.isEmbeddedImageObject(gts)) {
        gtsList.push({image: gts.image, caption: gts.caption, id});
      }
    });
    return {
      content: gtsList || [],
    };
  }

  static flatDeep(arr1: any[]): any[] {
    if (!GTSLib.isArray(arr1)) {
      arr1 = [arr1];
    }
    return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(GTSLib.flatDeep(val)) : acc.concat(val), []);
  }

  static flattenGtsIdArray(a: any[], r: number): { res: any[], r: number } {
    const res = [];
    if (GTSLib.isGts(a)) {
      a = [a];
    }
    (a || []).forEach(d => {
      if (GTSLib.isArray(d)) {
        const walk = GTSLib.flattenGtsIdArray(d, r);
        res.push(walk.res);
        r = walk.r;
      } else if (d && d.v) {
        d.id = r;
        res.push(d);
        r++;
      }
    });
    return {res, r};
  }

  static sanitizeNames(input: string): string {
    return (input || '').replace(/{/g, '&#123;')
      .replace(/}/g, '&#125;')
      .replace(/,/g, '&#44;')
      .replace(/>/g, '&#62;')
      .replace(/</g, '&#60;')
      .replace(/"/g, '&#34;')
      .replace(/'/g, '&#39;');
  }

  static serializeGtsMetadata(gts) {
    const serializedLabels = [];
    const serializedAttributes = [];
    if (gts.l) {
      Object.keys(gts.l).forEach((key) => {
        serializedLabels.push(this.sanitizeNames(key + '=' + gts.l[key]));
      });
    }
    if (gts.a) {
      Object.keys(gts.a).forEach((key) => {
        serializedAttributes.push(this.sanitizeNames(key + '=' + gts.a[key]));
      });
    }
    // tslint:disable-next-line:max-line-length
    return `${this.sanitizeNames(gts.c)}{${serializedLabels.join(',')}${serializedAttributes.length > 0 ? ',' : ''}${serializedAttributes.join(',')}}`;
  }

  static isGts(item) {
    return !!item && (item.c === '' || !!item.c) && !!item.v && GTSLib.isArray(item.v);
  }

  static isGtsToPlot(gts) {
    if (!GTSLib.isGts(gts) || gts.v.length === 0) {
      return false;
    }
    // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
    // if it's a number it's a GTS to plot
    return (gts.v || []).some(v => {
      // noinspection JSPotentiallyInvalidConstructorUsage
      return typeof v[v.length - 1] === 'number' || !!v[v.length - 1].constructor.prototype.toFixed;
    });
  }

  static isGtsToPlotOnMap(gts) {
    if (!GTSLib.isGts(gts) || gts.v.length === 0) {
      return false;
    }
    // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
    // if it's a number it's a GTS to plot
    return (gts.v || []).some(v => {
      return v.length >= 3;
    });
  }

  static isSingletonGTS(gts) {
    if (!GTSLib.isGts(gts) || gts.v.length === 0) {
      return false;
    }
    return (gts.v || []).length === 1;
  }

  static isGtsToAnnotate(gts) {
    if (!GTSLib.isGts(gts) || gts.v.length === 0) {
      return false;
    }
    // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
    // if it's a number it's a GTS to plot
    return (gts.v || []).some(v => {
      if (v[v.length - 1] !== null) {
        // noinspection JSPotentiallyInvalidConstructorUsage
        return typeof (v[v.length - 1]) !== 'number' &&
          (!!v[v.length - 1].constructor && v[v.length - 1].constructor.name !== 'Big') &&
          v[v.length - 1].constructor.prototype.toFixed === undefined;
      }
    });
  }

  static gtsSort(gts) {
    if (gts.isSorted) {
      return;
    }
    gts.v = gts.v.sort((a, b) => a[0] - b[0]);
    gts.isSorted = true;
  }

  static getData(data: any): DataModel {
    if (typeof data === 'string') {
      if (data.startsWith('[') || data.startsWith('{')) {
        return GTSLib.getData(JSON.parse(data as string));
      } else {
        return {data: JSON.parse(`[${data}]`)};
      }
    } else if (data && data.hasOwnProperty('data')) {
      if (!GTSLib.isArray(data.data)) {
        data.data = [data.data];
      }
      return data as DataModel;
    } else if (GTSLib.isArray(data) && data.length > 0 && data[0].data) {
      return data[0] as DataModel;
    } else if (GTSLib.isArray(data)) {
      return {data: data as GTS[]} as DataModel;
    }
    return new DataModel();
  }

  static getDivider(timeUnit: string): number {
    let timestampDivider = 1000; // default for µs timeunit
    if (timeUnit === 'ms') {
      timestampDivider = 1;
    }
    if (timeUnit === 'ns') {
      timestampDivider = 1000000;
    }
    return timestampDivider;
  }

  static formatLabel = (data: string): string => {
    const serializedGTS = data.split('{');
    let display = `<span class="gtsInfo"><span class='gts-classname'>${serializedGTS[0]}</span>`;
    if (serializedGTS.length > 1) {
      display += `<span class='gts-separator'>{</span>`;
      const labels = serializedGTS[1].substr(0, serializedGTS[1].length - 1).split(',');
      if (labels.length > 0) {
        labels.forEach((l, i) => {
          const label = l.split('=');
          if (l.length > 1) {
            display += `<span><span class='gts-labelname'>${label[0]}</span>
<span class='gts-separator'>=</span><span class='gts-labelvalue'>${label[1]}</span>`;
            if (i !== labels.length - 1) {
              display += `<span>, </span>`;
            }
          }
        });
      }
      display += `<span class='gts-separator'>}</span>`;
    }
    if (serializedGTS.length > 2) {
      display += `<span class='gts-separator'>{</span>`;
      const labels = serializedGTS[2].substr(0, serializedGTS[2].length - 1).split(',');
      if (labels.length > 0) {
        labels.forEach((l, i) => {
          const label = l.split('=');
          if (l.length > 1) {
            display += `<span><span class='gts-attrname'>${label[0]}</span>
<span class='gts-separator'>=</span><span class='gts-attrvalue'>${label[1]}</span>`;
            if (i !== labels.length - 1) {
              display += `<span>, </span>`;
            }
          }
        });
      }
      display += `<span class='gts-separator'>}</span>`;
    }
    display += '</span>';
    return display;
  };

  static toISOString(timestamp: number, divider: number, timeZone: string) {
    if (timeZone !== 'UTC') {
      return moment.tz(timestamp / divider, timeZone).format();
    } else {
      return moment(timestamp / divider).toISOString();
    }
  }

  static toTimestamp(date: string, divider: number, timeZone: string) {
    if (timeZone !== 'UTC') {
      return moment.tz(date, timeZone).utc().valueOf() * divider;
    } else {
      return moment.utc(date).valueOf() * divider;
    }
  }
}
