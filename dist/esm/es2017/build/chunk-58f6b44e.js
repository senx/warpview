import { h } from '../warpview.core.js';

class DataModel {
}

class Logger {
    constructor(className, isDebug = false) {
        this.isDebug = false;
        this.className = className.name;
        this.isDebug = isDebug;
    }
    log(level, methods, args) {
        let logChain = [];
        logChain.push(`[${this.className}] ${methods.join(' - ')}`);
        logChain = logChain.concat(args);
        switch (level) {
            case LEVEL.DEBUG: {
                if (this.isDebug) {
                    console.debug(...logChain);
                }
                break;
            }
            case LEVEL.ERROR: {
                console.error(...logChain);
                break;
            }
            case LEVEL.INFO: {
                console.log(...logChain);
                break;
            }
            case LEVEL.WARN: {
                console.warn(...logChain);
                break;
            }
            default: {
                if (this.isDebug) {
                    console.log(...logChain);
                }
            }
        }
    }
    debug(methods, ...args) {
        this.log(LEVEL.DEBUG, methods, args);
    }
    error(methods, ...args) {
        this.log(LEVEL.ERROR, methods, args);
    }
    warn(methods, ...args) {
        this.log(LEVEL.WARN, methods, args);
    }
    info(methods, ...args) {
        this.log(LEVEL.INFO, methods, args);
    }
}
var LEVEL;
(function (LEVEL) {
    LEVEL[LEVEL["DEBUG"] = 0] = "DEBUG";
    LEVEL[LEVEL["ERROR"] = 1] = "ERROR";
    LEVEL[LEVEL["WARN"] = 2] = "WARN";
    LEVEL[LEVEL["INFO"] = 3] = "INFO";
})(LEVEL || (LEVEL = {}));

class GTSLib {
    static cleanArray(actual) {
        return actual.filter((i) => !!i);
    }
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
    static flatDeep(arr1) {
        if (!GTSLib.isArray(arr1)) {
            arr1 = [arr1];
        }
        return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(GTSLib.flatDeep(val)) : acc.concat(val), []);
    }
    ;
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
    static sanitizeNames(input) {
        return input.replace(/{/g, '&#123;')
            .replace(/}/g, '&#125;')
            .replace(/,/g, '&#44;')
            .replace(/>/g, '&#62;')
            .replace(/</g, '&#60;')
            .replace(/"/g, '&#34;')
            .replace(/'/g, '&#39;');
    }
    static serializeGtsMetadata(gts) {
        let serializedLabels = [];
        let serializedAttributes = [];
        if (gts.l) {
            Object.keys(gts.l).forEach((key) => {
                serializedLabels.push(this.sanitizeNames(key + "=" + gts.l[key]));
            });
        }
        if (gts.a) {
            Object.keys(gts.a).forEach((key) => {
                serializedAttributes.push(this.sanitizeNames(key + "=" + gts.a[key]));
            });
        }
        return this.sanitizeNames(gts.c) + '{' + serializedLabels.join(',') + (serializedAttributes.length > 0 ? ',' : '') + serializedAttributes.join(',') + '}';
    }
    static gtsToPath(gts, divider = 1000) {
        let path = [];
        for (let i = 0; i < gts.v.length; i++) {
            let metric = gts.v[i];
            if (metric.length === 2) ;
            if (metric.length === 3) ;
            if (metric.length === 4) {
                path.push({ ts: Math.floor(metric[0] / divider), lat: metric[1], lon: metric[2], val: metric[3] });
            }
            if (metric.length === 5) {
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
            if (!b.l.hasOwnProperty(p) || a.l[p] !== b.l[p])
                return false;
        }
        for (let p in b.l) {
            if (!a.l.hasOwnProperty(p))
                return false;
        }
        return true;
    }
    static isGts(item) {
        return !(!item || item.c === null || item.l === null ||
            item.a === null || item.v === null || !GTSLib.isArray(item.v));
    }
    static isGtsToPlot(gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        for (let i = 0; i < gts.v.length; i++) {
            if (gts.v[i][gts.v[i].length - 1] !== null) {
                if (typeof (gts.v[i][gts.v[i].length - 1]) === 'number' ||
                    gts.v[i][gts.v[i].length - 1].constructor.prototype.toFixed !== undefined) {
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
    static getDivider(timeUnit) {
        let timestampdivider = 1000;
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

export { GTSLib as a, Logger as b, DataModel as c };
