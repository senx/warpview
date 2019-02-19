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
import { DataModel } from "../model/dataModel";
import { Logger } from "./logger";
export class GTSLib {
    /**
     *
     * @param actual
     */
    static cleanArray(actual) {
        return actual.filter((i) => !!i);
    }
    /**
     * Return a Set
     * @param arr
     * @returns {any[]}
     */
    static unique(arr) {
        let u = {}, a = [];
        for (let i = 0, l = arr.length; i < l; ++i) {
            if (!u.hasOwnProperty(arr[i])) {
                a.push(arr[i]);
                u[arr[i]] = 1;
            }
        }
        return a;
    }
    /**
     * Test if value is an array
     * @param value
     * @returns {any | boolean}
     */
    static isArray(value) {
        return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number'
            && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
    }
    /**
     *
     * @param data
     * @returns {boolean}
     */
    static isValidResponse(data) {
        let response;
        try {
            response = JSON.parse(data);
        }
        catch (e) {
            this.LOG.error(['isValidResponse'], 'Response non JSON compliant', data);
            return false;
        }
        if (!GTSLib.isArray(response)) {
            this.LOG.error(['isValidResponse'], 'Response isn\'t an Array', response);
            return false;
        }
        return true;
    }
    /**
     *
     * @param item
     * @returns {boolean}
     */
    static isEmbeddedImage(item) {
        return !(typeof item !== 'string' || !/^data:image/.test(item));
    }
    /**
     *
     * @param item
     * @returns {boolean}
     */
    static isEmbeddedImageObject(item) {
        return !((item === null) || (item.image === null) ||
            (item.caption === null) || !GTSLib.isEmbeddedImage(item.image));
    }
    /**
     *
     * @param item
     * @returns {boolean}
     */
    static isPositionArray(item) {
        if (!item || !item.positions) {
            return false;
        }
        if (GTSLib.isPositionsArrayWithValues(item) || GTSLib.isPositionsArrayWithTwoValues(item)) {
            return true;
        }
        for (let i in item.positions) {
            if (item.positions[i].length < 2 || item.positions[i].length > 3) {
                return false;
            }
            for (let j in item.positions[i]) {
                if (typeof item.positions[i][j] !== 'number') {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     *
     * @param item
     * @returns {boolean}
     */
    static isPositionsArrayWithValues(item) {
        if ((item === null) || (item.positions === null)) {
            return false;
        }
        for (let i in item.positions) {
            if (item.positions[i].length !== 3) {
                return false;
            }
            for (let j in item.positions[i]) {
                if (typeof item.positions[i][j] !== 'number') {
                    return false;
                }
            }
        }
        return true;
    }
    static isPositionsArrayWithTwoValues(item) {
        if ((item === null) || (item.positions === null)) {
            return false;
        }
        for (let i in item.positions) {
            if (item.positions[i].length !== 4) {
                return false;
            }
            for (let j in item.positions[i]) {
                if (typeof item.positions[i][j] !== 'number') {
                    return false;
                }
            }
        }
        return true;
    }
    static gtsFromJSON(json, id) {
        return {
            gts: {
                c: json.c,
                l: json.l,
                a: json.a,
                v: json.v,
                id: id,
            },
        };
    }
    /**
     *
     * @param jsonList
     * @param prefixId
     * @returns {{content: any[]}}
     */
    static gtsFromJSONList(jsonList, prefixId) {
        let gtsList = [];
        let id;
        (jsonList || []).forEach((item, i) => {
            let gts = item;
            if (item.gts) {
                gts = item.gts;
            }
            if ((prefixId !== undefined) && (prefixId !== '')) {
                id = prefixId + '-' + i;
            }
            else {
                id = i;
            }
            if (GTSLib.isArray(gts)) {
                gtsList.push(GTSLib.gtsFromJSONList(gts, id));
            }
            if (GTSLib.isGts(gts)) {
                gtsList.push(GTSLib.gtsFromJSON(gts, id));
            }
            if (GTSLib.isEmbeddedImage(gts)) {
                gtsList.push({
                    image: gts,
                    caption: 'Image',
                    id: id,
                });
            }
            if (GTSLib.isEmbeddedImageObject(gts)) {
                gtsList.push({
                    image: gts.image,
                    caption: gts.caption,
                    id: id,
                });
            }
        });
        return {
            content: gtsList || [],
        };
    }
    /**
     *
     * @param {any[]} arr1
     * @returns {any[]}
     */
    static flatDeep(arr1) {
        if (!GTSLib.isArray(arr1)) {
            arr1 = [arr1];
        }
        return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(GTSLib.flatDeep(val)) : acc.concat(val), []);
    }
    ;
    /**
     *
     * @param {any[]} a
     * @param {number} r
     * @returns {{res: any[]; r: number}}
     */
    static flattenGtsIdArray(a, r) {
        const res = [];
        if (GTSLib.isGts(a)) {
            a = [a];
        }
        a.forEach(d => {
            if (GTSLib.isArray(d)) {
                const walk = GTSLib.flattenGtsIdArray(d, r);
                res.push(walk.res);
                r = walk.r;
            }
            else if (d.v) {
                d.id = r;
                res.push(d);
                r++;
            }
        });
        return { res: res, r: r };
    }
    /**
     *
     * @param gts
     * @returns {string}
     */
    static serializeGtsMetadata(gts) {
        let serializedLabels = [];
        let serializedAttributes = [];
        if (gts.l) {
            Object.keys(gts.l).forEach((key) => {
                serializedLabels.push(key + "=" + gts.l[key]);
            });
        }
        if (gts.a) {
            Object.keys(gts.a).forEach((key) => {
                serializedAttributes.push(key + "=" + gts.a[key]);
            });
        }
        return gts.c + '{' + serializedLabels.join(',') + (serializedAttributes.length > 0 ? ',' : '') + serializedAttributes.join(',') + '}';
    }
    /**
     *
     * @param gts
     * @param {number} divider
     * @returns {any[]}
     */
    static gtsToPath(gts, divider = 1000) {
        let path = [];
        // Sort values
        /* gts.v = gts.v.sort(function(a, b) {
           return a[ 0 ] - b[ 0 ];
         });*/
        for (let i = 0; i < gts.v.length; i++) {
            let metric = gts.v[i];
            if (metric.length === 2) {
                // timestamp, value
            }
            if (metric.length === 3) {
                // timestamp, elevation, value
            }
            if (metric.length === 4) {
                // timestamp, lat, lon, value
                path.push({ ts: Math.floor(metric[0] / divider), lat: metric[1], lon: metric[2], val: metric[3] });
            }
            if (metric.length === 5) {
                // timestamp, lat, lon, elevation, value
                path.push({
                    ts: Math.floor(metric[0] / divider),
                    lat: metric[1],
                    lon: metric[2],
                    elev: metric[3],
                    val: metric[4],
                });
            }
        }
        return path;
    }
    /**
     *
     * @param a
     * @param b
     * @returns {boolean}
     */
    static equalMetadata(a, b) {
        if (a.c === undefined || b.c === undefined || a.l === undefined || b.l === undefined ||
            !(a.l instanceof Object) || !(b.l instanceof Object)) {
            this.LOG.error(['equalMetadata'], 'Error in GTS, metadata is not well formed');
            return false;
        }
        if (a.c !== b.c) {
            return false;
        }
        for (let p in a.l) {
            // noinspection JSUnfilteredForInLoop
            if (!b.l.hasOwnProperty(p) || a.l[p] !== b.l[p])
                return false;
        }
        for (let p in b.l) {
            // noinspection JSUnfilteredForInLoop
            if (!a.l.hasOwnProperty(p))
                return false;
        }
        return true;
    }
    /**
     *
     * @param item
     * @returns {boolean}
     */
    static isGts(item) {
        return !(!item || item.c === null || item.l === null ||
            item.a === null || item.v === null || !GTSLib.isArray(item.v));
    }
    /**
     *
     * @param gts
     * @returns {boolean}
     */
    static isGtsToPlot(gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
        // if it's a number it's a GTS to plot
        for (let i = 0; i < gts.v.length; i++) {
            if (gts.v[i][gts.v[i].length - 1] !== null) {
                // noinspection JSPotentiallyInvalidConstructorUsage
                if (typeof (gts.v[i][gts.v[i].length - 1]) === 'number' ||
                    // gts.v[i][gts.v[i].length - 1].constructor.name === 'Big' ||
                    gts.v[i][gts.v[i].length - 1].constructor.prototype.toFixed !== undefined) {
                    return true;
                }
                break;
            }
        }
        return false;
    }
    /**
     *
     * @param gts
     * @returns {boolean}
     */
    static isGtsToAnnotate(gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
        // if it's a number it's a GTS to plot
        for (let i = 0; i < gts.v.length; i++) {
            if (gts.v[i][gts.v[i].length - 1] !== null) {
                // noinspection JSPotentiallyInvalidConstructorUsage
                if (typeof (gts.v[i][gts.v[i].length - 1]) !== 'number' &&
                    (!!gts.v[i][gts.v[i].length - 1].constructor &&
                        gts.v[i][gts.v[i].length - 1].constructor.name !== 'Big') &&
                    gts.v[i][gts.v[i].length - 1].constructor.prototype.toFixed === undefined) {
                    return true;
                }
                break;
            }
        }
        return false;
    }
    /**
     *
     * @param gts
     */
    static gtsSort(gts) {
        if (gts.isSorted) {
            return;
        }
        gts.v = gts.v.sort(function (a, b) {
            return a[0] - b[0];
        });
        gts.isSorted = true;
    }
    /**
     *
     * @param data
     * @returns {DataModel}
     */
    static getData(data) {
        if (typeof data === 'string') {
            return GTSLib.getData(JSON.parse(data));
        }
        else if (data && data.hasOwnProperty('data')) {
            return data;
        }
        else if (GTSLib.isArray(data) && data.length > 0 && data[0].data) {
            return data[0];
        }
        else if (GTSLib.isArray(data)) {
            return { data: data };
        }
        return new DataModel();
    }
    /**
     *
     * @param {string} timeUnit
     * @returns {number}
     */
    static getDivider(timeUnit) {
        let timestampdivider = 1000; //default for µs timeunit
        if (timeUnit === 'ms') {
            timestampdivider = 1;
        }
        if (timeUnit === 'ns') {
            timestampdivider = 1000000;
        }
        return timestampdivider;
    }
}
GTSLib.LOG = new Logger(GTSLib);
/**
 *
 * @param {string} data
 * @returns {string}
 */
GTSLib.formatLabel = (data) => {
    const serializedGTS = data.split('{');
    let display = `<span class="gtsInfo"><span class='gts-classname'>${serializedGTS[0]}</span>`;
    if (serializedGTS.length > 1) {
        display += `<span class='gts-separator'>{</span>`;
        const labels = serializedGTS[1].substr(0, serializedGTS[1].length - 1).split(',');
        if (labels.length > 0) {
            labels.forEach((l, i) => {
                const label = l.split('=');
                if (l.length > 1) {
                    display += `<span><span class='gts-labelname'>${label[0]}</span><span class='gts-separator'>=</span><span class='gts-labelvalue'>${label[1]}</span>`;
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
                    display += `<span><span class='gts-attrname'>${label[0]}</span><span class='gts-separator'>=</span><span class='gts-attrvalue'>${label[1]}</span>`;
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
