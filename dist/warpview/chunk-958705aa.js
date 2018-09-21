/*! Built with http://stenciljs.com */
const { h } = window.warpview;

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
class DataModel {
}

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
class GTSLib {
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
    static isValidResponse(data) {
        let response;
        try {
            response = JSON.parse(data);
        }
        catch (e) {
            console.error('Response non JSON compliant', data);
            return false;
        }
        if (!GTSLib.isArray(response)) {
            console.error('Response isn\'t an Array', response);
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
    static metricFromJSON(json) {
        let metric = {
            ts: json[0],
            value: undefined,
            alt: undefined,
            lon: undefined,
            lat: undefined
        };
        switch (json.length) {
            case 2:
                metric.value = json[1];
                break;
            case 3:
                metric.alt = json[1];
                metric.value = json[2];
                break;
            case 4:
                metric.lat = json[1];
                metric.lon = json[2];
                metric.value = json[3];
                break;
            case 5:
                metric.lat = json[1];
                metric.lon = json[2];
                metric.alt = json[3];
                metric.value = json[4];
        }
        return metric;
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
     * @param arr1
     * @returns {any}
     */
    static flatDeep(arr1) {
        return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(GTSLib.flatDeep(val)) : acc.concat(val), []);
    }
    ;
    /**
     *
     * @param a
     * @param r
     * @returns {any}
     */
    static flattenGtsIdArray(a, r) {
        let elem;
        let j;
        if (!r) {
            r = [];
        }
        for (j = 0; j < a.content.length; j++) {
            elem = a.content[j];
            if (elem.content) {
                GTSLib.flattenGtsIdArray(elem, r);
            }
            else {
                if (elem.gts) {
                    r.push(elem.gts);
                }
            }
        }
        return r;
    }
    static serializeGtsMetadata(gts) {
        let serializedLabels = [];
        Object.keys(gts.l).forEach((key) => {
            serializedLabels.push(key + "=" + gts.l[key]);
        });
        let serializedAttributes = [];
        Object.keys(gts.a).forEach((key) => {
            serializedAttributes.push(key + "=" + gts.a[key]);
        });
        return gts.c + '{' + serializedLabels.join(',') + (serializedAttributes.length > 0 ? ',' : '') + serializedAttributes.join(',') + '}';
    }
    static gtsToPath(gts) {
        let path = [];
        // Sort values
        gts.v = gts.v.sort(function (a, b) {
            return a[0] - b[0];
        });
        for (let i = 0; i < gts.v.length; i++) {
            let metric = gts.v[i];
            if (metric.length === 2) ;
            if (metric.length === 3) ;
            if (metric.length === 4) {
                // timestamp, lat, lon, value
                path.push({ ts: Math.floor(metric[0] / 1000), lat: metric[1], lon: metric[2], val: metric[3] });
            }
            if (metric.length === 5) {
                // timestamp, lat, lon, elevation, value
                path.push({
                    ts: Math.floor(metric[0] / 1000),
                    lat: metric[1],
                    lon: metric[2],
                    elev: metric[3],
                    val: metric[4],
                });
            }
        }
        return path;
    }
    static equalMetadata(a, b) {
        if (a.c === undefined || b.c === undefined || a.l === undefined || b.l === undefined ||
            !(a.l instanceof Object) || !(b.l instanceof Object)) {
            console.error('[warp10-gts-tools] equalMetadata - Error in GTS, metadata is not well formed');
            return false;
        }
        if (a.c !== b.c) {
            return false;
        }
        for (let p in a.l) {
            if (!b.l.hasOwnProperty(p))
                return false;
            if (a.l[p] !== b.l[p])
                return false;
        }
        for (let p in b.l) {
            if (!a.l.hasOwnProperty(p))
                return false;
        }
        return true;
    }
    static isGts(item) {
        return !(!item || item === null || item.c === null || item.l === null ||
            item.a === null || item.v === null || !GTSLib.isArray(item.v));
    }
    static isGtsToPlot(gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
        // if it's a number it's a GTS to plot
        for (let i = 0; i < gts.v.length; i++) {
            if (gts.v[i][gts.v[i].length - 1] !== null) {
                // console.log("[warp10-gts-tools] isGtsToPlot - First value type", gts.v[i][gts.v[i].length - 1] );
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
    static isBooleanGts(gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        // We look at the first non-null value, if it's a Boolean it's a boolean GTS,
        // if it's a number it's a GTS to plot
        for (let i = 0; i < gts.v.length; i++) {
            if (gts.v[i][gts.v[i].length - 1] !== null) {
                if (typeof (gts.v[i][gts.v[i].length - 1]) !== 'boolean') {
                    return true;
                }
                break;
            }
        }
        return false;
    }
    static isGtsToAnnotate(gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
        // if it's a number it's a GTS to plot
        for (let i = 0; i < gts.v.length; i++) {
            if (gts.v[i][gts.v[i].length - 1] !== null) {
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
    static gtsSort(gts) {
        if (gts.isSorted) {
            return;
        }
        gts.v = gts.v.sort(function (a, b) {
            return a[0] - b[0];
        });
        gts.isSorted = true;
    }
    static gtsTimeRange(gts) {
        GTSLib.gtsSort(gts);
        if (gts.v.length === 0) {
            return null;
        }
        return [gts.v[0][0], gts.v[gts.v.length - 1][0]];
    }
    /**
     *
     * @param data
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
}

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
class ColorLib {
    /**
     * Get a color from index
     * @param i
     * @returns {string}
     */
    static getColor(i) {
        return ColorLib.color[i % ColorLib.color.length];
    }
    /**
     * Convert hex to RGB
     * @param hex
     * @returns {number[]}
     */
    static hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }
    /**
     * Add an alpha channel
     * @param color
     * @param {number} alpha
     * @returns {string}
     */
    static transparentize(color, alpha) {
        return 'rgba(' + ColorLib.hexToRgb(color).concat(alpha).join(',') + ')';
    }
    /**
     *
     * @param num
     */
    static generateColors(num) {
        let color = [];
        for (let i = 0; i < num; i++) {
            color.push(ColorLib.getColor(i));
        }
        return color;
    }
    /**
     *
     * @param num
     */
    static generateTransparentColors(num) {
        let color = [];
        for (let i = 0; i < num; i++) {
            color.push(ColorLib.transparentize(ColorLib.getColor(i), 0.5));
        }
        return color;
    }
    static hsvGradientFromRgbColors(c1, c2, steps) {
        let c1hsv = ColorLib.rgb2hsv(c1.r, c1.g, c1.b);
        let c2hsv = ColorLib.rgb2hsv(c2.r, c2.g, c2.b);
        c1.h = c1hsv[0];
        c1.s = c1hsv[1];
        c1.v = c1hsv[2];
        c2.h = c2hsv[0];
        c2.s = c2hsv[1];
        c2.v = c2hsv[2];
        let gradient = ColorLib.hsvGradient(c1, c2, steps);
        for (let i in gradient) {
            if (gradient[i]) {
                gradient[i].rgb = ColorLib.hsv2rgb(gradient[i].h, gradient[i].s, gradient[i].v);
                gradient[i].r = Math.floor(gradient[i].rgb[0]);
                gradient[i].g = Math.floor(gradient[i].rgb[1]);
                gradient[i].b = Math.floor(gradient[i].rgb[2]);
            }
        }
        return gradient;
    }
    static rgb2hsv(r, g, b) {
        // Normalize
        let normR = r / 255.0;
        let normG = g / 255.0;
        let normB = b / 255.0;
        let M = Math.max(normR, normG, normB);
        let m = Math.min(normR, normG, normB);
        let d = M - m;
        let h;
        let s;
        let v;
        v = M;
        if (d === 0) {
            h = 0;
            s = 0;
        }
        else {
            s = d / v;
            switch (M) {
                case normR:
                    h = ((normG - normB) + d * (normG < normB ? 6 : 0)) / 6 * d;
                    break;
                case normG:
                    h = ((normB - normR) + d * 2) / 6 * d;
                    break;
                case normB:
                    h = ((normR - normG) + d * 4) / 6 * d;
                    break;
            }
        }
        return [h, s, v];
    }
    static hsvGradient(c1, c2, steps) {
        let gradient = new Array(steps);
        // determine clockwise and counter-clockwise distance between hues
        let distCCW = (c1.h >= c2.h) ? c1.h - c2.h : 1 + c1.h - c2.h;
        let distCW = (c1.h >= c2.h) ? 1 + c2.h - c1.h : c2.h - c1.h;
        // make gradient for this part
        for (let i = 0; i < steps; i++) {
            // interpolate h, s, b
            let h = (distCW <= distCCW) ? c1.h + (distCW * i / (steps - 1)) : c1.h - (distCCW * i / (steps - 1));
            if (h < 0) {
                h = 1 + h;
            }
            if (h > 1) {
                h = h - 1;
            }
            let s = (1 - i / (steps - 1)) * c1.s + i / (steps - 1) * c2.s;
            let v = (1 - i / (steps - 1)) * c1.v + i / (steps - 1) * c2.v;
            // add to gradient array
            gradient[i] = { h: h, s: s, v: v };
        }
        return gradient;
    }
    static hsv2rgb(h, s, v) {
        let r;
        let g;
        let b;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        return [r * 255, g * 255, b * 255];
    }
    static rgb2hex(r, g, b) {
        function componentToHex(c) {
            let hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
}
ColorLib.color = [
    '#5899DA',
    '#E8743B',
    '#19A979',
    '#ED4A7B',
    '#945ECF',
    '#13A4B4',
    '#525DF4',
    '#BF399E',
    '#6C8893',
    '#EE6868',
    '#2F6497'
];

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
class Logger {
    /**
     *
     * @param className
     */
    constructor(className) {
        this.className = className.name;
    }
    /**
     *
     * @param {string[]} message message
     * @param {LEVEL} level level
     * @param {string[]} methods methods
     */
    log(level, methods, message) {
        const display = `[${this.className}] ${methods.join(' - ')}`;
        switch (level) {
            case LEVEL.DEBUG: {
                console.debug(display, message);
                break;
            }
            case LEVEL.ERROR: {
                console.error(display, message);
                break;
            }
            case LEVEL.INFO: {
                console.log(display, message);
                break;
            }
            case LEVEL.WARN: {
                console.warn(display, message);
                break;
            }
            default: {
                console.log(display, message);
            }
        }
    }
    /**
     *
     * @param message
     * @param methods
     */
    debug(methods, message) {
        this.log(LEVEL.DEBUG, methods, message);
    }
    /**
     *
     * @param message
     * @param methods
     */
    error(methods, message) {
        this.log(LEVEL.ERROR, methods, message);
    }
    /**
     *
     * @param message
     * @param methods
     */
    warn(methods, message) {
        this.log(LEVEL.WARN, methods, message);
    }
    /**
     *
     * @param message
     * @param methods
     */
    info(methods, message) {
        this.log(LEVEL.INFO, methods, message);
    }
}
/**
 *
 */
var LEVEL;
(function (LEVEL) {
    LEVEL[LEVEL["DEBUG"] = 0] = "DEBUG";
    LEVEL[LEVEL["ERROR"] = 1] = "ERROR";
    LEVEL[LEVEL["WARN"] = 2] = "WARN";
    LEVEL[LEVEL["INFO"] = 3] = "INFO";
})(LEVEL || (LEVEL = {}));

export { GTSLib as a, ColorLib as b, Logger as c, DataModel as d };
