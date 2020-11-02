(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('moment-timezone'), require('deep-equal'), require('rxjs'), require('rxjs/operators'), require('rxjs/internal/observable/of'), require('@angular/common/http'), require('fitty'), require('moment'), require('d3'), require('d3-selection'), require('leaflet'), require('leaflet.heat'), require('leaflet.markercluster'), require('leaflet-ant-path'), require('nouislider'), require('@angular/forms'), require('angular-resize-event'), require('plotly.js-dist'), require('event-drops')) :
    typeof define === 'function' && define.amd ? define('warpview', ['exports', '@angular/core', '@angular/common', 'moment-timezone', 'deep-equal', 'rxjs', 'rxjs/operators', 'rxjs/internal/observable/of', '@angular/common/http', 'fitty', 'moment', 'd3', 'd3-selection', 'leaflet', 'leaflet.heat', 'leaflet.markercluster', 'leaflet-ant-path', 'nouislider', '@angular/forms', 'angular-resize-event', 'plotly.js-dist', 'event-drops'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.warpview = {}, global.ng.core, global.ng.common, global.moment, global.deepEqual, global.rxjs, global.rxjs.operators, global.rxjs['internal/observable/of'], global.ng.common.http, global.fitty, global.moment$1, global.d3, global.d3Selection, global.Leaflet, null, null, global.leafletAntPath, global.noUiSlider, global.ng.forms, global.angularResizeEvent, global.Plotlyjs, global.eventDrops));
}(this, (function (exports, i0, common, moment, deepEqual, rxjs, operators, of, i1, fitty, moment$1, d3, d3Selection, Leaflet, leaflet_heat, leaflet_markercluster, leafletAntPath, noUiSlider, forms, angularResizeEvent, Plotlyjs, eventDrops) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);
    var deepEqual__default = /*#__PURE__*/_interopDefaultLegacy(deepEqual);
    var fitty__default = /*#__PURE__*/_interopDefaultLegacy(fitty);
    var moment__default$1 = /*#__PURE__*/_interopDefaultLegacy(moment$1);
    var d3__namespace = /*#__PURE__*/_interopNamespace(d3);
    var Leaflet__default = /*#__PURE__*/_interopDefaultLegacy(Leaflet);
    var eventDrops__default = /*#__PURE__*/_interopDefaultLegacy(eventDrops);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

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
    var DataModel = /** @class */ (function () {
        function DataModel() {
        }
        return DataModel;
    }());

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
    /* tslint:disable:no-console */
    var Logger = /** @class */ (function () {
        function Logger(className, isDebug) {
            if (isDebug === void 0) { isDebug = false; }
            this.isDebug = false;
            this.className = className.name;
            this.isDebug = isDebug;
        }
        Logger.prototype.setDebug = function (debug) {
            this.isDebug = debug;
        };
        Logger.prototype.log = function (level, methods, args) {
            var logChain = [];
            logChain.push("[" + new Date().toISOString() + " - [" + this.className + "] " + methods.join(' - '));
            logChain = logChain.concat(args);
            switch (level) {
                case LEVEL.DEBUG: {
                    if (this.isDebug) {
                        console.debug.apply(console, __spread(logChain));
                    }
                    break;
                }
                case LEVEL.ERROR: {
                    console.error.apply(console, __spread(logChain));
                    break;
                }
                case LEVEL.INFO: {
                    console.log.apply(console, __spread(logChain));
                    break;
                }
                case LEVEL.WARN: {
                    console.warn.apply(console, __spread(logChain));
                    break;
                }
                default: {
                    if (this.isDebug) {
                        console.log.apply(console, __spread(logChain));
                    }
                }
            }
        };
        Logger.prototype.debug = function (methods) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.log(LEVEL.DEBUG, methods, args);
        };
        Logger.prototype.error = function (methods) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.log(LEVEL.ERROR, methods, args);
        };
        Logger.prototype.warn = function (methods) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.log(LEVEL.WARN, methods, args);
        };
        Logger.prototype.info = function (methods) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.log(LEVEL.INFO, methods, args);
        };
        return Logger;
    }());
    var LEVEL;
    (function (LEVEL) {
        LEVEL[LEVEL["DEBUG"] = 0] = "DEBUG";
        LEVEL[LEVEL["ERROR"] = 1] = "ERROR";
        LEVEL[LEVEL["WARN"] = 2] = "WARN";
        LEVEL[LEVEL["INFO"] = 3] = "INFO";
    })(LEVEL || (LEVEL = {}));

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
    // @dynamic
    var GTSLib = /** @class */ (function () {
        function GTSLib() {
        }
        GTSLib.cleanArray = function (actual) {
            return actual.filter(function (i) { return !!i; });
        };
        GTSLib.unique = function (arr) {
            var u = {};
            var a = [];
            for (var i = 0, l = arr.length; i < l; ++i) {
                if (!u.hasOwnProperty(arr[i])) {
                    a.push(arr[i]);
                    u[arr[i]] = 1;
                }
            }
            return a;
        };
        GTSLib.isArray = function (value) {
            return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number'
                && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
        };
        GTSLib.formatElapsedTime = function (elapsed) {
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
        };
        GTSLib.isValidResponse = function (data) {
            var response;
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
        };
        GTSLib.isEmbeddedImage = function (item) {
            return !(typeof item !== 'string' || !/^data:image/.test(item));
        };
        GTSLib.isEmbeddedImageObject = function (item) {
            return !((item === null) || (item.image === null) ||
                (item.caption === null) || !GTSLib.isEmbeddedImage(item.image));
        };
        GTSLib.isPositionArray = function (item) {
            if (!item || !item.positions) {
                return false;
            }
            if (GTSLib.isPositionsArrayWithValues(item) || GTSLib.isPositionsArrayWithTwoValues(item)) {
                return true;
            }
            (item.positions || []).forEach(function (p) {
                if (p.length < 2 || p.length > 3) {
                    return false;
                }
                for (var j in p) {
                    if (typeof p[j] !== 'number') {
                        return false;
                    }
                }
            });
            return true;
        };
        GTSLib.isPositionsArrayWithValues = function (item) {
            if ((item === null) || (item.positions === null)) {
                return false;
            }
            (item.positions || []).forEach(function (p) {
                if (p.length !== 3) {
                    return false;
                }
                for (var j in p) {
                    if (typeof p[j] !== 'number') {
                        return false;
                    }
                }
            });
            return true;
        };
        GTSLib.isPositionsArrayWithTwoValues = function (item) {
            if ((item === null) || (item.positions === null)) {
                return false;
            }
            (item.positions || []).forEach(function (p) {
                if (p.length !== 4) {
                    return false;
                }
                for (var j in p) {
                    if (typeof p[j] !== 'number') {
                        return false;
                    }
                }
            });
            return true;
        };
        GTSLib.gtsFromJSON = function (json, id) {
            return { gts: { c: json.c, l: json.l, a: json.a, v: json.v, id: id } };
        };
        GTSLib.gtsFromJSONList = function (jsonList, prefixId) {
            var gtsList = [];
            var id;
            (jsonList || []).forEach(function (item, i) {
                var gts = item;
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
                    gtsList.push({ image: gts, caption: 'Image', id: id });
                }
                if (GTSLib.isEmbeddedImageObject(gts)) {
                    gtsList.push({ image: gts.image, caption: gts.caption, id: id });
                }
            });
            return {
                content: gtsList || [],
            };
        };
        GTSLib.flatDeep = function (arr1) {
            if (!GTSLib.isArray(arr1)) {
                arr1 = [arr1];
            }
            return arr1.reduce(function (acc, val) { return Array.isArray(val) ? acc.concat(GTSLib.flatDeep(val)) : acc.concat(val); }, []);
        };
        GTSLib.flattenGtsIdArray = function (a, r) {
            var res = [];
            if (GTSLib.isGts(a)) {
                a = [a];
            }
            (a || []).forEach(function (d) {
                if (GTSLib.isArray(d)) {
                    var walk = GTSLib.flattenGtsIdArray(d, r);
                    res.push(walk.res);
                    r = walk.r;
                }
                else if (d && d.v) {
                    d.id = r;
                    res.push(d);
                    r++;
                }
            });
            return { res: res, r: r };
        };
        GTSLib.sanitizeNames = function (input) {
            return (input || '').replace(/{/g, '&#123;')
                .replace(/}/g, '&#125;')
                .replace(/,/g, '&#44;')
                .replace(/>/g, '&#62;')
                .replace(/</g, '&#60;')
                .replace(/"/g, '&#34;')
                .replace(/'/g, '&#39;');
        };
        GTSLib.serializeGtsMetadata = function (gts) {
            var _this = this;
            var serializedLabels = [];
            var serializedAttributes = [];
            if (gts.l) {
                Object.keys(gts.l).forEach(function (key) {
                    serializedLabels.push(_this.sanitizeNames(key + '=' + gts.l[key]));
                });
            }
            if (gts.a) {
                Object.keys(gts.a).forEach(function (key) {
                    serializedAttributes.push(_this.sanitizeNames(key + '=' + gts.a[key]));
                });
            }
            // tslint:disable-next-line:max-line-length
            return this.sanitizeNames(gts.c) + "{" + serializedLabels.join(',') + (serializedAttributes.length > 0 ? ',' : '') + serializedAttributes.join(',') + "}";
        };
        GTSLib.isGts = function (item) {
            return !!item && (item.c === '' || !!item.c) && !!item.v && GTSLib.isArray(item.v);
        };
        GTSLib.isGtsToPlot = function (gts) {
            if (!GTSLib.isGts(gts) || gts.v.length === 0) {
                return false;
            }
            // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
            // if it's a number it's a GTS to plot
            return (gts.v || []).some(function (v) {
                // noinspection JSPotentiallyInvalidConstructorUsage
                return typeof v[v.length - 1] === 'number' || !!v[v.length - 1].constructor.prototype.toFixed;
            });
        };
        GTSLib.isGtsToPlotOnMap = function (gts) {
            if (!GTSLib.isGts(gts) || gts.v.length === 0) {
                return false;
            }
            // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
            // if it's a number it's a GTS to plot
            return (gts.v || []).some(function (v) {
                return v.length >= 3;
            });
        };
        GTSLib.isSingletonGTS = function (gts) {
            if (!GTSLib.isGts(gts) || gts.v.length === 0) {
                return false;
            }
            return (gts.v || []).length === 1;
        };
        GTSLib.isGtsToAnnotate = function (gts) {
            if (!GTSLib.isGts(gts) || gts.v.length === 0) {
                return false;
            }
            // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
            // if it's a number it's a GTS to plot
            return (gts.v || []).some(function (v) {
                if (v[v.length - 1] !== null) {
                    // noinspection JSPotentiallyInvalidConstructorUsage
                    return typeof (v[v.length - 1]) !== 'number' &&
                        (!!v[v.length - 1].constructor && v[v.length - 1].constructor.name !== 'Big') &&
                        v[v.length - 1].constructor.prototype.toFixed === undefined;
                }
            });
        };
        GTSLib.gtsSort = function (gts) {
            if (gts.isSorted) {
                return;
            }
            gts.v = gts.v.sort(function (a, b) { return a[0] - b[0]; });
            gts.isSorted = true;
        };
        GTSLib.getData = function (data) {
            if (typeof data === 'string') {
                return GTSLib.getData(JSON.parse(data));
            }
            else if (data && data.hasOwnProperty('data')) {
                if (!GTSLib.isArray(data.data)) {
                    data.data = [data.data];
                }
                return data;
            }
            else if (GTSLib.isArray(data) && data.length > 0 && data[0].data) {
                return data[0];
            }
            else if (GTSLib.isArray(data)) {
                return { data: data };
            }
            return new DataModel();
        };
        GTSLib.getDivider = function (timeUnit) {
            var timestampDivider = 1000; // default for µs timeunit
            if (timeUnit === 'ms') {
                timestampDivider = 1;
            }
            if (timeUnit === 'ns') {
                timestampDivider = 1000000;
            }
            return timestampDivider;
        };
        GTSLib.toISOString = function (timestamp, divider, timeZone) {
            if (timeZone !== 'UTC') {
                return moment__default['default'].tz(timestamp / divider, timeZone).format();
            }
            else {
                return moment__default['default'](timestamp / divider).toISOString();
            }
        };
        return GTSLib;
    }());
    GTSLib.LOG = new Logger(GTSLib);
    GTSLib.formatLabel = function (data) {
        var serializedGTS = data.split('{');
        var display = "<span class=\"gtsInfo\"><span class='gts-classname'>" + serializedGTS[0] + "</span>";
        if (serializedGTS.length > 1) {
            display += "<span class='gts-separator'>{</span>";
            var labels_1 = serializedGTS[1].substr(0, serializedGTS[1].length - 1).split(',');
            if (labels_1.length > 0) {
                labels_1.forEach(function (l, i) {
                    var label = l.split('=');
                    if (l.length > 1) {
                        display += "<span><span class='gts-labelname'>" + label[0] + "</span>\n<span class='gts-separator'>=</span><span class='gts-labelvalue'>" + label[1] + "</span>";
                        if (i !== labels_1.length - 1) {
                            display += "<span>, </span>";
                        }
                    }
                });
            }
            display += "<span class='gts-separator'>}</span>";
        }
        if (serializedGTS.length > 2) {
            display += "<span class='gts-separator'>{</span>";
            var labels_2 = serializedGTS[2].substr(0, serializedGTS[2].length - 1).split(',');
            if (labels_2.length > 0) {
                labels_2.forEach(function (l, i) {
                    var label = l.split('=');
                    if (l.length > 1) {
                        display += "<span><span class='gts-attrname'>" + label[0] + "</span>\n<span class='gts-separator'>=</span><span class='gts-attrvalue'>" + label[1] + "</span>";
                        if (i !== labels_2.length - 1) {
                            display += "<span>, </span>";
                        }
                    }
                });
            }
            display += "<span class='gts-separator'>}</span>";
        }
        display += '</span>';
        return display;
    };

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
    var ChartBounds = /** @class */ (function () {
        function ChartBounds() {
            this.tsmin = 0;
            this.tsmax = 0;
            this.msmin = '';
            this.msmax = '';
            this.marginLeft = 0;
        }
        return ChartBounds;
    }());

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
    // @dynamic
    var ColorLib = /** @class */ (function () {
        function ColorLib() {
        }
        ColorLib.getColor = function (i, scheme) {
            return ColorLib.color[scheme][i % ColorLib.color[scheme].length];
        };
        ColorLib.getColorGradient = function (id, scheme) {
            return [
                [0, ColorLib.transparentize(ColorLib.getColor(id, scheme), 0)],
                [1, ColorLib.transparentize(ColorLib.getColor(id, scheme), 0.7)]
            ];
        };
        ColorLib.getBlendedColorGradient = function (id, scheme, bg) {
            if (bg === void 0) { bg = '#000000'; }
            return [
                [0, ColorLib.blend_colors(bg, ColorLib.getColor(id, scheme), 0)],
                [1, ColorLib.blend_colors(bg, ColorLib.getColor(id, scheme), 1)]
            ];
        };
        ColorLib.getColorScale = function (scheme) {
            return ColorLib.color[scheme].map(function (c, i) { return [i, c]; });
        };
        ColorLib.hexToRgb = function (hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ] : null;
        };
        ColorLib.transparentize = function (color, alpha) {
            if (alpha === void 0) { alpha = 0.5; }
            return 'rgba(' + ColorLib.hexToRgb(color).concat(alpha).join(',') + ')';
        };
        ColorLib.generateColors = function (num, scheme) {
            var color = [];
            for (var i = 0; i < num; i++) {
                color.push(ColorLib.getColor(i, scheme));
            }
            return color;
        };
        ColorLib.generateTransparentColors = function (num, scheme) {
            var color = [];
            for (var i = 0; i < num; i++) {
                color.push(ColorLib.transparentize(ColorLib.getColor(i, scheme)));
            }
            return color;
        };
        ColorLib.hsvGradientFromRgbColors = function (c1, c2, steps) {
            var c1hsv = ColorLib.rgb2hsv(c1.r, c1.g, c1.b);
            var c2hsv = ColorLib.rgb2hsv(c2.r, c2.g, c2.b);
            c1.h = c1hsv[0];
            c1.s = c1hsv[1];
            c1.v = c1hsv[2];
            c2.h = c2hsv[0];
            c2.s = c2hsv[1];
            c2.v = c2hsv[2];
            var gradient = ColorLib.hsvGradient(c1, c2, steps);
            for (var i in gradient) {
                if (gradient[i]) {
                    gradient[i].rgb = ColorLib.hsv2rgb(gradient[i].h, gradient[i].s, gradient[i].v);
                    gradient[i].r = Math.floor(gradient[i].rgb[0]);
                    gradient[i].g = Math.floor(gradient[i].rgb[1]);
                    gradient[i].b = Math.floor(gradient[i].rgb[2]);
                }
            }
            return gradient;
        };
        ColorLib.rgb2hsv = function (r, g, b) {
            // Normalize
            var normR = r / 255.0;
            var normG = g / 255.0;
            var normB = b / 255.0;
            var M = Math.max(normR, normG, normB);
            var m = Math.min(normR, normG, normB);
            var d = M - m;
            var h;
            var s;
            var v;
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
        };
        ColorLib.hsvGradient = function (c1, c2, steps) {
            var gradient = new Array(steps);
            // determine clockwise and counter-clockwise distance between hues
            var distCCW = (c1.h >= c2.h) ? c1.h - c2.h : 1 + c1.h - c2.h;
            var distCW = (c1.h >= c2.h) ? 1 + c2.h - c1.h : c2.h - c1.h;
            // make gradient for this part
            for (var i = 0; i < steps; i++) {
                // interpolate h, s, b
                var h = (distCW <= distCCW) ? c1.h + (distCW * i / (steps - 1)) : c1.h - (distCCW * i / (steps - 1));
                if (h < 0) {
                    h = 1 + h;
                }
                if (h > 1) {
                    h = h - 1;
                }
                var s = (1 - i / (steps - 1)) * c1.s + i / (steps - 1) * c2.s;
                var v = (1 - i / (steps - 1)) * c1.v + i / (steps - 1) * c2.v;
                // add to gradient array
                gradient[i] = { h: h, s: s, v: v };
            }
            return gradient;
        };
        ColorLib.hsv2rgb = function (h, s, v) {
            var r;
            var g;
            var b;
            var i = Math.floor(h * 6);
            var f = h * 6 - i;
            var p = v * (1 - s);
            var q = v * (1 - f * s);
            var t = v * (1 - (1 - f) * s);
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
        };
        ColorLib.rgb2hex = function (r, g, b) {
            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }
            return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
        };
        ColorLib.blend_colors = function (color1, color2, percentage) {
            // check input
            color1 = color1 || '#000000';
            color2 = color2 || '#ffffff';
            percentage = percentage || 0.5;
            // 1: validate input, make sure we have provided a valid hex
            if (color1.length !== 4 && color1.length !== 7) {
                throw new Error('colors must be provided as hexes');
            }
            if (color2.length !== 4 && color2.length !== 7) {
                throw new Error('colors must be provided as hexes');
            }
            if (percentage > 1 || percentage < 0) {
                throw new Error('percentage must be between 0 and 1');
            }
            // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
            //      the three character hex is just a representation of the 6 hex where each character is repeated
            //      ie: #060 => #006600 (green)
            if (color1.length === 4) {
                color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
            }
            else {
                color1 = color1.substring(1);
            }
            if (color2.length === 4) {
                color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
            }
            else {
                color2 = color2.substring(1);
            }
            console.log('valid: c1 => ' + color1 + ', c2 => ' + color2);
            // 3: we have valid input, convert colors to rgb
            color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
            color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];
            console.log('hex -> rgba: c1 => [' + color1.join(', ') + '], c2 => [' + color2.join(', ') + ']');
            // 4: blend
            var color3 = [
                (1 - percentage) * color1[0] + percentage * color2[0],
                (1 - percentage) * color1[1] + percentage * color2[1],
                (1 - percentage) * color1[2] + percentage * color2[2]
            ];
            var color3Str = '#' + ColorLib.int_to_hex(color3[0]) + ColorLib.int_to_hex(color3[1]) + ColorLib.int_to_hex(color3[2]);
            console.log(color3Str);
            // return hex
            return color3Str;
        };
        /*
            convert a Number to a two character hex string
            must round, or we will end up with more digits than expected (2)
            note: can also result in single digit, which will need to be padded with a 0 to the left
            @param: num         => the number to conver to hex
            @returns: string    => the hex representation of the provided number
        */
        ColorLib.int_to_hex = function (num) {
            var hex = Math.round(num).toString(16);
            if (hex.length === 1) {
                hex = '0' + hex;
            }
            return hex;
        };
        return ColorLib;
    }());
    ColorLib.color = {
        COHESIVE: [
            '#F2D354',
            '#E4612F',
            '#D32C2E',
            '#6D2627',
            '#6C7F55',
            '#934FC6',
            '#F07A5D',
            '#ED8371',
            '#94E751',
            '#C457F7',
            '#973AF7',
            '#B6FF7A',
            '#C7FFD5',
            '#90E4D0',
            '#E09234',
            '#D2FF91',
            '#17B201'
        ],
        COHESIVE_2: [
            '#6F694E',
            '#65D0B2',
            '#D8F546',
            '#FF724B',
            '#D6523E',
            '#F9F470',
            '#F4BC78',
            '#B1D637',
            '#FFCFC8',
            '#56CDAB',
            '#CFDD22',
            '#B3F5D2',
            '#97DB29',
            '#9DC5EE',
            '#CFC0F5',
            '#EDEA29',
            '#5EC027',
            '#386C94'
        ],
        BELIZE: [
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
        ],
        VIRIDIS: [
            '#440154',
            '#481f70',
            '#443983',
            '#3b528b',
            '#31688e',
            '#287c8e',
            '#21918c',
            '#20a486',
            '#35b779',
            '#5ec962',
            '#90d743',
            '#c8e020',
        ],
        MAGMA: [
            '#000004',
            '#100b2d',
            '#2c115f',
            '#51127c',
            '#721f81',
            '#932b80',
            '#b73779',
            '#d8456c',
            '#f1605d',
            '#fc8961',
            '#feb078',
            '#fed799',
        ],
        INFERNO: [
            '#000004',
            '#110a30',
            '#320a5e',
            '#57106e',
            '#781c6d',
            '#9a2865',
            '#bc3754',
            '#d84c3e',
            '#ed6925',
            '#f98e09',
            '#fbb61a',
            '#f4df53',
        ],
        PLASMA: [
            '#0d0887',
            '#3a049a',
            '#5c01a6',
            '#7e03a8',
            '#9c179e',
            '#b52f8c',
            '#cc4778',
            '#de5f65',
            '#ed7953',
            '#f89540',
            '#fdb42f',
            '#fbd524',
        ],
        YL_OR_RD: [
            '#ffffcc',
            '#ffeda0',
            '#fed976',
            '#feb24c',
            '#fd8d3c',
            '#fc4e2a',
            '#e31a1c',
            '#bd0026',
            '#800026',
        ],
        YL_GN_BU: [
            '#ffffd9',
            '#edf8b1',
            '#c7e9b4',
            '#7fcdbb',
            '#41b6c4',
            '#1d91c0',
            '#225ea8',
            '#253494',
            '#081d58',
        ],
        BU_GN: [
            '#f7fcfd',
            '#ebf7fa',
            '#dcf2f2',
            '#c8eae4',
            '#aadfd2',
            '#88d1bc',
            '#68c2a3',
            '#4eb485',
            '#37a266',
            '#228c49',
            '#0d7635',
            '#025f27',
        ],
        WARP10: [
            '#ff9900',
            '#004eff',
            '#E53935',
            '#7CB342',
            '#F4511E',
            '#039BE5',
            '#D81B60',
            '#C0CA33',
            '#6D4C41',
            '#8E24AA',
            '#00ACC1',
            '#FDD835',
            '#5E35B1',
            '#00897B',
            '#FFB300',
            '#3949AB',
            '#43A047',
            '#1E88E5',
        ],
        NINETEEN_EIGHTY_FOUR: ['#31C0F6', '#A500A5', '#FF7E27'],
        ATLANTIS: ['#74D495', '#3F3FBA', '#FF4D9E'],
        DO_ANDROIDS_DREAM: ['#8F8AF4', '#A51414', '#F4CF31'],
        DELOREAN: ['#FD7A5D', '#5F1CF2', '#4CE09A'],
        CTHULHU: ['#FDC44F', '#007C76', '#8983FF'],
        ECTOPLASM: ['#DA6FF1', '#00717A', '#ACFF76'],
        T_MAX_400_FILM: ['#F6F6F8', '#A4A8B6', '#545667']
    };

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
    // @dynamic
    var ChartLib = /** @class */ (function () {
        function ChartLib() {
        }
        ChartLib.mergeDeep = function (base, extended) {
            var obj = Object.assign({}, base);
            for (var prop in extended || {}) {
                // If property is an object, merge properties
                if (Object.prototype.toString.call(extended[prop]) === '[object Object]') {
                    obj[prop] = ChartLib.mergeDeep(obj[prop], extended[prop]);
                }
                else {
                    obj[prop] = extended[prop];
                }
            }
            return obj;
        };
        return ChartLib;
    }());
    ChartLib.DEFAULT_WIDTH = 640;
    ChartLib.DEFAULT_HEIGHT = 480;

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
    var Param = /** @class */ (function () {
        function Param() {
            this.scheme = 'WARP10';
            this.horizontal = false;
            this.stacked = false;
            this.showControls = true;
            this.showErrors = true;
            this.showStatus = true;
            this.showDots = false;
            this.timeUnit = 'us';
            this.timeZone = 'UTC';
            this.map = {
                tiles: [],
                showTimeSlider: false,
                showTimeRange: false,
                timeSliderMode: 'timestamp'
            };
            this.bounds = {};
        }
        return Param;
    }());

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
    var Size = /** @class */ (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        return Size;
    }());
    var SizeService = /** @class */ (function () {
        function SizeService() {
            this.sizeChanged$ = new i0.EventEmitter();
        }
        SizeService.prototype.change = function (size) {
            this.sizeChanged$.emit(size);
        };
        return SizeService;
    }());
    SizeService.decorators = [
        { type: i0.Injectable }
    ];
    SizeService.ctorParameters = function () { return []; };

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
    // tslint:disable-next-line:directive-class-suffix
    var WarpViewComponent = /** @class */ (function () {
        function WarpViewComponent(el, renderer, sizeService, ngZone) {
            var _this = this;
            this.el = el;
            this.renderer = renderer;
            this.sizeService = sizeService;
            this.ngZone = ngZone;
            this.width = ChartLib.DEFAULT_WIDTH;
            this.height = ChartLib.DEFAULT_HEIGHT;
            this.chartDraw = new i0.EventEmitter();
            this._options = new Param();
            this.defOptions = ChartLib.mergeDeep(new Param(), {
                dotsLimit: 1000,
                heatControls: false,
                timeMode: 'date',
                showRangeSelector: true,
                gridLineColor: '#8e8e8e',
                showDots: false,
                timeZone: 'UTC',
                timeUnit: 'us',
                showControls: true,
            });
            this._debug = false;
            this._showLegend = false;
            this._responsive = true;
            this._unit = '';
            this._autoResize = true;
            this._hiddenData = [];
            this.tooltipPosition = { top: '-10000px', left: '-1000px' };
            this.loading = true;
            this.noData = false;
            this.layout = {
                margin: {
                    t: 10,
                    b: 25,
                    r: 10,
                    l: 10
                }
            };
            this.plotlyConfig = {
                responsive: true,
                showAxisDragHandles: true,
                scrollZoom: true,
                doubleClick: 'reset+autosize',
                showTips: true,
                plotGlPixelRatio: 1,
                staticPlot: false,
                displaylogo: false,
                modeBarButtonsToRemove: [
                    'lasso2d', 'select2d', 'toggleSpikelines', 'toggleHover', 'hoverClosest3d', 'autoScale2d',
                    'hoverClosestGeo', 'hoverClosestGl2d', 'hoverClosestPie', 'toggleHover',
                    'hoverClosestCartesian', 'hoverCompareCartesian'
                ]
            };
            this.sizeService.sizeChanged$.subscribe(function (size) {
                if (el.nativeElement.parentElement) {
                    var parentSize = el.nativeElement.parentElement.getBoundingClientRect();
                    if (_this._responsive) {
                        _this.height = parentSize.height;
                        _this.width = parentSize.width;
                    }
                    if (!!_this.graph && _this._responsive && parentSize.height > 0) {
                        var layout_1 = {
                            width: parentSize.width,
                            height: _this._autoResize ? parentSize.height : _this.layout.height
                        };
                        if (_this.layout.width !== layout_1.width || _this.layout.height !== layout_1.height) {
                            setTimeout(function () { return _this.layout = Object.assign(Object.assign({}, _this.layout), layout_1); });
                            _this.LOG.debug(['sizeChanged$'], _this.layout.width, _this.layout.height);
                            _this.graph.resize(layout_1);
                        }
                    }
                }
            });
        }
        Object.defineProperty(WarpViewComponent.prototype, "hiddenData", {
            get: function () {
                return this._hiddenData;
            },
            set: function (hiddenData) {
                this._hiddenData = hiddenData;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewComponent.prototype, "unit", {
            get: function () {
                return this._unit;
            },
            set: function (unit) {
                this._unit = unit;
                this.update(undefined, false);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewComponent.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (debug) {
                if (typeof debug === 'string') {
                    debug = 'true' === debug;
                }
                this._debug = debug;
                this.LOG.setDebug(debug);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewComponent.prototype, "showLegend", {
            get: function () {
                return this._showLegend;
            },
            set: function (showLegend) {
                if (typeof showLegend === 'string') {
                    showLegend = 'true' === showLegend;
                }
                this._showLegend = showLegend;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewComponent.prototype, "responsive", {
            get: function () {
                return this._responsive;
            },
            set: function (responsive) {
                if (typeof responsive === 'string') {
                    responsive = 'true' === responsive;
                }
                this._responsive = responsive;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewComponent.prototype, "options", {
            set: function (options) {
                this.LOG.debug(['onOptions'], options);
                if (typeof options === 'string') {
                    options = JSON.parse(options);
                }
                if (!deepEqual__default['default'](options, this._options)) {
                    this.LOG.debug(['onOptions', 'changed'], options);
                    this._options = options;
                    this.update(this._options, false);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewComponent.prototype, "data", {
            set: function (data) {
                this.LOG.debug(['onData'], data);
                if (data) {
                    this._data = GTSLib.getData(data);
                    this.update(this._options, this._options.isRefresh);
                    this.LOG.debug(['onData'], this._data);
                }
            },
            enumerable: false,
            configurable: true
        });
        WarpViewComponent.prototype.legendFormatter = function (x, series, highlighted) {
            var _this = this;
            if (highlighted === void 0) { highlighted = -1; }
            var displayedCurves = [];
            if (x === null) {
                // This happens when there's no selection and {legend: 'always'} is set.
                return "<br>\n      " + series.map(function (s) {
                    // FIXME :  if (!s.isVisible) return;
                    var labeledData = GTSLib.formatLabel(s.data.text || '') + ': ' + ((_this._options.horizontal ? s.x : s.y) || s.r || '');
                    var color = s.data.line.color;
                    if (!!s.data.marker) {
                        if (GTSLib.isArray(s.data.marker.color)) {
                            color = s.data.marker.color[0];
                        }
                        else {
                            color = s.data.marker.color;
                        }
                    }
                    if (s.curveNumber === highlighted) {
                        labeledData = "<i class=\"chip\"\n    style=\"background-color: " + color + ";border: 2px solid " + color + ";\"></i> " + labeledData;
                    }
                    return labeledData;
                }).join('<br>');
            }
            var html = '';
            if (!!series[0]) {
                x = series[0].x || series[0].theta;
            }
            html += "<b>" + x + "</b><br />";
            // put the highlighted one(s?) first, keep only visibles, keep only 50 first ones.
            series = series.sort(function (sa, sb) { return (sa.curveNumber === highlighted) ? -1 : 1; });
            series
                // .filter(s => s.isVisible && s.yHTML)
                .slice(0, 50)
                .forEach(function (s, i) {
                if (displayedCurves.indexOf(s.curveNumber) <= -1) {
                    displayedCurves.push(s.curveNumber);
                    var value = series[0].data.orientation === 'h' ? s.x : s.y;
                    if (!value && value !== 0) {
                        value = s.r;
                    }
                    var labeledData = GTSLib.formatLabel(s.data.text || '') + ': ' + value;
                    if (s.curveNumber === highlighted) {
                        labeledData = "<b>" + labeledData + "</b>";
                    }
                    var color = s.data.line ? s.data.line.color : '';
                    if (!!s.data.marker) {
                        if (GTSLib.isArray(s.data.marker.color)) {
                            color = s.data.marker.color[0];
                        }
                        else {
                            color = s.data.marker.color;
                        }
                    }
                    html += "<i class=\"chip\" style=\"background-color: " + color + ";border: 2px solid " + color + ";\"></i>&nbsp;" + labeledData;
                    if (i < series.length) {
                        html += '<br>';
                    }
                }
            });
            return html;
        };
        WarpViewComponent.prototype.initChart = function (el, resize) {
            var _this = this;
            if (resize === void 0) { resize = true; }
            this.noData = false;
            var parentSize = el.nativeElement.parentElement.parentElement.getBoundingClientRect();
            if (this._responsive) {
                if (resize) {
                    if (this._autoResize && (parentSize.height === 0 || this.height !== parentSize.height)
                        || parentSize.width === 0 || this.width !== parentSize.width) {
                        if (this._autoResize) {
                            this.height = parentSize.height;
                        }
                        this.width = parentSize.width;
                        setTimeout(function () { return _this.initChart(el); }, 100);
                        return;
                    }
                    else {
                        if (this._autoResize) {
                            this.height = parentSize.height;
                        }
                        this.width = parentSize.width;
                    }
                }
            }
            this.LOG.debug(['initiChart', 'this._data'], this._data, this._options);
            if (!this._data || !this._data.data || this._data.data.length === 0 || !this._options) {
                this.loading = false;
                this.LOG.debug(['initiChart', 'nodata']);
                this.noData = true;
                this.chartDraw.emit();
                return false;
            }
            this._options = ChartLib.mergeDeep(this.defOptions, this._options || {});
            var dataModel = this._data;
            this._options = ChartLib.mergeDeep(this._options || {}, this._data.globalParams);
            this._options.timeMode = this._options.timeMode || 'date';
            this.loading = !this._options.isRefresh;
            this.divider = GTSLib.getDivider(this._options.timeUnit);
            this.plotlyData = this.convert(dataModel);
            this.plotlyConfig.responsive = this._responsive;
            this.layout.paper_bgcolor = 'rgba(0,0,0,0)';
            this.layout.plot_bgcolor = 'rgba(0,0,0,0)';
            if (!this._responsive) {
                this.layout.width = this.width || ChartLib.DEFAULT_WIDTH;
                this.layout.height = this.height || ChartLib.DEFAULT_HEIGHT;
            }
            else {
                this.layout.width = this.width || parentSize.width;
                this.layout.height = this.height || parentSize.height;
            }
            this.layout.showLegend = !!this._options.showLegend;
            this.LOG.debug(['initiChart', 'plotlyData'], this.plotlyData);
            this.loading = false;
            this.chartDraw.emit();
            return !(!this.plotlyData || this.plotlyData.length === 0);
        };
        WarpViewComponent.prototype.afterPlot = function (plotlyInstance) {
            this.LOG.debug(['afterPlot', 'plotlyInstance'], plotlyInstance);
            this.loading = false;
            this.rect = this.graph.getBoundingClientRect();
            this.chartDraw.emit();
        };
        WarpViewComponent.prototype.hideTooltip = function () {
            var _this = this;
            if (!!this.hideTooltipTimer) {
                clearTimeout(this.hideTooltipTimer);
            }
            this.hideTooltipTimer = setTimeout(function () {
                _this.toolTip.nativeElement.style.display = 'none';
            }, 1000);
        };
        WarpViewComponent.prototype.unhover = function (data, point) {
            this.LOG.debug(['unhover'], data);
            if (!!this.hideTooltipTimer) {
                clearTimeout(this.hideTooltipTimer);
            }
        };
        WarpViewComponent.prototype.hover = function (data, point) {
            this.renderer.setStyle(this.toolTip.nativeElement, 'display', 'block');
            if (!!this.hideTooltipTimer) {
                clearTimeout(this.hideTooltipTimer);
            }
            var delta = Number.MAX_VALUE;
            var curves = [];
            if (!point) {
                if (data.points[0] && data.points[0].data.orientation !== 'h') {
                    var y_1 = (data.yvals || [''])[0];
                    data.points.forEach(function (p) {
                        curves.push(p.curveNumber);
                        var d = Math.abs((p.y || p.r) - y_1);
                        if (d < delta) {
                            delta = d;
                            point = p;
                        }
                    });
                }
                else {
                    var x_1 = (data.xvals || [''])[0];
                    data.points.forEach(function (p) {
                        curves.push(p.curveNumber);
                        var d = Math.abs((p.x || p.r) - x_1);
                        if (d < delta) {
                            delta = d;
                            point = p;
                        }
                    });
                }
            }
            if (point && !!data.event) {
                var content = this.legendFormatter(this._options.horizontal ?
                    (data.yvals || [''])[0] :
                    (data.xvals || [''])[0], data.points, point.curveNumber);
                var left = (data.event.offsetX + 20) + 'px';
                if (data.event.offsetX > this.chartContainer.nativeElement.clientWidth / 2) {
                    left = Math.max(0, data.event.offsetX - this.toolTip.nativeElement.clientWidth - 20) + 'px';
                }
                var top = Math.min(this.el.nativeElement.getBoundingClientRect().height - this.toolTip.nativeElement.getBoundingClientRect().height - 20, data.event.y - 20 - this.el.nativeElement.getBoundingClientRect().top) + 'px';
                this.moveTooltip(top, left, content);
            }
        };
        WarpViewComponent.prototype.getTooltipPosition = function () {
            return {
                top: this.tooltipPosition.top,
                left: this.tooltipPosition.left,
            };
        };
        WarpViewComponent.prototype.moveTooltip = function (top, left, content) {
            this.tooltipPosition = { top: top, left: left };
            this.renderer.setProperty(this.toolTip.nativeElement, 'innerHTML', content);
            this.LOG.debug(['hover - moveTooltip'], new Date().toISOString());
        };
        WarpViewComponent.prototype.relayout = function ($event) {
        };
        WarpViewComponent.prototype.getLabelColor = function (el) {
            return this.getCSSColor(el, '--warp-view-chart-label-color', '#8e8e8e').trim();
        };
        WarpViewComponent.prototype.getGridColor = function (el) {
            return this.getCSSColor(el, '--warp-view-chart-grid-color', '#8e8e8e').trim();
        };
        WarpViewComponent.prototype.getCSSColor = function (el, property, defColor) {
            var color = getComputedStyle(el).getPropertyValue(property).trim();
            return color === '' ? defColor : color;
        };
        return WarpViewComponent;
    }());
    WarpViewComponent.decorators = [
        { type: i0.Directive }
    ];
    WarpViewComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewComponent.propDecorators = {
        toolTip: [{ type: i0.ViewChild, args: ['toolTip', { static: true },] }],
        graph: [{ type: i0.ViewChild, args: ['graph',] }],
        chartContainer: [{ type: i0.ViewChild, args: ['chartContainer', { static: true },] }],
        width: [{ type: i0.Input, args: ['width',] }],
        height: [{ type: i0.Input, args: ['height',] }],
        hiddenData: [{ type: i0.Input, args: ['hiddenData',] }],
        unit: [{ type: i0.Input, args: ['unit',] }],
        debug: [{ type: i0.Input, args: ['debug',] }],
        showLegend: [{ type: i0.Input, args: ['showLegend',] }],
        responsive: [{ type: i0.Input, args: ['responsive',] }],
        options: [{ type: i0.Input, args: ['options',] }],
        data: [{ type: i0.Input, args: ['data',] }],
        chartDraw: [{ type: i0.Output, args: ['chartDraw',] }]
    };

    /* tslint:disable:no-bitwise */
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
    var Timsort = /** @class */ (function () {
        function Timsort(array, compare) {
            this.array = null;
            this.compare = null;
            this.minGallop = Timsort.DEFAULT_MIN_GALLOPING;
            this.length = 0;
            this.tmpStorageLength = Timsort.DEFAULT_TMP_STORAGE_LENGTH;
            this.stackLength = 0;
            this.runStart = null;
            this.runLength = null;
            this.stackSize = 0;
            this.array = array;
            this.compare = compare;
            this.length = array.length;
            if (this.length < 2 * Timsort.DEFAULT_TMP_STORAGE_LENGTH) {
                this.tmpStorageLength = this.length >>> 1;
            }
            this.tmp = new Array(this.tmpStorageLength);
            this.stackLength = (this.length < 120 ? 5 : this.length < 1542 ? 10 : this.length < 119151 ? 19 : 40);
            this.runStart = new Array(this.stackLength);
            this.runLength = new Array(this.stackLength);
        }
        Timsort.log10 = function (x) {
            if (x < 1e5) {
                if (x < 1e2) {
                    return x < 1e1 ? 0 : 1;
                }
                if (x < 1e4) {
                    return x < 1e3 ? 2 : 3;
                }
                return 4;
            }
            if (x < 1e7) {
                return x < 1e6 ? 5 : 6;
            }
            if (x < 1e9) {
                return x < 1e8 ? 7 : 8;
            }
            return 9;
        };
        Timsort.minRunLength = function (n) {
            var r = 0;
            while (n >= Timsort.DEFAULT_MIN_MERGE) {
                r |= (n & 1);
                n >>= 1;
            }
            return n + r;
        };
        Timsort.makeAscendingRun = function (array, lo, hi, compare) {
            var runHi = lo + 1;
            if (runHi === hi) {
                return 1;
            }
            // Descending
            if (compare(array[runHi++], array[lo]) < 0) {
                while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
                    runHi++;
                }
                Timsort.reverseRun(array, lo, runHi);
                // Ascending
            }
            else {
                while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
                    runHi++;
                }
            }
            return runHi - lo;
        };
        Timsort.reverseRun = function (array, lo, hi) {
            hi--;
            while (lo < hi) {
                var t = array[lo];
                array[lo++] = array[hi];
                array[hi--] = t;
            }
        };
        Timsort.binaryInsertionSort = function (array, lo, hi, start, compare) {
            if (start === lo) {
                start++;
            }
            for (; start < hi; start++) {
                var pivot = array[start];
                // Ranges of the array where pivot belongs
                var left = lo;
                var right = start;
                while (left < right) {
                    var mid = (left + right) >>> 1;
                    if (compare(pivot, array[mid]) < 0) {
                        right = mid;
                    }
                    else {
                        left = mid + 1;
                    }
                }
                var n = start - left;
                // Switch is just an optimization for small arrays
                switch (n) {
                    case 3:
                        array[left + 3] = array[left + 2];
                    /* falls through */
                    case 2:
                        array[left + 2] = array[left + 1];
                    /* falls through */
                    case 1:
                        array[left + 1] = array[left];
                        break;
                    default:
                        while (n > 0) {
                            array[left + n] = array[left + n - 1];
                            n--;
                        }
                }
                array[left] = pivot;
            }
        };
        Timsort.gallopLeft = function (value, array, start, length, hint, compare) {
            var lastOffset = 0;
            var maxOffset;
            var offset = 1;
            if (compare(value, array[start + hint]) > 0) {
                maxOffset = length - hint;
                while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
                    lastOffset = offset;
                    offset = (offset << 1) + 1;
                    if (offset <= 0) {
                        offset = maxOffset;
                    }
                }
                if (offset > maxOffset) {
                    offset = maxOffset;
                }
                // Make offsets relative to start
                lastOffset += hint;
                offset += hint;
                // value <= array[start + hint]
            }
            else {
                maxOffset = hint + 1;
                while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
                    lastOffset = offset;
                    offset = (offset << 1) + 1;
                    if (offset <= 0) {
                        offset = maxOffset;
                    }
                }
                if (offset > maxOffset) {
                    offset = maxOffset;
                }
                // Make offsets relative to start
                var tmp = lastOffset;
                lastOffset = hint - offset;
                offset = hint - tmp;
            }
            lastOffset++;
            while (lastOffset < offset) {
                var m = lastOffset + ((offset - lastOffset) >>> 1);
                if (compare(value, array[start + m]) > 0) {
                    lastOffset = m + 1;
                }
                else {
                    offset = m;
                }
            }
            return offset;
        };
        Timsort.gallopRight = function (value, array, start, length, hint, compare) {
            var lastOffset = 0;
            var maxOffset;
            var offset = 1;
            if (compare(value, array[start + hint]) < 0) {
                maxOffset = hint + 1;
                while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
                    lastOffset = offset;
                    offset = (offset << 1) + 1;
                    if (offset <= 0) {
                        offset = maxOffset;
                    }
                }
                if (offset > maxOffset) {
                    offset = maxOffset;
                }
                // Make offsets relative to start
                var tmp = lastOffset;
                lastOffset = hint - offset;
                offset = hint - tmp;
                // value >= array[start + hint]
            }
            else {
                maxOffset = length - hint;
                while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
                    lastOffset = offset;
                    offset = (offset << 1) + 1;
                    if (offset <= 0) {
                        offset = maxOffset;
                    }
                }
                if (offset > maxOffset) {
                    offset = maxOffset;
                }
                // Make offsets relative to start
                lastOffset += hint;
                offset += hint;
            }
            lastOffset++;
            while (lastOffset < offset) {
                var m = lastOffset + ((offset - lastOffset) >>> 1);
                if (compare(value, array[start + m]) < 0) {
                    offset = m;
                }
                else {
                    lastOffset = m + 1;
                }
            }
            return offset;
        };
        Timsort.alphabeticalCompare = function (a, b) {
            if (a === b) {
                return 0;
            }
            if (~~a === a && ~~b === b) {
                if (a === 0 || b === 0) {
                    return a < b ? -1 : 1;
                }
                if (a < 0 || b < 0) {
                    if (b >= 0) {
                        return -1;
                    }
                    if (a >= 0) {
                        return 1;
                    }
                    a = -a;
                    b = -b;
                }
                var al = Timsort.log10(a);
                var bl = Timsort.log10(b);
                var t = 0;
                if (al < bl) {
                    a *= Timsort.POWERS_OF_TEN[bl - al - 1];
                    b /= 10;
                    t = -1;
                }
                else if (al > bl) {
                    b *= Timsort.POWERS_OF_TEN[al - bl - 1];
                    a /= 10;
                    t = 1;
                }
                if (a === b) {
                    return t;
                }
                return a < b ? -1 : 1;
            }
            var aStr = String(a);
            var bStr = String(b);
            if (aStr === bStr) {
                return 0;
            }
            return aStr < bStr ? -1 : 1;
        };
        Timsort.sort = function (array, compare, lo, hi) {
            if (!Array.isArray(array)) {
                throw new TypeError('Can only sort arrays');
            }
            if (!compare) {
                compare = Timsort.alphabeticalCompare;
            }
            else if (typeof compare !== 'function') {
                hi = lo;
                lo = compare;
                compare = Timsort.alphabeticalCompare;
            }
            if (!lo) {
                lo = 0;
            }
            if (!hi) {
                hi = array.length;
            }
            var remaining = hi - lo;
            // The array is already sorted
            if (remaining < 2) {
                return;
            }
            var runLength = 0;
            // On small arrays binary sort can be used directly
            if (remaining < Timsort.DEFAULT_MIN_MERGE) {
                runLength = Timsort.makeAscendingRun(array, lo, hi, compare);
                Timsort.binaryInsertionSort(array, lo, hi, lo + runLength, compare);
                return;
            }
            var ts = new Timsort(array, compare);
            var minRun = Timsort.minRunLength(remaining);
            do {
                runLength = Timsort.makeAscendingRun(array, lo, hi, compare);
                if (runLength < minRun) {
                    var force = remaining;
                    if (force > minRun) {
                        force = minRun;
                    }
                    Timsort.binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
                    runLength = force;
                }
                // Push new run and merge if necessary
                ts.pushRun(lo, runLength);
                ts.mergeRuns();
                // Go find next run
                remaining -= runLength;
                lo += runLength;
            } while (remaining !== 0);
            // Force merging of remaining runs
            ts.forceMergeRuns();
        };
        Timsort.prototype.pushRun = function (runStart, runLength) {
            this.runStart[this.stackSize] = runStart;
            this.runLength[this.stackSize] = runLength;
            this.stackSize += 1;
        };
        Timsort.prototype.mergeRuns = function () {
            while (this.stackSize > 1) {
                var n = this.stackSize - 2;
                if ((n >= 1 && this.runLength[n - 1] <= this.runLength[n] + this.runLength[n + 1])
                    || (n >= 2 && this.runLength[n - 2] <= this.runLength[n] + this.runLength[n - 1])) {
                    if (this.runLength[n - 1] < this.runLength[n + 1]) {
                        n--;
                    }
                }
                else if (this.runLength[n] > this.runLength[n + 1]) {
                    break;
                }
                this.mergeAt(n);
            }
        };
        Timsort.prototype.forceMergeRuns = function () {
            while (this.stackSize > 1) {
                var n = this.stackSize - 2;
                if (n > 0 && this.runLength[n - 1] < this.runLength[n + 1]) {
                    n--;
                }
                this.mergeAt(n);
            }
        };
        Timsort.prototype.mergeAt = function (i) {
            var compare = this.compare;
            var array = this.array;
            var start1 = this.runStart[i];
            var length1 = this.runLength[i];
            var start2 = this.runStart[i + 1];
            var length2 = this.runLength[i + 1];
            this.runLength[i] = length1 + length2;
            if (i === this.stackSize - 3) {
                this.runStart[i + 1] = this.runStart[i + 2];
                this.runLength[i + 1] = this.runLength[i + 2];
            }
            this.stackSize--;
            var k = Timsort.gallopRight(array[start2], array, start1, length1, 0, compare);
            start1 += k;
            length1 -= k;
            if (length1 === 0) {
                return;
            }
            length2 = Timsort.gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);
            if (length2 === 0) {
                return;
            }
            if (length1 <= length2) {
                this.mergeLow(start1, length1, start2, length2);
            }
            else {
                this.mergeHigh(start1, length1, start2, length2);
            }
        };
        Timsort.prototype.mergeLow = function (start1, length1, start2, length2) {
            var compare = this.compare;
            var array = this.array;
            var tmp = this.tmp;
            var i;
            for (i = 0; i < length1; i++) {
                tmp[i] = array[start1 + i];
            }
            var cursor1 = 0;
            var cursor2 = start2;
            var dest = start1;
            array[dest++] = array[cursor2++];
            if (--length2 === 0) {
                for (i = 0; i < length1; i++) {
                    array[dest + i] = tmp[cursor1 + i];
                }
                return;
            }
            if (length1 === 1) {
                for (i = 0; i < length2; i++) {
                    array[dest + i] = array[cursor2 + i];
                }
                array[dest + length2] = tmp[cursor1];
                return;
            }
            var minGallop = this.minGallop;
            while (true) {
                var count1 = 0;
                var count2 = 0;
                var exit = false;
                do {
                    if (compare(array[cursor2], tmp[cursor1]) < 0) {
                        array[dest++] = array[cursor2++];
                        count2++;
                        count1 = 0;
                        if (--length2 === 0) {
                            exit = true;
                            break;
                        }
                    }
                    else {
                        array[dest++] = tmp[cursor1++];
                        count1++;
                        count2 = 0;
                        if (--length1 === 1) {
                            exit = true;
                            break;
                        }
                    }
                } while ((count1 | count2) < minGallop);
                if (exit) {
                    break;
                }
                do {
                    count1 = Timsort.gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);
                    if (count1 !== 0) {
                        for (i = 0; i < count1; i++) {
                            array[dest + i] = tmp[cursor1 + i];
                        }
                        dest += count1;
                        cursor1 += count1;
                        length1 -= count1;
                        if (length1 <= 1) {
                            exit = true;
                            break;
                        }
                    }
                    array[dest++] = array[cursor2++];
                    if (--length2 === 0) {
                        exit = true;
                        break;
                    }
                    count2 = Timsort.gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);
                    if (count2 !== 0) {
                        for (i = 0; i < count2; i++) {
                            array[dest + i] = array[cursor2 + i];
                        }
                        dest += count2;
                        cursor2 += count2;
                        length2 -= count2;
                        if (length2 === 0) {
                            exit = true;
                            break;
                        }
                    }
                    array[dest++] = tmp[cursor1++];
                    if (--length1 === 1) {
                        exit = true;
                        break;
                    }
                    minGallop--;
                } while (count1 >= Timsort.DEFAULT_MIN_GALLOPING || count2 >= Timsort.DEFAULT_MIN_GALLOPING);
                if (exit) {
                    break;
                }
                if (minGallop < 0) {
                    minGallop = 0;
                }
                minGallop += 2;
            }
            this.minGallop = minGallop;
            if (minGallop < 1) {
                this.minGallop = 1;
            }
            if (length1 === 1) {
                for (i = 0; i < length2; i++) {
                    array[dest + i] = array[cursor2 + i];
                }
                array[dest + length2] = tmp[cursor1];
            }
            else if (length1 === 0) {
                throw new Error('mergeLow preconditions were not respected');
            }
            else {
                for (i = 0; i < length1; i++) {
                    array[dest + i] = tmp[cursor1 + i];
                }
            }
        };
        Timsort.prototype.mergeHigh = function (start1, length1, start2, length2) {
            var compare = this.compare;
            var array = this.array;
            var tmp = this.tmp;
            var i;
            for (i = 0; i < length2; i++) {
                tmp[i] = array[start2 + i];
            }
            var cursor1 = start1 + length1 - 1;
            var cursor2 = length2 - 1;
            var dest = start2 + length2 - 1;
            var customCursor = 0;
            var customDest = 0;
            array[dest--] = array[cursor1--];
            if (--length1 === 0) {
                customCursor = dest - (length2 - 1);
                for (i = 0; i < length2; i++) {
                    array[customCursor + i] = tmp[i];
                }
                return;
            }
            if (length2 === 1) {
                dest -= length1;
                cursor1 -= length1;
                customDest = dest + 1;
                customCursor = cursor1 + 1;
                for (i = length1 - 1; i >= 0; i--) {
                    array[customDest + i] = array[customCursor + i];
                }
                array[dest] = tmp[cursor2];
                return;
            }
            var minGallop = this.minGallop;
            while (true) {
                var count1 = 0;
                var count2 = 0;
                var exit = false;
                do {
                    if (compare(tmp[cursor2], array[cursor1]) < 0) {
                        array[dest--] = array[cursor1--];
                        count1++;
                        count2 = 0;
                        if (--length1 === 0) {
                            exit = true;
                            break;
                        }
                    }
                    else {
                        array[dest--] = tmp[cursor2--];
                        count2++;
                        count1 = 0;
                        if (--length2 === 1) {
                            exit = true;
                            break;
                        }
                    }
                } while ((count1 | count2) < minGallop);
                if (exit) {
                    break;
                }
                do {
                    count1 = length1 - Timsort.gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);
                    if (count1 !== 0) {
                        dest -= count1;
                        cursor1 -= count1;
                        length1 -= count1;
                        customDest = dest + 1;
                        customCursor = cursor1 + 1;
                        for (i = count1 - 1; i >= 0; i--) {
                            array[customDest + i] = array[customCursor + i];
                        }
                        if (length1 === 0) {
                            exit = true;
                            break;
                        }
                    }
                    array[dest--] = tmp[cursor2--];
                    if (--length2 === 1) {
                        exit = true;
                        break;
                    }
                    count2 = length2 - Timsort.gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);
                    if (count2 !== 0) {
                        dest -= count2;
                        cursor2 -= count2;
                        length2 -= count2;
                        customDest = dest + 1;
                        customCursor = cursor2 + 1;
                        for (i = 0; i < count2; i++) {
                            array[customDest + i] = tmp[customCursor + i];
                        }
                        if (length2 <= 1) {
                            exit = true;
                            break;
                        }
                    }
                    array[dest--] = array[cursor1--];
                    if (--length1 === 0) {
                        exit = true;
                        break;
                    }
                    minGallop--;
                } while (count1 >= Timsort.DEFAULT_MIN_GALLOPING || count2 >= Timsort.DEFAULT_MIN_GALLOPING);
                if (exit) {
                    break;
                }
                if (minGallop < 0) {
                    minGallop = 0;
                }
                minGallop += 2;
            }
            this.minGallop = minGallop;
            if (minGallop < 1) {
                this.minGallop = 1;
            }
            if (length2 === 1) {
                dest -= length1;
                cursor1 -= length1;
                customDest = dest + 1;
                customCursor = cursor1 + 1;
                for (i = length1 - 1; i >= 0; i--) {
                    array[customDest + i] = array[customCursor + i];
                }
                array[dest] = tmp[cursor2];
            }
            else if (length2 === 0) {
                throw new Error('mergeHigh preconditions were not respected');
            }
            else {
                customCursor = dest - (length2 - 1);
                for (i = 0; i < length2; i++) {
                    array[customCursor + i] = tmp[i];
                }
            }
        };
        return Timsort;
    }());
    /**
     * Default minimum size of a run.
     */
    Timsort.DEFAULT_MIN_MERGE = 32;
    /**
     * Minimum ordered subsequece required to do galloping.
     */
    Timsort.DEFAULT_MIN_GALLOPING = 7;
    /**
     * Default tmp storage length. Can increase depending on the size of the
     * smallest run to merge.
     */
    Timsort.DEFAULT_TMP_STORAGE_LENGTH = 256;
    /**
     * Pre-computed powers of 10 for efficient lexicographic comparison of
     * small integers.
     */
    Timsort.POWERS_OF_TEN = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];

    var WarpViewChartComponent = /** @class */ (function (_super) {
        __extends(WarpViewChartComponent, _super);
        function WarpViewChartComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.standalone = true;
            _this.boundsDidChange = new i0.EventEmitter();
            _this.pointHover = new i0.EventEmitter();
            _this.warpViewChartResize = new i0.EventEmitter();
            // tslint:disable-next-line:variable-name
            _this._type = 'line';
            _this.visibility = [];
            _this.maxTick = 0;
            _this.minTick = 0;
            _this.visibleGtsId = [];
            _this.gtsId = [];
            _this.dataHashset = {};
            _this.chartBounds = new ChartBounds();
            _this.visibilityStatus = 'unknown';
            _this.afterBoundsUpdate = false;
            _this.maxPlottable = 10000;
            _this.parsing = false;
            _this.unhighliteCurve = new rxjs.Subject();
            _this.highliteCurve = new rxjs.Subject();
            _this.layout = {
                showlegend: false,
                autosize: true,
                hovermode: 'x',
                hoverdistance: 20,
                xaxis: {
                    font: {}
                },
                yaxis: {
                    exponentformat: 'none',
                    fixedrange: true,
                    automargin: true,
                    showline: true,
                    font: {}
                },
                margin: {
                    t: 0,
                    b: 30,
                    r: 10,
                    l: 50
                },
            };
            _this.LOG = new Logger(WarpViewChartComponent, _this._debug);
            return _this;
        }
        Object.defineProperty(WarpViewChartComponent.prototype, "hiddenData", {
            set: function (hiddenData) {
                var _this = this;
                var previousVisibility = JSON.stringify(this.visibility);
                this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
                this._hiddenData = hiddenData;
                this.visibility = [];
                this.visibleGtsId.forEach(function (id) { return _this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1)); });
                this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
                var newVisibility = JSON.stringify(this.visibility);
                this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility, this._hiddenData);
                if (previousVisibility !== newVisibility) {
                    var visible_1 = [];
                    var hidden_1 = [];
                    (this.gtsId || []).forEach(function (id, i) {
                        if (_this._hiddenData.indexOf(id) > -1) {
                            hidden_1.push(i);
                        }
                        else {
                            visible_1.push(i);
                        }
                    });
                    if (visible_1.length > 0) {
                        this.graph.restyleChart({ visible: true }, visible_1);
                    }
                    if (hidden_1.length > 0) {
                        this.graph.restyleChart({ visible: false }, hidden_1);
                    }
                    this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change', visible_1, hidden_1);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewChartComponent.prototype, "type", {
            set: function (type) {
                this._type = type;
                this.drawChart();
            },
            enumerable: false,
            configurable: true
        });
        WarpViewChartComponent.prototype.update = function (options, refresh) {
            this.drawChart(refresh);
        };
        WarpViewChartComponent.prototype.ngOnInit = function () {
            this._options = this._options || this.defOptions;
        };
        WarpViewChartComponent.prototype.getTimeClip = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve) {
                            _this.LOG.debug(['getTimeClip'], _this.chartBounds);
                            resolve(_this.chartBounds);
                        })];
                });
            });
        };
        WarpViewChartComponent.prototype.resize = function (newHeight) {
            this.LOG.debug(['resize'], newHeight);
            this.height = newHeight;
            this.layout.height = this.height;
            if (this._options.showRangeSelector) {
                this.layout.xaxis.rangeslider = {
                    bgcolor: 'transparent',
                    thickness: 40 / this.height
                };
            }
        };
        WarpViewChartComponent.prototype.drawChart = function (reparseNewData) {
            var _this = this;
            if (reparseNewData === void 0) { reparseNewData = false; }
            this.LOG.debug(['drawChart', 'this.layout', 'this.options'], this.layout, this._options, (this._options.bounds || {}).minDate);
            if (!this.initChart(this.el)) {
                this.LOG.debug(['drawChart', 'initChart', 'empty'], this._options);
                return;
            }
            this.plotlyConfig.scrollZoom = true;
            this.layout.yaxis.gridcolor = this.getGridColor(this.el.nativeElement);
            this.layout.xaxis.gridcolor = this.getGridColor(this.el.nativeElement);
            this.layout.yaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
            this.layout.xaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
            this.layout.margin.t = this.standalone ? 20 : 10;
            this.layout.showlegend = this._showLegend;
            if (!this._responsive) {
                this.layout.width = this.width;
                this.layout.height = this.height;
            }
            this.LOG.debug(['drawChart', 'this.options'], this.layout, this._options);
            this.LOG.debug(['drawChart', 'this.layout'], this.layout);
            this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
            if (!!this._options.showRangeSelector) {
                this.resize(this.height);
            }
            else {
                this.layout.margin.b = 30;
            }
            this.layout = Object.assign({}, this.layout);
            this.highliteCurve.pipe(operators.throttleTime(200)).subscribe(function (value) {
                _this.graph.restyleChart({ opacity: 0.4 }, value.off);
                _this.graph.restyleChart({ opacity: 1 }, value.on);
            });
            this.unhighliteCurve.pipe(operators.throttleTime(200)).subscribe(function (value) {
                _this.graph.restyleChart({ opacity: 1 }, value);
            });
            this.loading = false;
        };
        WarpViewChartComponent.prototype.emitNewBounds = function (min, max, marginLeft) {
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                this.boundsDidChange.emit({ bounds: { min: min, max: max, marginLeft: marginLeft }, source: 'chart' });
                this._options.bounds = this._options.bounds || {};
                this._options.bounds.minDate = min;
                this._options.bounds.maxDate = max;
            }
            else {
                var minDate = moment__default['default'].tz(min, this._options.timeZone).valueOf();
                var maxDate = moment__default['default'].tz(max, this._options.timeZone).valueOf();
                this._options.bounds = this._options.bounds || {};
                this._options.bounds.minDate = minDate;
                this._options.bounds.maxDate = maxDate;
                this.boundsDidChange.emit({ bounds: { min: minDate, max: maxDate, marginLeft: marginLeft }, source: 'chart' });
            }
        };
        WarpViewChartComponent.prototype.initChart = function (el) {
            var res = _super.prototype.initChart.call(this, el);
            var x = {
                tick0: undefined,
                range: [],
            };
            this.LOG.debug(['initChart', 'updateBounds'], this.chartBounds, this._options.bounds);
            var min = (this._options.bounds || {}).minDate || this.chartBounds.tsmin || this.minTick;
            var max = (this._options.bounds || {}).maxDate || this.chartBounds.tsmax || this.maxTick;
            this.LOG.debug(['initChart', 'updateBounds'], [min, max]);
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                x.tick0 = min;
                x.range = [min, max];
            }
            else {
                x.tick0 = GTSLib.toISOString(min, this.divider, this._options.timeZone);
                x.range = [
                    GTSLib.toISOString(min, this.divider, this._options.timeZone),
                    GTSLib.toISOString(max, this.divider, this._options.timeZone)
                ];
            }
            this.layout.xaxis = x;
            if (!!res) {
                this.resize(this.height);
            }
            return res;
        };
        WarpViewChartComponent.prototype.convert = function (data) {
            var _this = this;
            this.parsing = !this._options.isRefresh;
            this.chartBounds.tsmin = undefined;
            this.chartBounds.tsmax = undefined;
            var dataset = [];
            this.LOG.debug(['convert'], this._options.timeMode);
            this.LOG.debug(['convert', 'this._hiddenData'], this._hiddenData);
            this.LOG.debug(['convert', 'this._options.timezone'], this._options.timeZone);
            if (GTSLib.isArray(data.data)) {
                var gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data, 0).res);
                this.maxTick = Number.NEGATIVE_INFINITY;
                this.minTick = Number.POSITIVE_INFINITY;
                this.visibleGtsId = [];
                this.gtsId = [];
                var nonPlottable = gtsList.filter(function (g) { return (g.v && !GTSLib.isGtsToPlot(g)); });
                gtsList = gtsList.filter(function (g) { return g.v && GTSLib.isGtsToPlot(g); });
                // initialize visibility status
                if (this.visibilityStatus === 'unknown') {
                    this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
                }
                var timestampMode_1 = true;
                var tsLimit_1 = 100 * GTSLib.getDivider(this._options.timeUnit);
                gtsList.forEach(function (gts) {
                    var ticks = gts.v.map(function (t) { return t[0]; });
                    var size = gts.v.length;
                    timestampMode_1 = timestampMode_1 && (ticks[0] > -tsLimit_1 && ticks[0] < tsLimit_1);
                    timestampMode_1 = timestampMode_1 && (ticks[size - 1] > -tsLimit_1 && ticks[size - 1] < tsLimit_1);
                });
                if (timestampMode_1 || this._options.timeMode === 'timestamp') {
                    this.layout.xaxis.type = 'linear';
                }
                else {
                    this.layout.xaxis.type = 'date';
                }
                gtsList.forEach(function (gts, i) {
                    if (gts.v && GTSLib.isGtsToPlot(gts)) {
                        Timsort.sort(gts.v, function (a, b) { return a[0] - b[0]; });
                        var size = gts.v.length;
                        var label = GTSLib.serializeGtsMetadata(gts);
                        var c = ColorLib.getColor(gts.id, _this._options.scheme);
                        var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                        var type = ((data.params || [])[i] || { type: _this._type }).type || _this._type;
                        var series = {
                            type: type === 'spline' ? 'scatter' : 'scattergl',
                            mode: type === 'scatter' ? 'markers' : size > _this.maxPlottable ? 'lines' : 'lines+markers',
                            // name: label,
                            text: label,
                            x: [],
                            y: [],
                            line: { color: color },
                            hoverinfo: 'none',
                            connectgaps: false,
                            visible: !(_this._hiddenData.filter(function (h) { return h === gts.id; }).length > 0),
                        };
                        if (type === 'scatter' || size < _this.maxPlottable) {
                            series.marker = {
                                size: 3,
                                color: new Array(size).fill(color),
                                line: { color: color, width: 3 },
                                opacity: new Array(size).fill(_this._type === 'scatter' || _this._options.showDots ? 1 : 0)
                            };
                        }
                        switch (type) {
                            case 'spline':
                                series.line.shape = 'spline';
                                break;
                            case 'area':
                                series.fill = 'tozeroy';
                                series.fillcolor = ColorLib.transparentize(color, 0.3);
                                break;
                            case 'step':
                                series.line.shape = 'hvh';
                                break;
                            case 'step-before':
                                series.line.shape = 'vh';
                                break;
                            case 'step-after':
                                series.line.shape = 'hv';
                                break;
                        }
                        _this.visibleGtsId.push(gts.id);
                        _this.gtsId.push(gts.id);
                        //  this.LOG.debug(['convert'], 'forEach value');
                        var ticks = gts.v.map(function (t) { return t[0]; });
                        var values = gts.v.map(function (t) { return t[t.length - 1]; });
                        if (size > 0) {
                            _this.minTick = _this.minTick || ticks[0];
                            _this.maxTick = _this.maxTick || ticks[0];
                            for (var v = 1; v < size; v++) {
                                var val = ticks[v];
                                _this.minTick = val <= _this.minTick ? val : _this.minTick;
                                _this.maxTick = val >= _this.maxTick ? val : _this.maxTick;
                            }
                        }
                        if (timestampMode_1 || _this._options.timeMode === 'timestamp') {
                            series.x = ticks;
                        }
                        else {
                            series.x = ticks.map(function (t) { return GTSLib.toISOString(t, _this.divider, _this._options.timeZone); });
                        }
                        series.y = values;
                        dataset.push(series);
                    }
                });
                if (nonPlottable.length > 0 && gtsList.length === 0) {
                    nonPlottable.forEach(function (g) {
                        g.v.forEach(function (value) {
                            var ts = value[0];
                            if (ts < _this.minTick) {
                                _this.minTick = ts;
                            }
                            if (ts > _this.maxTick) {
                                _this.maxTick = ts;
                            }
                        });
                    });
                    // if there is not any plottable data, we must add a fake one with id -1. This one will always be hidden.
                    if (0 === gtsList.length) {
                        if (!this.dataHashset[this.minTick]) {
                            this.dataHashset[this.minTick] = [0];
                        }
                        if (!this.dataHashset[this.maxTick]) {
                            this.dataHashset[this.maxTick] = [0];
                        }
                        this.visibility.push(false);
                        this.visibleGtsId.push(-1);
                    }
                }
            }
            this.LOG.debug(['convert'], 'end', dataset);
            this.noData = dataset.length === 0;
            this.parsing = false;
            return dataset;
        };
        WarpViewChartComponent.prototype.afterPlot = function (plotlyInstance) {
            _super.prototype.afterPlot.call(this, plotlyInstance);
            this.marginLeft = parseInt(this.graph.plotEl.nativeElement.querySelector('g.bglayer > rect').getAttribute('x'), 10);
            this.LOG.debug(['afterPlot', 'marginLeft'], this.marginLeft);
            if (this.chartBounds.tsmin !== this.minTick || this.chartBounds.tsmax !== this.maxTick) {
                this.chartBounds.tsmin = this.minTick;
                this.chartBounds.tsmax = this.maxTick;
                this.chartBounds.marginLeft = this.marginLeft;
                this.chartDraw.emit(this.chartBounds);
                if (this.afterBoundsUpdate || this.standalone) {
                    this.LOG.debug(['afterPlot', 'updateBounds'], this.minTick, this.maxTick);
                    this.emitNewBounds(this.minTick, this.maxTick, this.marginLeft);
                    this.loading = false;
                    this.afterBoundsUpdate = false;
                }
            }
            else {
                this.loading = false;
            }
        };
        WarpViewChartComponent.prototype.relayout = function (data) {
            var change = false;
            if (data['xaxis.range'] && data['xaxis.range'].length === 2) {
                if (this.chartBounds.msmin !== data['xaxis.range'][0] || this.chartBounds.msmax !== data['xaxis.range'][1]) {
                    this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range'], data['xaxis.range']);
                    change = true;
                    this.chartBounds.msmin = data['xaxis.range'][0];
                    this.chartBounds.msmax = data['xaxis.range'][1];
                    this.chartBounds.tsmin = moment__default['default'].tz(moment__default['default'](this.chartBounds.msmin), this._options.timeZone).valueOf() * this.divider;
                    this.chartBounds.tsmax = moment__default['default'].tz(moment__default['default'](this.chartBounds.msmax), this._options.timeZone).valueOf() * this.divider;
                }
            }
            else if (data['xaxis.range[0]'] && data['xaxis.range[1]']) {
                if (this.chartBounds.msmin !== data['xaxis.range[0]'] || this.chartBounds.msmax !== data['xaxis.range[1]']) {
                    this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range[x]'], data['xaxis.range[0]']);
                    change = true;
                    this.chartBounds.msmin = data['xaxis.range[0]'];
                    this.chartBounds.msmax = data['xaxis.range[1]'];
                    this.chartBounds.tsmin = moment__default['default'].tz(moment__default['default'](this.chartBounds.msmin), this._options.timeZone).valueOf() * this.divider;
                    this.chartBounds.tsmax = moment__default['default'].tz(moment__default['default'](this.chartBounds.msmax), this._options.timeZone).valueOf() * this.divider;
                }
            }
            else if (data['xaxis.autorange']) {
                if (this.chartBounds.tsmin !== this.minTick || this.chartBounds.tsmax !== this.maxTick) {
                    this.LOG.debug(['relayout', 'updateBounds', 'autorange'], data, this.minTick, this.maxTick);
                    change = true;
                    this.chartBounds.tsmin = this.minTick;
                    this.chartBounds.tsmax = this.maxTick;
                }
            }
            if (change) {
                this.LOG.debug(['relayout', 'updateBounds'], this.chartBounds);
                this.emitNewBounds(this.chartBounds.tsmin, this.chartBounds.tsmax, this.marginLeft);
            }
            this.loading = false;
            this.afterBoundsUpdate = false;
        };
        WarpViewChartComponent.prototype.sliderChange = function ($event) {
            this.LOG.debug(['sliderChange'], $event);
        };
        WarpViewChartComponent.prototype.updateBounds = function (min, max) {
            this.LOG.debug(['updateBounds'], min, max, this._options);
            min = min || this.minTick / this.divider;
            max = max || this.maxTick / this.divider;
            this.layout.xaxis.autorange = false;
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                this.layout.xaxis.range = [min, max];
                this.layout.xaxis.tick0 = min;
            }
            else {
                this.layout.xaxis.range = [
                    GTSLib.toISOString(min, this.divider, this._options.timeZone),
                    GTSLib.toISOString(max, this.divider, this._options.timeZone)
                ];
                this.layout.xaxis.tick0 = GTSLib.toISOString(min, this.divider, this._options.timeZone);
            }
            this.layout = Object.assign({}, this.layout);
            this.LOG.debug(['updateBounds'], this.layout);
            this.afterBoundsUpdate = true;
        };
        WarpViewChartComponent.prototype.setRealBounds = function (chartBounds) {
            this.afterBoundsUpdate = true;
            this.minTick = chartBounds.tsmin;
            this.maxTick = chartBounds.tsmax;
            this._options.bounds = this._options.bounds || {};
            this._options.bounds.minDate = this.minTick;
            this._options.bounds.maxDate = this.maxTick;
            var x = {
                tick0: undefined,
                range: [],
            };
            if (this._options.showRangeSelector) {
                x.rangeslider = {
                    bgcolor: 'transparent',
                    thickness: 40 / this.height
                };
            }
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                x.tick0 = this.minTick / this.divider;
                x.range = [this.minTick, this.maxTick];
            }
            else {
                x.tick0 = GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone);
                x.range = [
                    GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone),
                    GTSLib.toISOString(this.maxTick, this.divider, this._options.timeZone)
                ];
            }
            this.layout.xaxis = x;
            this.layout = Object.assign({}, this.layout);
        };
        WarpViewChartComponent.prototype.hover = function (data) {
            this.LOG.debug(['hover'], data);
            var delta = Number.MAX_VALUE;
            // tslint:disable-next-line:no-shadowed-variable
            var point;
            var curves = [];
            this.toolTip.nativeElement.style.display = 'block';
            if (data.points[0] && data.points[0].data.orientation !== 'h') {
                var y_1 = (data.yvals || [''])[0];
                data.points.forEach(function (p) {
                    curves.push(p.curveNumber);
                    var d = Math.abs(p.y - y_1);
                    if (d < delta) {
                        delta = d;
                        point = p;
                    }
                });
            }
            else {
                var x_1 = (data.xvals || [''])[0];
                data.points.forEach(function (p) {
                    curves.push(p.curveNumber);
                    var d = Math.abs(p.x - x_1);
                    if (d < delta) {
                        delta = d;
                        point = p;
                    }
                });
            }
            _super.prototype.hover.call(this, data, point);
            if (point && this.highlighted !== point.curveNumber) {
                this.highliteCurve.next({ on: [point.curveNumber], off: curves });
                this.highlighted = point.curveNumber;
            }
            this.pointHover.emit(data.event);
            /*setTimeout(() => {
              let pn = -1;
              let tn = -1;
              let color = [];
              let line = {};
              let opacity = [];
              data.points.forEach(p => {
                if (!!p.data.marker) {
                  color = p.data.marker.color;
                  opacity = p.data.marker.opacity;
                  line = p.data.marker.line;
                  pn = p.pointNumber;
                  tn = p.curveNumber;
                  if (pn >= 0) {
                    color[pn] = 'transparent';
                    opacity[pn] = 1;
                    const update = {marker: {color, opacity, line, size: 15}};
                    this.graph.restyleChart(update, [tn]);
                    this.LOG.debug(['hover'], 'restyleChart inner', update, [tn]);
                  }
                }
              });
            })*/
        };
        WarpViewChartComponent.prototype.unhover = function (data) {
            var delta = Number.MAX_VALUE;
            // tslint:disable-next-line:no-shadowed-variable
            var point;
            if (data.points[0] && data.points[0].data.orientation !== 'h') {
                var y_2 = (data.yvals || [''])[0];
                data.points.forEach(function (p) {
                    var d = Math.abs(p.y - y_2);
                    if (d < delta) {
                        delta = d;
                        point = p;
                    }
                });
            }
            else {
                var x_2 = (data.xvals || [''])[0];
                data.points.forEach(function (p) {
                    var d = Math.abs(p.x - x_2);
                    if (d < delta) {
                        delta = d;
                        point = p;
                    }
                });
            }
            if (!!point && this.highlighted !== point.curveNumber) {
                this.unhighliteCurve.next([this.highlighted]);
                this.highlighted = undefined;
            }
            _super.prototype.unhover.call(this, data, point);
            /*setTimeout(() => {
              let pn = -1;
              let tn = -1;
              let color = [];
              let line = {};
              let opacity = [];
              data.points.forEach(p => {
                if (!!p.data.marker) {
                  pn = p.pointNumber;
                  tn = p.curveNumber;
                  color = p.data.marker.color;
                  opacity = p.data.marker.opacity;
                  line = p.data.marker.line;
                  if (pn >= 0) {
                    color[pn] = p.data.line.color;
                    opacity[pn] = this._options.showDots ? 1 : 0;
                    const update = {marker: {color, opacity, line, size: 15}};
                    this.graph.restyleChart(update, [tn]);
                  }
                }
              });
            })*/
        };
        return WarpViewChartComponent;
    }(WarpViewComponent));
    WarpViewChartComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-chart',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <p class=\"noData\" *ngIf=\"parsing\">Parsing data</p>\n  <div *ngIf=\"!loading && !noData\" >\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\"\n                     (afterPlot)=\"afterPlot($event)\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     (sliderChange)=\"sliderChange($event)\" (unhover)=\"unhover($event)\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"wv-tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;display:none;font-size:10px;height:auto!important;left:-1000px;max-width:50%;min-width:100px;padding:10px;pointer-events:none;position:absolute;text-align:left;width:auto;z-index:999}.wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}:host{display:block}:host,:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}:host .executionErrorText{background:#faebd7;border:2px solid red;border-radius:3px;color:red;padding:10px;position:absolute;top:-30px}"]
                },] }
    ];
    WarpViewChartComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewChartComponent.propDecorators = {
        hiddenData: [{ type: i0.Input, args: ['hiddenData',] }],
        type: [{ type: i0.Input, args: ['type',] }],
        standalone: [{ type: i0.Input, args: ['standalone',] }],
        boundsDidChange: [{ type: i0.Output, args: ['boundsDidChange',] }],
        pointHover: [{ type: i0.Output, args: ['pointHover',] }],
        warpViewChartResize: [{ type: i0.Output, args: ['warpViewChartResize',] }]
    };

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
    // noinspection UnterminatedStatementJS
    /** Handles HttpClient errors */
    var HttpErrorHandler = /** @class */ (function () {
        /**
         */
        function HttpErrorHandler() {
            var _this = this;
            this.createHandleError = function (serviceName) {
                if (serviceName === void 0) { serviceName = ''; }
                // tslint:disable-next-line:semicolon
                return function (operation) {
                    if (operation === void 0) { operation = 'operation'; }
                    return _this.handleError(serviceName, operation);
                };
            };
            this.LOG = new Logger(HttpErrorHandler, true);
        }
        HttpErrorHandler.prototype.handleError = function (serviceName, operation) {
            var _this = this;
            if (serviceName === void 0) { serviceName = ''; }
            if (operation === void 0) { operation = 'operation'; }
            return function (error) {
                _this.LOG.error([serviceName], error);
                _this.LOG.error([serviceName], operation + " failed: " + error.statusText);
                var message = ((error.error || {}).message)
                    ? error.error.message
                    : error.status ? error.statusText : 'Server error';
                _this.LOG.error([serviceName], message);
                return of.of(message);
            };
        };
        return HttpErrorHandler;
    }());
    HttpErrorHandler.decorators = [
        { type: i0.Injectable }
    ];
    HttpErrorHandler.ctorParameters = function () { return []; };

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
    var Warp10Service = /** @class */ (function () {
        function Warp10Service(http, httpErrorHandler) {
            this.http = http;
            this.httpErrorHandler = httpErrorHandler;
            this.LOG = new Logger(Warp10Service, true);
            this.handleError = httpErrorHandler.createHandleError('Warp10Service');
        }
        Warp10Service.prototype.exec = function (warpScript, url) {
            var _this = this;
            this.LOG.debug(['exec', 'warpScript'], url, warpScript);
            return this.http.post(url, warpScript, {
                // @ts-ignore
                observe: 'response',
                // @ts-ignore
                responseType: 'text'
            })
                .pipe(operators.tap(function (r) { return _this.LOG.debug(['exec', 'result'], r); }), operators.catchError(this.handleError('exec')));
        };
        return Warp10Service;
    }());
    Warp10Service.ɵprov = i0.ɵɵdefineInjectable({ factory: function Warp10Service_Factory() { return new Warp10Service(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(HttpErrorHandler)); }, token: Warp10Service, providedIn: "root" });
    Warp10Service.decorators = [
        { type: i0.Injectable, args: [{ providedIn: 'root' },] }
    ];
    Warp10Service.ctorParameters = function () { return [
        { type: i1.HttpClient },
        { type: HttpErrorHandler }
    ]; };

    var WarpViewTileComponent = /** @class */ (function (_super) {
        __extends(WarpViewTileComponent, _super);
        function WarpViewTileComponent(el, sizeService, renderer, ngZone, warp10Service) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.sizeService = sizeService;
            _this.renderer = renderer;
            _this.ngZone = ngZone;
            _this.warp10Service = warp10Service;
            _this.warpscriptResult = new i0.EventEmitter();
            _this.execStatus = new i0.EventEmitter();
            _this.execError = new i0.EventEmitter();
            _this.type = 'line';
            _this.url = '';
            _this.isAlone = false; // used by plot to manage its keyboard events
            _this.loaderMessage = '';
            _this.loading = false;
            _this._gtsFilter = '';
            _this._warpScript = '';
            _this.execUrl = '';
            _this.timeUnit = 'us';
            _this.LOG = new Logger(WarpViewTileComponent, _this._debug);
            return _this;
        }
        Object.defineProperty(WarpViewTileComponent.prototype, "gtsFilter", {
            set: function (gtsFilter) {
                this._gtsFilter = gtsFilter;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewTileComponent.prototype, "warpscript", {
            get: function () {
                return this._warpScript;
            },
            set: function (warpScript) {
                if (!!warpScript && this._warpScript !== warpScript) {
                    this._warpScript = warpScript;
                    this.execute(true);
                }
            },
            enumerable: false,
            configurable: true
        });
        WarpViewTileComponent.prototype.ngOnInit = function () {
            this._options = this._options || this.defOptions;
        };
        WarpViewTileComponent.prototype.ngAfterViewInit = function () {
            this._warpScript = this._warpScript || this.warpRef.nativeElement.textContent.trim();
            this.LOG.debug(['ngAfterViewInit', 'warpScript'], this._warpScript);
            this.el.nativeElement.style.opacity = '1';
            if (this.warpRef.nativeElement.textContent.trim() !== '') {
                this.execute(false);
            }
        };
        WarpViewTileComponent.prototype.update = function (options) {
            this.LOG.debug(['update', 'options'], options);
        };
        /* Listeners */
        // @HostListener('keydown', ['$event'])
        WarpViewTileComponent.prototype.handleKeyDown = function (event) {
            if (event.key === 'r') {
                this.execute(false);
            }
        };
        /** detect some VSCode special modifiers in the beginnig of the code:
         * @endpoint xxxURLxxx
         * @timeUnit ns
         * warning : the first line is empty (to confirm with other browsers)
         */
        WarpViewTileComponent.prototype.detectWarpScriptSpecialComments = function () {
            // analyse the first warpScript lines starting with //
            var extraParamsPattern = /\s*\/\/\s*@(\w*)\s*(.*)$/g;
            var warpscriptLines = this._warpScript.split('\n');
            for (var l = 1; l < warpscriptLines.length; l++) {
                var currentLine = warpscriptLines[l];
                if (currentLine === '' || currentLine.search('//') >= 0) {
                    // find and extract
                    var lineOnMatch = void 0;
                    var re = RegExp(extraParamsPattern);
                    while (lineOnMatch = re.exec(currentLine)) {
                        var parameterName = lineOnMatch[1];
                        var parameterValue = lineOnMatch[2];
                        switch (parameterName) {
                            case 'endpoint': //        // @endpoint http://mywarp10server/api/v0/exec
                                this.execUrl = parameterValue;
                                break;
                            case 'timeUnit':
                                this.timeUnit = parameterValue.toLowerCase(); // set the time unit for graphs
                                break;
                            default:
                                break;
                        }
                    }
                }
                else {
                    break; // no more comments at the beginning of the file
                }
            }
        };
        WarpViewTileComponent.prototype.execute = function (isRefresh) {
            var _this = this;
            if (!!this._warpScript && this._warpScript.trim() !== '') {
                this.LOG.debug(['execute'], isRefresh);
                this.error = undefined;
                this.loading = !isRefresh;
                this.execResult = undefined;
                this.loaderMessage = 'Requesting data';
                this.execUrl = this.url;
                this.detectWarpScriptSpecialComments();
                this.LOG.debug(['execute', 'warpScript'], this._warpScript);
                this.warp10Service.exec(this._warpScript, this.execUrl).subscribe(function (response) {
                    _this.loading = false;
                    _this.LOG.debug(['execute'], response);
                    if (response.body) {
                        try {
                            var body_1 = response.body;
                            _this.warpscriptResult.emit(body_1);
                            var headers = response.headers;
                            _this.status = "Your script execution took\n " + GTSLib.formatElapsedTime(parseInt(headers.get('x-warp10-elapsed'), 10)) + "\n serverside, fetched\n " + headers.get('x-warp10-fetched') + " datapoints and performed\n " + headers.get('x-warp10-ops') + "  WarpScript operations.";
                            _this.execStatus.emit({
                                message: _this.status,
                                ops: parseInt(headers.get('x-warp10-ops'), 10),
                                elapsed: parseInt(headers.get('x-warp10-elapsed'), 10),
                                fetched: parseInt(headers.get('x-warp10-fetched'), 10),
                            });
                            if (_this._autoRefresh !== _this._options.autoRefresh) {
                                _this._autoRefresh = _this._options.autoRefresh;
                                if (_this.timer) {
                                    window.clearInterval(_this.timer);
                                }
                                if (_this._autoRefresh && _this._autoRefresh > 0) {
                                    _this.timer = window.setInterval(function () {
                                        _this.execute(true);
                                    }, _this._autoRefresh * 1000);
                                }
                            }
                            setTimeout(function () {
                                _this.execResult = body_1;
                                _this.resultTile.setResult(_this.execResult, isRefresh);
                                _this._options.bounds = {};
                                _this._options = Object.assign({}, _this._options);
                                _this.loading = false;
                            });
                        }
                        catch (e) {
                            _this.LOG.error(['execute'], e);
                            _this.loading = false;
                        }
                    }
                    else {
                        _this.LOG.error(['execute'], response);
                        _this.error = response;
                        _this.loading = false;
                        _this.execError.emit(response);
                    }
                }, function (e) {
                    _this.loading = false;
                    _this.execError.emit(e);
                    _this.LOG.error(['execute'], e);
                });
            }
        };
        WarpViewTileComponent.prototype.convert = function (data) {
            return [];
        };
        WarpViewTileComponent.prototype.chartDrawn = function (event) {
            this.chartDraw.emit(event);
        };
        WarpViewTileComponent.prototype.onWarpViewNewOptions = function (opts) {
            this._options = opts;
        };
        return WarpViewTileComponent;
    }(WarpViewComponent));
    WarpViewTileComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-tile',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n<div class=\"wrapper\" [ngClass]=\"{'full':  responsive}\">\n  <div class=\"tilewrapper\">\n    <h1 *ngIf=\"chartTitle\">{{chartTitle}}</h1>\n    <div [ngClass]=\"{'tile': true,'notitle':  !chartTitle || chartTitle === ''}\">\n      <warpview-spinner *ngIf=\"loading\" message=\"Requesting data\"></warpview-spinner>\n      <div *ngIf=\"_options.showErrors && error\" style=\"height: calc(100% - 30px); width: 100%\">\n        <warpview-display [responsive]=\"true\" [debug]=\"debug\" [options]=\"_options\"\n                          [data]=\"{ data: error,  globalParams: {\n  timeMode:  'custom', bgColor: '#D32C2E', fontColor: '#ffffff'}}\"></warpview-display>\n      </div>\n      <div *ngIf=\"!error\" style=\"height: 100%; width: 100%; padding-bottom: 20px\" [hidden]=\"loading\">\n        <warpview-result-tile #resultTile\n                              (warpViewNewOptions)=\"onWarpViewNewOptions($event)\"\n                              [debug]=\"debug\" [type]=\"type\"\n                              [unit]=\"unit\" [options]=\"_options\"\n                              (chartDraw)=\"chartDrawn($event)\"\n                              [showLegend]=\"showLegend\"></warpview-result-tile>\n      </div>\n    </div>\n  </div>\n  <small *ngIf=\"_options.showStatus\" class=\"status\">{{status}}</small>\n</div>\n\n<div #warpRef style=\"display: none\">\n  <ng-content></ng-content>\n</div>\n",
                    providers: [HttpErrorHandler],
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host,warp-view-tile,warpview-tile{max-height:var(--warp-view-tile-height,100%);min-height:var(--warp-view-tile-height,100%);min-width:var(--warp-view-tile-width,100%);overflow:auto;width:var(--warp-view-tile-width,100%)}:host .error,warp-view-tile .error,warpview-tile .error{color:#dc3545;font-weight:700;text-align:center;width:100%}:host .wrapper,warp-view-tile .wrapper,warpview-tile .wrapper{height:var(--warp-view-tile-height,100%);min-height:50px;opacity:1;position:relative;width:var(--warp-view-tile-width,100%)}:host .wrapper .status,warp-view-tile .wrapper .status,warpview-tile .wrapper .status{background-color:hsla(0,0%,100%,.7);bottom:0;color:#000;font-size:11px;padding:1px 5px;position:absolute;z-index:999}:host .wrapper.full,warp-view-tile .wrapper.full,warpview-tile .wrapper.full{display:flex;flex-direction:column;height:100%;justify-content:space-around;width:100%}:host .wrapper .tilewrapper,warp-view-tile .wrapper .tilewrapper,warpview-tile .wrapper .tilewrapper{height:100%;width:100%}:host .wrapper .tilewrapper .tile,warp-view-tile .wrapper .tilewrapper .tile,warpview-tile .wrapper .tilewrapper .tile{height:calc(var(--warp-view-tile-height, 100%) - 40px);overflow-x:hidden;overflow-y:auto;position:relative;width:100%}:host .wrapper .tilewrapper .notitle,warp-view-tile .wrapper .tilewrapper .notitle,warpview-tile .wrapper .tilewrapper .notitle{height:100%}:host .wrapper .tilewrapper h1,warp-view-tile .wrapper .tilewrapper h1,warpview-tile .wrapper .tilewrapper h1{color:var(--warp-view-font-color);font-size:20px;margin:0;padding:5px}:host .wrapper .tilewrapper h1 small,warp-view-tile .wrapper .tilewrapper h1 small,warpview-tile .wrapper .tilewrapper h1 small{font-size:10px;margin-left:10px}"]
                },] }
    ];
    WarpViewTileComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: SizeService },
        { type: i0.Renderer2 },
        { type: i0.NgZone },
        { type: Warp10Service }
    ]; };
    WarpViewTileComponent.propDecorators = {
        warpRef: [{ type: i0.ViewChild, args: ['warpRef', { static: true },] }],
        resultTile: [{ type: i0.ViewChild, args: ['resultTile',] }],
        warpscriptResult: [{ type: i0.Output, args: ['warpscriptResult',] }],
        execStatus: [{ type: i0.Output, args: ['execStatus',] }],
        execError: [{ type: i0.Output, args: ['execError',] }],
        type: [{ type: i0.Input, args: ['type',] }],
        chartTitle: [{ type: i0.Input, args: ['chartTitle',] }],
        url: [{ type: i0.Input, args: ['url',] }],
        isAlone: [{ type: i0.Input, args: ['isAlone',] }],
        gtsFilter: [{ type: i0.Input, args: ['gtsFilter',] }],
        warpscript: [{ type: i0.Input }],
        handleKeyDown: [{ type: i0.HostListener, args: ['document:keyup', ['$event'],] }]
    };

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
    var WarpViewSpinnerComponent = /** @class */ (function () {
        function WarpViewSpinnerComponent() {
            this.message = 'Loading and parsing data...';
        }
        return WarpViewSpinnerComponent;
    }());
    WarpViewSpinnerComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-spinner',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\">\n  <div class=\"lds-ring\">\n    <div></div>\n    <div></div>\n    <div></div>\n    <div></div>\n  </div>\n  <h2>{{message}}</h2>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);text-align:center}.noData,:host .wrapper{position:relative;width:100%}:host .wrapper{height:100%;min-height:230px}:host .wrapper h2{bottom:0;margin:auto;text-align:center;width:50%}:host .wrapper .lds-ring,:host .wrapper h2{display:inline-block;height:64px;left:50%;position:absolute;transform:translate(-50%,-50%)}:host .wrapper .lds-ring{top:50%;width:64px}:host .wrapper .lds-ring div{-webkit-animation:lds-ring 1.2s cubic-bezier(.5,0,.5,1) infinite;animation:lds-ring 1.2s cubic-bezier(.5,0,.5,1) infinite;border:6px solid transparent;border-radius:50%;border-top:6px solid var(--warp-view-spinner-color);box-sizing:border-box;display:block;height:51px;margin:6px;position:absolute;width:51px}:host .wrapper .lds-ring div:first-child{-webkit-animation-delay:-.45s;animation-delay:-.45s}:host .wrapper .lds-ring div:nth-child(2){-webkit-animation-delay:-.3s;animation-delay:-.3s}:host .wrapper .lds-ring div:nth-child(3){-webkit-animation-delay:-.15s;animation-delay:-.15s}@-webkit-keyframes lds-ring{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes lds-ring{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}"]
                },] }
    ];
    WarpViewSpinnerComponent.propDecorators = {
        message: [{ type: i0.Input, args: ['message',] }]
    };

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
    /**
     *
     */
    var WarpViewToggleComponent = /** @class */ (function () {
        function WarpViewToggleComponent(el) {
            this.el = el;
            this.text1 = '';
            this.text2 = '';
            this.stateChange = new i0.EventEmitter();
            this.state = false;
        }
        Object.defineProperty(WarpViewToggleComponent.prototype, "checked", {
            get: function () {
                return this.state;
            },
            set: function (state) {
                this.state = state;
            },
            enumerable: false,
            configurable: true
        });
        WarpViewToggleComponent.prototype.ngOnInit = function () {
            this.state = this.checked;
        };
        WarpViewToggleComponent.prototype.switched = function () {
            this.state = !this.state;
            this.stateChange.emit({ state: this.state, id: this.el.nativeElement.id });
        };
        return WarpViewToggleComponent;
    }());
    WarpViewToggleComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-toggle',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"container\">\n  <div class=\"text\">{{text1}}</div>\n  <label class=\"switch\">\n    <input type=\"checkbox\" class=\"switch-input\" [checked]=\"state\" (click)=\"switched()\"/>\n    <span class=\"switch-label\"></span>\n    <span class=\"switch-handle\"></span>\n  </label>\n  <div class=\"text\">{{text2}}</div>\n</div>\n",
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host .switch{border-radius:var(--warp-view-switch-radius);cursor:pointer;display:block;height:var(--warp-view-switch-height);margin-bottom:auto;margin-top:auto;padding:3px;position:relative;width:var(--warp-view-switch-width)}:host .switch-input{display:none}:host .switch-label{background:var(--warp-view-switch-inset-color);border-radius:inherit;box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);display:block;height:inherit;position:relative;text-transform:uppercase}:host .switch-input:checked~.switch-label{background:var(--warp-view-switch-inset-checked-color);box-shadow:inset 0 1px 2px rgba(0,0,0,.15),inset 0 0 3px rgba(0,0,0,.2)}:host .switch-handle{background:var(--warp-view-switch-handle-color);border-radius:100%;box-shadow:1px 1px 5px rgba(0,0,0,.2);height:calc(var(--warp-view-switch-height) - 2px);left:4px;position:absolute;top:4px;width:calc(var(--warp-view-switch-height) - 2px)}:host .switch-input:checked~.switch-handle{background:var(--warp-view-switch-handle-checked-color);box-shadow:-1px 1px 5px rgba(0,0,0,.2);left:calc(var(--warp-view-switch-width) - var(--warp-view-switch-height) - 2px)}:host .switch-handle,:host .switch-label{-moz-transition:All .3s ease;-o-transition:All .3s ease;-webkit-transition:All .3s ease;transition:All .3s ease}:host .container{display:flex}:host .text{color:var(--warp-view-font-color);padding:7px}"]
                },] }
    ];
    WarpViewToggleComponent.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };
    WarpViewToggleComponent.propDecorators = {
        checked: [{ type: i0.Input, args: ['checked',] }],
        text1: [{ type: i0.Input, args: ['text1',] }],
        text2: [{ type: i0.Input, args: ['text2',] }],
        stateChange: [{ type: i0.Output, args: ['stateChange',] }]
    };

    var WarpViewBarComponent = /** @class */ (function (_super) {
        __extends(WarpViewBarComponent, _super);
        function WarpViewBarComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.layout = {
                showlegend: false,
                xaxis: {},
                yaxis: {
                    exponentformat: 'none',
                    fixedrange: true,
                    showline: true
                },
                margin: {
                    t: 10,
                    b: 40,
                    r: 10,
                    l: 50
                }
            };
            _this.LOG = new Logger(WarpViewBarComponent, _this._debug);
            return _this;
        }
        WarpViewBarComponent.prototype.ngOnInit = function () {
            this.drawChart();
        };
        WarpViewBarComponent.prototype.update = function (options) {
            this.drawChart();
        };
        WarpViewBarComponent.prototype.drawChart = function () {
            if (!this.initChart(this.el)) {
                return;
            }
            this.plotlyConfig.scrollZoom = true;
            this.buildGraph();
        };
        WarpViewBarComponent.prototype.convert = function (data) {
            var _this = this;
            var gtsList = [];
            if (GTSLib.isArray(data.data)) {
                data.data = GTSLib.flatDeep(data.data);
                this.LOG.debug(['convert', 'isArray']);
                if (data.data.length > 0 && GTSLib.isGts(data.data[0])) {
                    this.LOG.debug(['convert', 'isArray 2']);
                    gtsList = GTSLib.flattenGtsIdArray(data.data, 0).res;
                }
                else {
                    this.LOG.debug(['convert', 'isArray 3']);
                    gtsList = data.data;
                }
            }
            else {
                this.LOG.debug(['convert', 'not array']);
                gtsList = [data.data];
            }
            this.LOG.debug(['convert', 'gtsList'], gtsList);
            var dataset = [];
            gtsList.forEach(function (gts, i) {
                _this.LOG.debug(['convert', 'gts item'], gts);
                if (gts.v) {
                    Timsort.sort(gts.v, function (a, b) { return a[0] - b[0]; });
                    var label = GTSLib.serializeGtsMetadata(gts);
                    var c = ColorLib.getColor(gts.id || i, _this._options.scheme);
                    var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                    var series_1 = {
                        type: 'bar',
                        mode: 'lines+markers',
                        name: label,
                        text: label,
                        orientation: _this._options.horizontal ? 'h' : 'v',
                        x: [],
                        y: [],
                        hoverinfo: 'none',
                        marker: {
                            color: ColorLib.transparentize(color),
                            line: {
                                color: color,
                                width: 1
                            }
                        }
                    };
                    gts.v.forEach(function (value) {
                        var ts = value[0];
                        if (!_this._options.horizontal) {
                            series_1.y.push(value[value.length - 1]);
                            if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                                series_1.x.push(ts);
                            }
                            else {
                                series_1.x.push(GTSLib.toISOString(ts, _this.divider, _this._options.timeZone));
                            }
                        }
                        else {
                            series_1.x.push(value[value.length - 1]);
                            if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                                series_1.y.push(ts);
                            }
                            else {
                                series_1.y.push(GTSLib.toISOString(ts, _this.divider, _this._options.timeZone));
                            }
                        }
                    });
                    dataset.push(series_1);
                }
                else {
                    _this._options.timeMode = 'custom';
                    _this.LOG.debug(['convert', 'gts'], gts);
                    (gts.columns || []).forEach(function (label, index) {
                        var c = ColorLib.getColor(gts.id || index, _this._options.scheme);
                        var color = ((data.params || [])[index] || { datasetColor: c }).datasetColor || c;
                        var series = {
                            type: 'bar',
                            mode: 'lines+markers',
                            name: label,
                            text: label,
                            orientation: _this._options.horizontal ? 'h' : 'v',
                            x: [],
                            y: [],
                            hoverinfo: 'none',
                            marker: {
                                color: ColorLib.transparentize(color),
                                line: {
                                    color: color,
                                    width: 1
                                }
                            }
                        };
                        if (_this._options.horizontal) {
                            (gts.rows || []).forEach(function (r) {
                                series.y.unshift(r[0]);
                                series.x.push(r[index + 1]);
                            });
                        }
                        else {
                            (gts.rows || []).forEach(function (r) {
                                series.x.push(r[0]);
                                series.y.push(r[index + 1]);
                            });
                        }
                        dataset.push(series);
                    });
                }
            });
            this.LOG.debug(['convert', 'dataset'], dataset, this._options.horizontal);
            return dataset;
        };
        WarpViewBarComponent.prototype.buildGraph = function () {
            this.LOG.debug(['buildGraph', 'this.layout'], this.responsive);
            this.LOG.debug(['buildGraph', 'this.layout'], this.layout);
            this.LOG.debug(['buildGraph', 'this.plotlyConfig'], this.plotlyConfig);
            this.layout.showlegend = this._showLegend;
            this.layout.barmode = this._options.stacked ? 'stack' : 'group';
            this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
            this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
            this.loading = false;
        };
        return WarpViewBarComponent;
    }(WarpViewComponent));
    WarpViewBarComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-bar',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display or wrong data format.</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                 [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                 className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                 [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                 [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"wv-tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;display:none;font-size:10px;height:auto!important;left:-1000px;max-width:50%;min-width:100px;padding:10px;pointer-events:none;position:absolute;text-align:left;width:auto;z-index:999}.wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}:host{display:block;height:100%}:host .modebar-group path{fill:var(--warp-view-font-color)}:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}"]
                },] }
    ];
    WarpViewBarComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };

    var WarpViewBubbleComponent = /** @class */ (function (_super) {
        __extends(WarpViewBubbleComponent, _super);
        function WarpViewBubbleComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.layout = {
                showlegend: false,
                xaxis: {},
                hovermode: 'closest',
                hoverdistance: 20,
                yaxis: {},
                margin: {
                    t: 10,
                    b: 25,
                    r: 10,
                    l: 50
                }
            };
            _this.LOG = new Logger(WarpViewBubbleComponent, _this._debug);
            return _this;
        }
        WarpViewBubbleComponent.prototype.ngOnInit = function () {
            this.drawChart();
        };
        WarpViewBubbleComponent.prototype.update = function (options) {
            this.drawChart();
        };
        WarpViewBubbleComponent.prototype.drawChart = function () {
            if (!this.initChart(this.el)) {
                return;
            }
            this.plotlyConfig.scrollZoom = true;
            this.buildGraph();
        };
        WarpViewBubbleComponent.prototype.convert = function (data) {
            var _this = this;
            var dataset = [];
            GTSLib.flatDeep(data.data).forEach(function (gts, i) {
                var label = Object.keys(gts)[0];
                var c = ColorLib.getColor(gts.id || i, _this._options.scheme);
                var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                var series = {
                    type: 'scattergl',
                    mode: 'markers',
                    name: label,
                    text: label,
                    x: [],
                    y: [],
                    hoverinfo: 'none',
                    marker: {
                        color: ColorLib.transparentize(color),
                        line: {
                            color: color
                        },
                        size: []
                    }
                };
                if (GTSLib.isGts(gts)) {
                    var ticks = gts.v.map(function (t) { return t[0]; });
                    var values = gts.v.map(function (t) { return t[t.length - 1]; });
                    var sizes = new Array(gts.v.length).fill(10);
                    if (_this._options.timeMode === 'timestamp') {
                        series.x = ticks;
                    }
                    else {
                        series.x = ticks.map(function (t) { return GTSLib.toISOString(t, _this.divider, _this._options.timeZone); });
                    }
                    series.y = values;
                    series.marker.size = sizes;
                }
                else {
                    gts[label].forEach(function (value) {
                        series.y.push(value[0]);
                        series.x.push(value[1]);
                        series.marker.size.push(value[2]);
                    });
                }
                dataset.push(series);
            });
            this.noData = dataset.length === 0;
            this.LOG.debug(['convert', 'dataset'], dataset);
            return dataset;
        };
        WarpViewBubbleComponent.prototype.buildGraph = function () {
            this.LOG.debug(['drawChart', 'this.responsive'], this._responsive);
            this.LOG.debug(['drawChart', 'this.layout'], this.layout);
            this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
            this.layout.showlegend = this.showLegend;
            this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
            this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
            this.loading = false;
        };
        return WarpViewBubbleComponent;
    }(WarpViewComponent));
    WarpViewBubbleComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-bubble',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display or wrong data format.</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                 [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                 className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                 [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                 [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"wv-tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;display:none;font-size:10px;height:auto!important;left:-1000px;max-width:50%;min-width:100px;padding:10px;pointer-events:none;position:absolute;text-align:left;width:auto;z-index:999}.wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}:host{display:block}:host,:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}"]
                },] }
    ];
    WarpViewBubbleComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };

    var WarpViewDatagridComponent = /** @class */ (function (_super) {
        __extends(WarpViewDatagridComponent, _super);
        function WarpViewDatagridComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.elemsCount = 15;
            // tslint:disable-next-line:variable-name
            _this._tabularData = [];
            _this.LOG = new Logger(WarpViewDatagridComponent, _this._debug);
            return _this;
        }
        WarpViewDatagridComponent.prototype.ngOnInit = function () {
            this.drawChart();
        };
        WarpViewDatagridComponent.prototype.update = function (options) {
            this.drawChart();
        };
        WarpViewDatagridComponent.prototype.drawChart = function () {
            this.loading = false;
            this.chartDraw.emit();
            if (!this.initChart(this.el)) {
                return;
            }
        };
        WarpViewDatagridComponent.prototype.getHeaderParam = function (i, j, key, def) {
            return this._data.params && this._data.params[i] && this._data.params[i][key] && this._data.params[i][key][j]
                ? this._data.params[i][key][j]
                : this._data.globalParams && this._data.globalParams[key] && this._data.globalParams[key][j]
                    ? this._data.globalParams[key][j]
                    : def;
        };
        WarpViewDatagridComponent.prototype.convert = function (data) {
            if (GTSLib.isArray(data.data)) {
                var dataList = GTSLib.flatDeep(this._data.data);
                this.LOG.debug(['convert', 'isArray'], dataList);
                if (data.data.length > 0 && GTSLib.isGts(dataList[0])) {
                    this._tabularData = this.parseData(dataList);
                }
                else {
                    this._tabularData = this.parseCustomData(dataList);
                }
            }
            else {
                this._tabularData = this.parseCustomData([data.data]);
            }
            return [];
        };
        WarpViewDatagridComponent.prototype.parseCustomData = function (data) {
            var flatData = [];
            data.forEach(function (d) {
                var dataSet = {
                    name: d.title || '',
                    values: d.rows,
                    headers: d.columns,
                };
                flatData.push(dataSet);
            });
            this.LOG.debug(['parseCustomData', 'flatData'], flatData);
            return flatData;
        };
        WarpViewDatagridComponent.prototype.parseData = function (data) {
            var _this = this;
            var flatData = [];
            this.LOG.debug(['parseData'], data);
            data.forEach(function (d, i) {
                var dataSet = {
                    name: '',
                    values: [],
                    headers: []
                };
                if (GTSLib.isGts(d)) {
                    _this.LOG.debug(['parseData', 'isGts'], d);
                    dataSet.name = GTSLib.serializeGtsMetadata(d);
                    dataSet.values = d.v.map(function (v) { return [_this.formatDate(v[0])].concat(v.slice(1, v.length)); });
                }
                else {
                    _this.LOG.debug(['parseData', 'is not a Gts'], d);
                    dataSet.values = GTSLib.isArray(d) ? d : [d];
                }
                dataSet.headers = [_this.getHeaderParam(i, 0, 'headers', 'Date')];
                if (d.v && d.v.length > 0 && d.v[0].length > 2) {
                    dataSet.headers.push(_this.getHeaderParam(i, 1, 'headers', 'Latitude'));
                }
                if (d.v && d.v.length > 0 && d.v[0].length > 3) {
                    dataSet.headers.push(_this.getHeaderParam(i, 2, 'headers', 'Longitude'));
                }
                if (d.v && d.v.length > 0 && d.v[0].length > 4) {
                    dataSet.headers.push(_this.getHeaderParam(i, 3, 'headers', 'Elevation'));
                }
                if (d.v && d.v.length > 0) {
                    dataSet.headers.push(_this.getHeaderParam(i, d.v[0].length - 1, 'headers', 'Value'));
                }
                if (dataSet.values.length > 0) {
                    flatData.push(dataSet);
                }
            });
            this.LOG.debug(['parseData', 'flatData'], flatData, this._options.timeMode);
            return flatData;
        };
        WarpViewDatagridComponent.prototype.formatDate = function (date) {
            return this._options.timeMode === 'date' ? GTSLib.toISOString(date, this.divider, this._options.timeZone) : date.toString();
        };
        return WarpViewDatagridComponent;
    }(WarpViewComponent));
    WarpViewDatagridComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-datagrid',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" style=\"overflow: auto; height: 100%\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-paginable\n      *ngFor=\"let data of _tabularData\"\n      [data]=\"data\" [options]=\"_options\"\n      [debug]=\"debug\"></warpview-paginable>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}"]
                },] }
    ];
    WarpViewDatagridComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewDatagridComponent.propDecorators = {
        elemsCount: [{ type: i0.Input, args: ['elemsCount',] }]
    };

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
    var WarpViewPaginableComponent = /** @class */ (function () {
        function WarpViewPaginableComponent() {
            this.elemsCount = 15;
            this.windowed = 5;
            this.page = 0;
            this.pages = [];
            this.displayedValues = [];
            // tslint:disable-next-line:variable-name
            this._debug = false;
            // tslint:disable-next-line:variable-name
            this._options = Object.assign(Object.assign({}, new Param()), {
                timeMode: 'date',
                timeZone: 'UTC',
                timeUnit: 'us',
                bounds: {}
            });
            this.LOG = new Logger(WarpViewPaginableComponent, this.debug);
        }
        Object.defineProperty(WarpViewPaginableComponent.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (debug) {
                this._debug = debug;
                this.LOG.setDebug(debug);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewPaginableComponent.prototype, "options", {
            set: function (options) {
                if (!deepEqual__default['default'](options, this._options)) {
                    this.drawGridData();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewPaginableComponent.prototype, "data", {
            set: function (data) {
                if (data) {
                    this._data = data;
                    this.drawGridData();
                }
            },
            enumerable: false,
            configurable: true
        });
        WarpViewPaginableComponent.prototype.goto = function (page) {
            this.page = page;
            this.drawGridData();
        };
        WarpViewPaginableComponent.prototype.next = function () {
            this.page = Math.min(this.page + 1, this._data.values.length - 1);
            this.drawGridData();
        };
        WarpViewPaginableComponent.prototype.prev = function () {
            this.page = Math.max(this.page - 1, 0);
            this.drawGridData();
        };
        WarpViewPaginableComponent.prototype.drawGridData = function () {
            this._options = ChartLib.mergeDeep(this._options, this.options);
            this.LOG.debug(['drawGridData', '_options'], this._options);
            if (!this._data) {
                return;
            }
            this.pages = [];
            for (var i = 0; i < (this._data.values || []).length / this.elemsCount; i++) {
                this.pages.push(i);
            }
            this.displayedValues = (this._data.values || []).slice(Math.max(0, this.elemsCount * this.page), Math.min(this.elemsCount * (this.page + 1), (this._data.values || []).length));
            this.LOG.debug(['drawGridData', '_data'], this._data);
        };
        WarpViewPaginableComponent.prototype.decodeURIComponent = function (str) {
            return decodeURIComponent(str);
        };
        WarpViewPaginableComponent.prototype.ngOnInit = function () {
            this.drawGridData();
        };
        WarpViewPaginableComponent.prototype.formatLabel = function (name) {
            return GTSLib.formatLabel(name);
        };
        return WarpViewPaginableComponent;
    }());
    WarpViewPaginableComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-paginable',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n  <div class=\"heading\" [innerHTML]=\"formatLabel(_data.name)\"></div>\n  <table>\n    <thead>\n    <th *ngFor=\"let h of _data.headers\">{{h}}</th>\n    </thead>\n    <tbody>\n    <tr *ngFor=\"let value of displayedValues; even as isEven; odd as isOdd\" [ngClass]=\"{ odd: isOdd, even: isEven}\">\n      <td *ngFor=\"let v of value\">\n        <span [innerHTML]=\"v\"></span>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n  <div class=\"center\">\n    <div class=\"pagination\">\n      <div class=\"prev hoverable\" (click)=\"prev()\" *ngIf=\"page !== 0\">&lt;</div>\n      <div class=\"index disabled\" *ngIf=\"page - windowed > 0\">...</div>\n      <span *ngFor=\"let c of pages\">\n        <span *ngIf=\" c >= page - windowed && c <= page + windowed\"\n             [ngClass]=\"{ index: true, hoverable: page !== c, active: page === c}\" (click)=\"goto(c)\">{{c}}</span>\n      </span>\n      <div class=\"index disabled\" *ngIf=\"page + windowed < pages.length\">...</div>\n      <div class=\"next hoverable\" (click)=\"next()\" *ngIf=\"page + windowed < (_data.values ||\u00A0[]).length - 1\">&gt;</div>\n    </div>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host table{color:var(--warp-view-font-color);width:100%}:host table td,:host table th{padding:var(--warp-view-datagrid-cell-padding)}:host table .odd{background-color:var(--warp-view-datagrid-odd-bg-color);color:var(--warp-view-datagrid-odd-color)}:host table .even{background-color:var(--warp-view-datagrid-even-bg-color);color:var(--warp-view-datagrid-even-color)}:host .center{text-align:center}:host .center .pagination{display:inline-block}:host .center .pagination .index,:host .center .pagination .next,:host .center .pagination .prev{background-color:var(--warp-view-pagination-bg-color);border:1px solid var(--warp-view-pagination-border-color);color:var(--warp-view-font-color);cursor:pointer;float:left;margin:0;padding:8px 16px;text-decoration:none;transition:background-color .3s}:host .center .pagination .index.active,:host .center .pagination .next.active,:host .center .pagination .prev.active{background-color:var(--warp-view-pagination-active-bg-color);border:1px solid var(--warp-view-pagination-active-border-color);color:var(--warp-view-pagination-active-color)}:host .center .pagination .index.hoverable:hover,:host .center .pagination .next.hoverable:hover,:host .center .pagination .prev.hoverable:hover{background-color:var(--warp-view-pagination-hover-bg-color);border:1px solid var(--warp-view-pagination-hover-border-color);color:var(--warp-view-pagination-hover-color)}:host .center .pagination .index.disabled,:host .center .pagination .next.disabled,:host .center .pagination .prev.disabled{color:var(--warp-view-pagination-disabled-color);cursor:auto}:host .round{background-color:#bbb;border:2px solid #454545;border-radius:50%;display:inline-block;height:12px;width:12px}:host ul{list-style:none}"]
                },] }
    ];
    WarpViewPaginableComponent.ctorParameters = function () { return []; };
    WarpViewPaginableComponent.propDecorators = {
        debug: [{ type: i0.Input, args: ['debug',] }],
        options: [{ type: i0.Input, args: ['options',] }],
        data: [{ type: i0.Input, args: ['data',] }],
        elemsCount: [{ type: i0.Input, args: ['elemsCount',] }],
        windowed: [{ type: i0.Input, args: ['windowed',] }]
    };

    /**
     *
     */
    var WarpViewDisplayComponent = /** @class */ (function (_super) {
        __extends(WarpViewDisplayComponent, _super);
        function WarpViewDisplayComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.toDisplay = '';
            _this.defOptions = {
                timeMode: 'custom'
            };
            _this.LOG = new Logger(WarpViewDisplayComponent, _this._debug);
            return _this;
        }
        WarpViewDisplayComponent.prototype.ngOnInit = function () {
            this.drawChart();
        };
        WarpViewDisplayComponent.prototype.ngOnDestroy = function () {
            if (this.timer) {
                clearInterval(this.timer);
            }
        };
        WarpViewDisplayComponent.prototype.update = function (options, refresh) {
            this.drawChart();
            this.flexFont();
        };
        WarpViewDisplayComponent.prototype.drawChart = function () {
            this.LOG.debug(['drawChart'], this._options, this.defOptions);
            this.initChart(this.el);
            this._options = ChartLib.mergeDeep(this.defOptions, this._options);
            this.LOG.debug(['drawChart', 'afterInit'], this._options, this.defOptions, this.height);
            this.LOG.debug(['drawChart'], this._data, this.toDisplay);
            this.flexFont();
            this.chartDraw.emit();
        };
        WarpViewDisplayComponent.prototype.convert = function (data) {
            this._options = ChartLib.mergeDeep(this.defOptions, this._options);
            this.LOG.debug(['convert'], this._options.timeMode);
            var display;
            if (this._data.data) {
                display = GTSLib.isArray(this._data.data) ? this._data.data[0] : this._data.data;
            }
            else {
                display = GTSLib.isArray(this._data) ? this._data[0] : this._data;
            }
            switch (this._options.timeMode) {
                case 'date':
                    this.toDisplay = GTSLib.toISOString(parseInt(display, 10), this.divider, this._options.timeZone);
                    break;
                case 'duration':
                    var start = GTSLib.toISOString(parseInt(display, 10), this.divider, this._options.timeZone);
                    this.displayDuration(moment__default['default'](start));
                    break;
                case 'custom':
                case 'timestamp':
                    this.toDisplay = display;
            }
            return [];
        };
        WarpViewDisplayComponent.prototype.getStyle = function () {
            if (!this._options) {
                return {};
            }
            else {
                var style = { 'background-color': this._options.bgColor || 'transparent' };
                if (this._options.fontColor) {
                    style.color = this._options.fontColor;
                }
                return style;
            }
        };
        WarpViewDisplayComponent.prototype.flexFont = function () {
            if (!!this.wrapper) {
                this.LOG.debug(['flexFont'], this.height);
                if (this.fitties) {
                    this.fitties.unsubscribe();
                }
                this.fitties = fitty__default['default'](this.wrapper.nativeElement, {
                    maxSize: this.el.nativeElement.parentElement.clientHeight * 0.80,
                    minSize: 14
                });
                this.LOG.debug(['flexFont'], 'ok', this.el.nativeElement.parentElement.clientHeight);
                this.fitties.fit();
                this.loading = false;
            }
        };
        WarpViewDisplayComponent.prototype.displayDuration = function (start) {
            var _this = this;
            this.timer = setInterval(function () {
                var now = moment__default['default']();
                _this.toDisplay = moment__default['default'].duration(start.diff(now)).humanize(true);
            }, 1000);
        };
        return WarpViewDisplayComponent;
    }(WarpViewComponent));
    WarpViewDisplayComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-display',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"chart-container\" (resized)=\"flexFont()\" [ngStyle]=\"getStyle()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <div class=\"value\" #wrapper [hidden]=\"loading\">\n    <span [innerHTML]=\"toDisplay\"></span><small>{{unit}}</small>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);text-align:center;width:100%}.noData,:host{position:relative}:host{color:var(--warp-view-font-color);height:var(--warp-view-chart-height,100%);overflow:hidden;width:var(--warp-view-chart-width,100%)}:host .chart-container{display:flex;height:calc(100% - 20px);justify-content:center;justify-items:stretch;min-height:100%;overflow:hidden;text-align:center;width:100%}:host .chart-container .value{-ms-grid-row-align:center;align-self:center;display:inline-block;overflow:hidden;padding:10px;text-align:center;vertical-align:middle;white-space:nowrap}:host .chart-container .value span{min-height:100%}:host .chart-container .value small{font-size:.5em}"]
                },] }
    ];
    WarpViewDisplayComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewDisplayComponent.propDecorators = {
        wrapper: [{ type: i0.ViewChild, args: ['wrapper', { static: true },] }]
    };

    /**
     *
     */
    var WarpViewDrillDownComponent = /** @class */ (function (_super) {
        __extends(WarpViewDrillDownComponent, _super);
        function WarpViewDrillDownComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.parentWidth = -1;
            _this.LOG = new Logger(WarpViewDrillDownComponent, _this._debug);
            return _this;
        }
        WarpViewDrillDownComponent.prototype.ngAfterViewInit = function () {
            this.drawChart();
        };
        WarpViewDrillDownComponent.prototype.update = function (options, refresh) {
            this.drawChart();
        };
        WarpViewDrillDownComponent.prototype.onResize = function () {
            var _this = this;
            if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth || this.parentWidth <= 0) {
                this.parentWidth = this.el.nativeElement.parentElement.clientWidth;
                clearTimeout(this.resizeTimer);
                this.resizeTimer = setTimeout(function () {
                    if (_this.el.nativeElement.parentElement.clientWidth > 0) {
                        _this.LOG.debug(['onResize'], _this.el.nativeElement.parentElement.clientWidth);
                        _this.drawChart();
                    }
                    else {
                        _this.onResize();
                    }
                }, 150);
            }
        };
        WarpViewDrillDownComponent.prototype.drawChart = function () {
            this.loading = false;
            this.chartDraw.emit();
            if (!this.initChart(this.el)) {
                return;
            }
        };
        WarpViewDrillDownComponent.prototype.convert = function (data) {
            var dataList = this._data.data;
            this.heatMapData = this.parseData(GTSLib.flatDeep(dataList));
            return [];
        };
        WarpViewDrillDownComponent.prototype.parseData = function (dataList) {
            var _this = this;
            var details = [];
            var values = [];
            var dates = [];
            var data = {};
            var reducer = function (accumulator, currentValue) { return accumulator + parseInt(currentValue, 10); };
            this.LOG.debug(['parseData'], dataList);
            dataList.forEach(function (gts, i) {
                var name = GTSLib.serializeGtsMetadata(gts);
                gts.v.forEach(function (v) {
                    var refDate = moment__default$1['default'].utc(v[0] / 1000).startOf('day').toISOString();
                    if (!data[refDate]) {
                        data[refDate] = [];
                    }
                    if (!values[refDate]) {
                        values[refDate] = [];
                    }
                    dates.push(v[0] / 1000);
                    values[refDate].push(v[v.length - 1]);
                    data[refDate].push({
                        name: name,
                        date: v[0] / 1000,
                        value: v[v.length - 1],
                        color: ColorLib.getColor(i, _this._options.scheme),
                        id: i
                    });
                });
            });
            Object.keys(data).forEach(function (d) {
                details.push({
                    date: moment__default$1['default'].utc(d),
                    total: values[d].reduce(reducer),
                    details: data[d],
                    summary: []
                });
            });
            return details;
        };
        return WarpViewDrillDownComponent;
    }(WarpViewComponent));
    WarpViewDrillDownComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-drill-down',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <calendar-heatmap [data]=\"heatMapData\" overview=\"global\"\n                      [debug]=\"debug\"\n                      [minColor]=\"_options.minColor\"\n                      [maxColor]=\"_options.maxColor\"></calendar-heatmap>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);text-align:center}.noData,:host .wrapper{position:relative;width:100%}:host .wrapper{height:100%}"]
                },] }
    ];
    WarpViewDrillDownComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewDrillDownComponent.propDecorators = {
        onResize: [{ type: i0.HostListener, args: ['window:resize',] }]
    };

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
    /**
     *
     */
    var Datum = /** @class */ (function () {
        function Datum() {
        }
        return Datum;
    }());
    /**
     *
     */
    var Summary = /** @class */ (function () {
        function Summary() {
        }
        return Summary;
    }());
    /**
     *
     */
    var Detail = /** @class */ (function () {
        function Detail() {
        }
        return Detail;
    }());

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
    var CalendarHeatmapComponent = /** @class */ (function () {
        function CalendarHeatmapComponent(el) {
            this.el = el;
            this.width = ChartLib.DEFAULT_WIDTH;
            this.height = ChartLib.DEFAULT_HEIGHT;
            this.overview = 'global';
            this.handler = new i0.EventEmitter();
            this.change = new i0.EventEmitter();
            // tslint:disable-next-line:variable-name
            this._debug = false;
            // tslint:disable-next-line:variable-name
            this._minColor = CalendarHeatmapComponent.DEF_MIN_COLOR;
            // tslint:disable-next-line:variable-name
            this._maxColor = CalendarHeatmapComponent.DEF_MAX_COLOR;
            // Defaults
            this.gutter = 5;
            this.gWidth = 1000;
            this.gHeight = 200;
            this.itemSize = 10;
            this.labelPadding = 40;
            this.transitionDuration = 250;
            this.inTransition = false;
            // Tooltip defaults
            this.tooltipWidth = 450;
            this.tooltipPadding = 15;
            // Overview defaults
            this.history = ['global'];
            this.selected = new Datum();
            this.parentWidth = -1;
            this.getTooltip = function (d) {
                var tooltipHtml = '<div class="header"><strong>' + d.date.format('dddd, MMM Do YYYY HH:mm') + '</strong></div><ul>';
                (d.summary || []).forEach(function (s) {
                    tooltipHtml += "<li>\n  <div class=\"round\" style=\"background-color:" + ColorLib.transparentize(s.color) + "; border-color:" + s.color + "\"></div>\n" + GTSLib.formatLabel(s.name) + ": " + s.total + "</li>";
                });
                if (d.total !== undefined && d.name) {
                    tooltipHtml += "<li><div class=\"round\"\nstyle=\"background-color: " + ColorLib.transparentize(d.color) + "; border-color: " + d.color + "\"\n></div> " + GTSLib.formatLabel(d.name) + ": " + d.total + "</li>";
                }
                tooltipHtml += '</ul>';
                return tooltipHtml;
            };
            this.LOG = new Logger(CalendarHeatmapComponent, this.debug);
        }
        Object.defineProperty(CalendarHeatmapComponent.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (debug) {
                this._debug = debug;
                this.LOG.setDebug(debug);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CalendarHeatmapComponent.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (data) {
                this.LOG.debug(['data'], data);
                if (data) {
                    this._data = data;
                    this.calculateDimensions();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CalendarHeatmapComponent.prototype, "minColor", {
            get: function () {
                return this._minColor;
            },
            set: function (minColor) {
                this._minColor = minColor;
                this.calculateDimensions();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CalendarHeatmapComponent.prototype, "maxColor", {
            get: function () {
                return this._maxColor;
            },
            set: function (maxColor) {
                this._maxColor = maxColor;
                this.calculateDimensions();
            },
            enumerable: false,
            configurable: true
        });
        CalendarHeatmapComponent.getNumberOfWeeks = function () {
            var dayIndex = Math.round((+moment__default$1['default'].utc() - +moment__default$1['default'].utc().subtract(1, 'year').startOf('week')) / 86400000);
            return Math.trunc(dayIndex / 7) + 1;
        };
        CalendarHeatmapComponent.prototype.onResize = function () {
            if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth) {
                this.calculateDimensions();
            }
        };
        CalendarHeatmapComponent.prototype.ngAfterViewInit = function () {
            this.chart = this.div.nativeElement;
            // Initialize svg element
            this.svg = d3Selection.select(this.chart).append('svg').attr('class', 'svg');
            // Initialize main svg elements
            this.items = this.svg.append('g');
            this.labels = this.svg.append('g');
            this.buttons = this.svg.append('g');
            // Add tooltip to the same element as main svg
            this.tooltip = d3Selection.select(this.chart)
                .append('div')
                .attr('class', 'heatmap-tooltip')
                .style('opacity', 0);
            // Calculate chart dimensions
            this.calculateDimensions();
            //  this.drawChart();
        };
        CalendarHeatmapComponent.prototype.calculateDimensions = function () {
            var _this = this;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(function () {
                if (_this.el.nativeElement.parentElement.clientWidth !== 0) {
                    _this.gWidth = _this.chart.clientWidth < 1000 ? 1000 : _this.chart.clientWidth;
                    _this.itemSize = ((_this.gWidth - _this.labelPadding) / CalendarHeatmapComponent.getNumberOfWeeks() - _this.gutter);
                    _this.gHeight = _this.labelPadding + 7 * (_this.itemSize + _this.gutter);
                    _this.svg.attr('width', _this.gWidth).attr('height', _this.gHeight);
                    _this.LOG.debug(['calculateDimensions'], _this._data);
                    if (!!_this._data && !!_this._data[0] && !!_this._data[0].summary) {
                        _this.drawChart();
                    }
                }
                else {
                    _this.calculateDimensions();
                }
            }, 250);
        };
        CalendarHeatmapComponent.prototype.groupBy = function (xs, key) {
            return xs.reduce(function (rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        };
        CalendarHeatmapComponent.prototype.updateDataSummary = function () {
            // Get daily summary if that was not provided
            if (!this._data[0].summary) {
                this._data.map(function (d) {
                    var summary = d.details.reduce(function (uniques, project) {
                        if (!uniques[project.name]) {
                            uniques[project.name] = { value: project.value };
                        }
                        else {
                            uniques[project.name].value += project.value;
                        }
                        return uniques;
                    }, {});
                    var unsortedSummary = Object.keys(summary).map(function (key) {
                        return {
                            name: key,
                            total: summary[key].value
                        };
                    });
                    d.summary = unsortedSummary.sort(function (a, b) {
                        return b.total - a.total;
                    });
                    return d;
                });
            }
        };
        CalendarHeatmapComponent.prototype.drawChart = function () {
            if (!this.svg || !this._data) {
                return;
            }
            this.LOG.debug(['drawChart'], [this.overview, this.selected]);
            switch (this.overview) {
                case 'global':
                    this.drawGlobalOverview();
                    this.change.emit({
                        overview: this.overview,
                        start: moment__default$1['default'](this._data[0].date),
                        end: moment__default$1['default'](this._data[this._data.length - 1].date),
                    });
                    break;
                case 'year':
                    this.drawYearOverview();
                    this.change.emit({
                        overview: this.overview,
                        start: moment__default$1['default'](this.selected.date).startOf('year'),
                        end: moment__default$1['default'](this.selected.date).endOf('year'),
                    });
                    break;
                case 'month':
                    this.drawMonthOverview();
                    this.change.emit({
                        overview: this.overview,
                        start: moment__default$1['default'](this.selected.date).startOf('month'),
                        end: moment__default$1['default'](this.selected.date).endOf('month'),
                    });
                    break;
                case 'week':
                    this.drawWeekOverview();
                    this.change.emit({
                        overview: this.overview,
                        start: moment__default$1['default'](this.selected.date).startOf('week'),
                        end: moment__default$1['default'](this.selected.date).endOf('week'),
                    });
                    break;
                case 'day':
                    this.drawDayOverview();
                    this.change.emit({
                        overview: this.overview,
                        start: moment__default$1['default'](this.selected.date).startOf('day'),
                        end: moment__default$1['default'](this.selected.date).endOf('day'),
                    });
                    break;
                default:
                    break;
            }
        };
        CalendarHeatmapComponent.prototype.drawGlobalOverview = function () {
            var _this = this;
            // Add current overview to the history
            if (this.history[this.history.length - 1] !== this.overview) {
                this.history.push(this.overview);
            }
            // Define start and end of the dataset
            var startPeriod = moment__default$1['default'].utc(this._data[0].date.startOf('y'));
            var endPeriod = moment__default$1['default'].utc(this._data[this._data.length - 1].date.endOf('y'));
            // Define array of years and total values
            var yData = this._data.filter(function (d) { return d.date.isBetween(startPeriod, endPeriod, null, '[]'); });
            yData.forEach(function (d) {
                var summary = [];
                var group = _this.groupBy(d.details, 'name');
                Object.keys(group).forEach(function (k) {
                    summary.push({
                        name: k,
                        total: group[k].reduce(function (acc, o) {
                            return acc + o.value;
                        }, 0),
                        color: group[k][0].color,
                        id: group[k][0].id,
                    });
                });
                d.summary = summary;
            });
            var duration = Math.ceil(moment__default$1['default'].duration(endPeriod.diff(startPeriod)).asYears());
            var scale = [];
            for (var i = 0; i < duration; i++) {
                var d = moment__default$1['default'].utc().year(startPeriod.year() + i).month(0).date(1).startOf('y');
                scale.push(d);
            }
            var yearData = yData.map(function (d) {
                var date = d.date;
                return {
                    date: date,
                    total: yData.reduce(function (prev, current) {
                        if (current.date.year() === date.year()) {
                            prev += current.total;
                        }
                        return prev;
                    }, 0),
                    summary: (function () {
                        var summary = yData.reduce(function (s, data) {
                            if (data.date.year() === date.year()) {
                                data.summary.forEach(function (_summary) {
                                    if (!s[_summary.name]) {
                                        s[_summary.name] = {
                                            total: _summary.total,
                                            color: _summary.color,
                                        };
                                    }
                                    else {
                                        s[_summary.name].total += _summary.total;
                                    }
                                });
                            }
                            return s;
                        }, {});
                        var unsortedSummary = Object.keys(summary).map(function (key) {
                            return {
                                name: key,
                                total: summary[key].total,
                                color: summary[key].color,
                            };
                        });
                        return unsortedSummary.sort(function (a, b) { return b.total - a.total; });
                    })(),
                };
            });
            // Calculate max value of all the years in the dataset
            yearData = GTSLib.cleanArray(yearData);
            var maxValue = d3.max(yearData, function (d) { return d.total; });
            // Define year labels and axis
            var yearLabels = scale.map(function (d) { return d; });
            var yearScale = d3.scaleBand()
                .rangeRound([0, this.gWidth])
                .padding(0.05)
                .domain(yearLabels.map(function (d) { return d.year().toString(); }));
            var color = d3.scaleLinear()
                .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
                .domain([-0.15 * maxValue, maxValue]);
            // Add global data items to the overview
            this.items.selectAll('.item-block-year').remove();
            this.items.selectAll('.item-block-year')
                .data(yearData)
                .enter()
                .append('rect')
                .attr('class', 'item item-block-year')
                .attr('width', function () { return (_this.gWidth - _this.labelPadding) / yearLabels.length - _this.gutter * 5; })
                .attr('height', function () { return _this.gHeight - _this.labelPadding; })
                .attr('transform', function (d) { return 'translate(' + yearScale(d.date.year().toString()) + ',' + _this.tooltipPadding * 2 + ')'; })
                .attr('fill', function (d) { return color(d.total) || CalendarHeatmapComponent.DEF_MAX_COLOR; })
                .on('click', function (d) {
                if (_this.inTransition) {
                    return;
                }
                // Set in_transition flag
                _this.inTransition = true;
                // Set selected date to the one clicked on
                _this.selected = d;
                // Hide tooltip
                _this.hideTooltip();
                // Remove all global overview related items and labels
                _this.removeGlobalOverview();
                // Redraw the chart
                _this.overview = 'year';
                _this.drawChart();
            })
                .style('opacity', 0)
                .on('mouseover', function (d) {
                if (_this.inTransition) {
                    return;
                }
                // Calculate tooltip position
                var x = yearScale(d.date.year().toString()) + _this.tooltipPadding * 2;
                while (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 5)) {
                    x -= 10;
                }
                var y = _this.tooltipPadding * 4;
                // Show tooltip
                _this.tooltip.html(_this.getTooltip(d))
                    .style('left', x + 'px')
                    .style('top', y + 'px')
                    .transition()
                    .duration(_this.transitionDuration / 2)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                _this.hideTooltip();
            })
                .transition()
                .delay(function (d, i) { return _this.transitionDuration * (i + 1) / 10; })
                .duration(function () { return _this.transitionDuration; })
                .ease(d3.easeLinear)
                .style('opacity', 1)
                .call(function (transition, callback) {
                if (transition.empty()) {
                    callback();
                }
                var n = 0;
                transition.each(function () { return ++n; }).on('end', function () {
                    if (!--n) {
                        callback.apply(this, arguments);
                    }
                });
            }, function () { return _this.inTransition = false; });
            // Add year labels
            this.labels.selectAll('.label-year').remove();
            this.labels.selectAll('.label-year')
                .data(yearLabels)
                .enter()
                .append('text')
                .attr('class', 'label label-year')
                .attr('font-size', function () { return Math.floor(_this.labelPadding / 3) + 'px'; })
                .text(function (d) { return d.year(); })
                .attr('x', function (d) { return yearScale(d.year().toString()); })
                .attr('y', this.labelPadding / 2)
                .on('mouseenter', function (yearLabel) {
                if (_this.inTransition) {
                    return;
                }
                _this.items.selectAll('.item-block-year')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', function (d) { return (d.date.year() === yearLabel.year()) ? 1 : 0.1; });
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                _this.items.selectAll('.item-block-year')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            })
                .on('click', function () {
                if (_this.inTransition) {
                    return;
                }
                // Set in_transition flag
                _this.inTransition = true;
                // Set selected year to the one clicked on
                _this.selected = yearData[0];
                // Hide tooltip
                _this.hideTooltip();
                // Remove all global overview related items and labels
                _this.removeGlobalOverview();
                // Redraw the chart
                _this.overview = 'year';
                _this.drawChart();
            });
        };
        /**
         * Draw year overview
         */
        CalendarHeatmapComponent.prototype.drawYearOverview = function () {
            var _this = this;
            // Add current overview to the history
            if (this.history[this.history.length - 1] !== this.overview) {
                this.history.push(this.overview);
            }
            // Define start and end date of the selected year
            var startOfYear = moment__default$1['default'](this.selected.date).startOf('year');
            var endOfYear = moment__default$1['default'](this.selected.date).endOf('year');
            // Filter data down to the selected year
            var yearData = this._data.filter(function (d) { return d.date.isBetween(startOfYear, endOfYear, null, '[]'); });
            yearData.forEach(function (d) {
                var summary = [];
                var group = _this.groupBy(d.details, 'name');
                Object.keys(group).forEach(function (k) {
                    summary.push({
                        name: k,
                        total: group[k].reduce(function (acc, o) {
                            return acc + o.value;
                        }, 0),
                        color: group[k][0].color,
                        id: group[k][0].id,
                    });
                });
                d.summary = summary;
            });
            yearData = GTSLib.cleanArray(yearData);
            // Calculate max value of the year data
            var maxValue = d3.max(yearData, function (d) { return d.total; });
            var color = d3.scaleLinear()
                .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
                .domain([-0.15 * maxValue, maxValue]);
            this.items.selectAll('.item-circle').remove();
            this.items.selectAll('.item-circle')
                .data(yearData)
                .enter()
                .append('rect')
                .attr('class', 'item item-circle').style('opacity', 0)
                .attr('x', function (d) { return _this.calcItemX(d, startOfYear) + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; })
                .attr('y', function (d) { return _this.calcItemY(d) + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; })
                .attr('rx', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('ry', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('width', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('height', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('fill', function (d) { return (d.total > 0) ? color(d.total) : 'transparent'; })
                .on('click', function (d) {
                if (_this.inTransition) {
                    return;
                }
                // Don't transition if there is no data to show
                if (d.total === 0) {
                    return;
                }
                _this.inTransition = true;
                // Set selected date to the one clicked on
                _this.selected = d;
                // Hide tooltip
                _this.hideTooltip();
                // Remove all year overview related items and labels
                _this.removeYearOverview();
                // Redraw the chart
                _this.overview = 'day';
                _this.drawChart();
            })
                .on('mouseover', function (d) {
                if (_this.inTransition) {
                    return;
                }
                // Pulsating animation
                var circle = d3Selection.select(d3Selection.event.currentTarget);
                var repeat = function () {
                    circle.transition()
                        .duration(_this.transitionDuration)
                        .ease(d3.easeLinear)
                        .attr('x', function (data) { return _this.calcItemX(data, startOfYear) - (_this.itemSize * 1.1 - _this.itemSize) / 2; })
                        .attr('y', function (data) { return _this.calcItemY(data) - (_this.itemSize * 1.1 - _this.itemSize) / 2; })
                        .attr('width', _this.itemSize * 1.1)
                        .attr('height', _this.itemSize * 1.1)
                        .transition()
                        .duration(_this.transitionDuration)
                        .ease(d3.easeLinear)
                        .attr('x', function (data) { return _this.calcItemX(data, startOfYear) + (_this.itemSize - _this.calcItemSize(data, maxValue)) / 2; })
                        .attr('y', function (data) { return _this.calcItemY(data) + (_this.itemSize - _this.calcItemSize(data, maxValue)) / 2; })
                        .attr('width', function (data) { return _this.calcItemSize(data, maxValue); })
                        .attr('height', function (data) { return _this.calcItemSize(data, maxValue); })
                        .on('end', repeat);
                };
                repeat();
                // Construct tooltip
                // Calculate tooltip position
                var x = _this.calcItemX(d, startOfYear) + _this.itemSize / 2;
                if (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 3)) {
                    x -= _this.tooltipWidth + _this.tooltipPadding * 2;
                }
                var y = _this.calcItemY(d) + _this.itemSize / 2;
                // Show tooltip
                _this.tooltip.html(_this.getTooltip(d))
                    .style('left', x + 'px')
                    .style('top', y + 'px')
                    .transition()
                    .duration(_this.transitionDuration / 2)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                // Set circle radius back to what it's supposed to be
                d3Selection.select(d3Selection.event.currentTarget).transition()
                    .duration(_this.transitionDuration / 2)
                    .ease(d3.easeLinear)
                    .attr('x', function (d) { return _this.calcItemX(d, startOfYear) + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; })
                    .attr('y', function (d) { return _this.calcItemY(d) + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; })
                    .attr('width', function (d) { return _this.calcItemSize(d, maxValue); })
                    .attr('height', function (d) { return _this.calcItemSize(d, maxValue); });
                // Hide tooltip
                _this.hideTooltip();
            })
                .transition()
                .delay(function () { return (Math.cos(Math.PI * Math.random()) + 1) * _this.transitionDuration; })
                .duration(function () { return _this.transitionDuration; })
                .ease(d3.easeLinear)
                .style('opacity', 1)
                .call(function (transition, callback) {
                if (transition.empty()) {
                    callback();
                }
                var n = 0;
                transition.each(function () { return ++n; }).on('end', function () {
                    if (!--n) {
                        callback.apply(this, arguments);
                    }
                });
            }, function () { return _this.inTransition = false; });
            // Add month labels
            var duration = Math.ceil(moment__default$1['default'].duration(endOfYear.diff(startOfYear)).asMonths());
            var monthLabels = [];
            for (var i = 1; i < duration; i++) {
                monthLabels.push(moment__default$1['default'](this.selected.date).month((startOfYear.month() + i) % 12).startOf('month'));
            }
            var monthScale = d3.scaleLinear().range([0, this.gWidth]).domain([0, monthLabels.length]);
            this.labels.selectAll('.label-month').remove();
            this.labels.selectAll('.label-month')
                .data(monthLabels)
                .enter()
                .append('text')
                .attr('class', 'label label-month')
                .attr('font-size', function () { return Math.floor(_this.labelPadding / 3) + 'px'; })
                .text(function (d) { return d.format('MMM'); })
                .attr('x', function (d, i) { return monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2; })
                .attr('y', this.labelPadding / 2)
                .on('mouseenter', function (d) {
                if (_this.inTransition) {
                    return;
                }
                var selectedMonth = moment__default$1['default'](d);
                _this.items.selectAll('.item-circle')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', function (data) { return moment__default$1['default'](data.date).isSame(selectedMonth, 'month') ? 1 : 0.1; });
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                _this.items.selectAll('.item-circle')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            })
                .on('click', function (d) {
                if (_this.inTransition) {
                    return;
                }
                // Check month data
                var monthData = _this._data.filter(function (e) { return e.date.isBetween(moment__default$1['default'](d).startOf('month'), moment__default$1['default'](d).endOf('month'), null, '[]'); });
                // Don't transition if there is no data to show
                if (!monthData.length) {
                    return;
                }
                // Set selected month to the one clicked on
                _this.selected = { date: d };
                _this.inTransition = true;
                // Hide tooltip
                _this.hideTooltip();
                // Remove all year overview related items and labels
                _this.removeYearOverview();
                // Redraw the chart
                _this.overview = 'month';
                _this.drawChart();
            });
            // Add day labels
            var dayLabels = d3.timeDays(moment__default$1['default'].utc().startOf('week').toDate(), moment__default$1['default'].utc().endOf('week').toDate());
            var dayScale = d3.scaleBand()
                .rangeRound([this.labelPadding, this.gHeight])
                .domain(dayLabels.map(function (d) { return moment__default$1['default'].utc(d).weekday().toString(); }));
            this.labels.selectAll('.label-day').remove();
            this.labels.selectAll('.label-day')
                .data(dayLabels)
                .enter()
                .append('text')
                .attr('class', 'label label-day')
                .attr('x', this.labelPadding / 3)
                .attr('y', function (d, i) { return dayScale(i.toString()) + dayScale.bandwidth() / 1.75; })
                .style('text-anchor', 'left')
                .attr('font-size', function () { return Math.floor(_this.labelPadding / 3) + 'px'; })
                .text(function (d) { return moment__default$1['default'].utc(d).format('dddd')[0]; })
                .on('mouseenter', function (d) {
                if (_this.inTransition) {
                    return;
                }
                var selectedDay = moment__default$1['default'].utc(d);
                _this.items.selectAll('.item-circle')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', function (data) { return (moment__default$1['default'](data.date).day() === selectedDay.day()) ? 1 : 0.1; });
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                _this.items.selectAll('.item-circle')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            });
            // Add button to switch back to previous overview
            this.drawButton();
        };
        CalendarHeatmapComponent.prototype.drawMonthOverview = function () {
            var _this = this;
            // Add current overview to the history
            if (this.history[this.history.length - 1] !== this.overview) {
                this.history.push(this.overview);
            }
            // Define beginning and end of the month
            var startOfMonth = moment__default$1['default'](this.selected.date).startOf('month');
            var endOfMonth = moment__default$1['default'](this.selected.date).endOf('month');
            // Filter data down to the selected month
            var monthData = [];
            this._data.filter(function (data) { return data.date.isBetween(startOfMonth, endOfMonth, null, '[]'); })
                .map(function (d) {
                var scale = [];
                d.details.forEach(function (det) {
                    var date = moment__default$1['default'].utc(det.date);
                    var i = Math.floor(date.hours() / 3);
                    if (!scale[i]) {
                        scale[i] = {
                            date: date.startOf('hour'),
                            total: 0,
                            details: [],
                            summary: []
                        };
                    }
                    scale[i].total += det.value;
                    scale[i].details.push(det);
                });
                scale.forEach(function (s) {
                    var group = _this.groupBy(s.details, 'name');
                    Object.keys(group).forEach(function (k) {
                        s.summary.push({
                            name: k,
                            total: d3.sum(group[k], function (data) { return data.total; }),
                            color: group[k][0].color
                        });
                    });
                });
                monthData = monthData.concat(scale);
            });
            monthData = GTSLib.cleanArray(monthData);
            this.LOG.debug(['drawMonthOverview'], [this.overview, this.selected, monthData]);
            var maxValue = d3.max(monthData, function (d) { return d.total; });
            // Define day labels and axis
            var dayLabels = d3.timeDays(moment__default$1['default'](this.selected.date).startOf('week').toDate(), moment__default$1['default'](this.selected.date).endOf('week').toDate());
            var dayScale = d3.scaleBand()
                .rangeRound([this.labelPadding, this.gHeight])
                .domain(dayLabels.map(function (d) { return moment__default$1['default'].utc(d).weekday().toString(); }));
            // Define week labels and axis
            var weekLabels = [startOfMonth];
            var incWeek = moment__default$1['default'](startOfMonth);
            while (incWeek.week() !== endOfMonth.week()) {
                weekLabels.push(moment__default$1['default'](incWeek.add(1, 'week')));
            }
            monthData.forEach(function (d) {
                var summary = [];
                var group = _this.groupBy(d.details, 'name');
                Object.keys(group).forEach(function (k) {
                    summary.push({
                        name: k,
                        total: group[k].reduce(function (acc, o) { return acc + o.value; }, 0),
                        color: group[k][0].color,
                        id: group[k][0].id,
                    });
                });
                d.summary = summary;
            });
            var weekScale = d3.scaleBand()
                .rangeRound([this.labelPadding, this.gWidth])
                .padding(0.05)
                .domain(weekLabels.map(function (weekday) { return weekday.week() + ''; }));
            var color = d3.scaleLinear()
                .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
                .domain([-0.15 * maxValue, maxValue]);
            // Add month data items to the overview
            this.items.selectAll('.item-block-month').remove();
            this.items.selectAll('.item-block-month')
                .data(monthData)
                .enter().append('rect')
                .style('opacity', 0)
                .attr('class', 'item item-block-month')
                .attr('y', function (d) { return _this.calcItemY(d)
                + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; })
                .attr('x', function (d) { return _this.calcItemXMonth(d, startOfMonth, weekScale(d.date.week().toString()))
                + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; })
                .attr('rx', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('ry', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('width', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('height', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('fill', function (d) { return (d.total > 0) ? color(d.total) : 'transparent'; })
                .on('click', function (d) {
                if (_this.inTransition) {
                    return;
                }
                // Don't transition if there is no data to show
                if (d.total === 0) {
                    return;
                }
                _this.inTransition = true;
                // Set selected date to the one clicked on
                _this.selected = d;
                // Hide tooltip
                _this.hideTooltip();
                // Remove all month overview related items and labels
                _this.removeMonthOverview();
                // Redraw the chart
                _this.overview = 'day';
                _this.drawChart();
            })
                .on('mouseover', function (d) {
                if (_this.inTransition) {
                    return;
                }
                // Construct tooltip
                // Calculate tooltip position
                var x = weekScale(d.date.week().toString()) + _this.tooltipPadding;
                while (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 3)) {
                    x -= 10;
                }
                var y = dayScale(d.date.weekday().toString()) + _this.tooltipPadding;
                // Show tooltip
                _this.tooltip.html(_this.getTooltip(d))
                    .style('left', x + 'px')
                    .style('top', y + 'px')
                    .transition()
                    .duration(_this.transitionDuration / 2)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                _this.hideTooltip();
            })
                .transition()
                .delay(function () { return (Math.cos(Math.PI * Math.random()) + 1) * _this.transitionDuration; })
                .duration(function () { return _this.transitionDuration; })
                .ease(d3.easeLinear)
                .style('opacity', 1)
                .call(function (transition, callback) {
                if (transition.empty()) {
                    callback();
                }
                var n = 0;
                transition.each(function () { return ++n; }).on('end', function () {
                    if (!--n) {
                        callback.apply(this, arguments);
                    }
                });
            }, function () { return _this.inTransition = false; });
            // Add week labels
            this.labels.selectAll('.label-week').remove();
            this.labels.selectAll('.label-week')
                .data(weekLabels)
                .enter()
                .append('text')
                .attr('class', 'label label-week')
                .attr('font-size', function () { return Math.floor(_this.labelPadding / 3) + 'px'; })
                .text(function (d) { return 'Week ' + d.week(); })
                .attr('x', function (d) { return weekScale(d.week().toString()); })
                .attr('y', this.labelPadding / 2)
                .on('mouseenter', function (weekday) {
                if (_this.inTransition) {
                    return;
                }
                _this.items.selectAll('.item-block-month')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', function (d) {
                    return (moment__default$1['default'](d.date).week() === weekday.week()) ? 1 : 0.1;
                });
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                _this.items.selectAll('.item-block-month')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            })
                .on('click', function (d) {
                if (_this.inTransition) {
                    return;
                }
                _this.inTransition = true;
                // Set selected month to the one clicked on
                _this.selected = { date: d };
                // Hide tooltip
                _this.hideTooltip();
                // Remove all year overview related items and labels
                _this.removeMonthOverview();
                // Redraw the chart
                _this.overview = 'week';
                _this.drawChart();
            });
            // Add day labels
            this.labels.selectAll('.label-day').remove();
            this.labels.selectAll('.label-day')
                .data(dayLabels)
                .enter()
                .append('text')
                .attr('class', 'label label-day')
                .attr('x', this.labelPadding / 3)
                .attr('y', function (d, i) { return dayScale(i) + dayScale.bandwidth() / 1.75; })
                .style('text-anchor', 'left')
                .attr('font-size', function () { return Math.floor(_this.labelPadding / 3) + 'px'; })
                .text(function (d) { return moment__default$1['default'].utc(d).format('dddd')[0]; })
                .on('mouseenter', function (d) {
                if (_this.inTransition) {
                    return;
                }
                var selectedDay = moment__default$1['default'].utc(d);
                _this.items.selectAll('.item-block-month')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', function (data) { return (moment__default$1['default'](data.date).day() === selectedDay.day()) ? 1 : 0.1; });
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                _this.items.selectAll('.item-block-month')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            });
            // Add button to switch back to previous overview
            this.drawButton();
        };
        CalendarHeatmapComponent.prototype.drawWeekOverview = function () {
            var _this = this;
            // Add current overview to the history
            if (this.history[this.history.length - 1] !== this.overview) {
                this.history.push(this.overview);
            }
            // Define beginning and end of the week
            var startOfWeek = moment__default$1['default'](this.selected.date).startOf('week');
            var endOfWeek = moment__default$1['default'](this.selected.date).endOf('week');
            // Filter data down to the selected week
            var weekData = [];
            this._data.filter(function (d) {
                return d.date.isBetween(startOfWeek, endOfWeek, null, '[]');
            }).map(function (d) {
                var scale = [];
                d.details.forEach(function (det) {
                    var date = moment__default$1['default'](det.date);
                    var i = date.hours();
                    if (!scale[i]) {
                        scale[i] = {
                            date: date.startOf('hour'),
                            total: 0,
                            details: [],
                            summary: []
                        };
                    }
                    scale[i].total += det.value;
                    scale[i].details.push(det);
                });
                scale.forEach(function (s) {
                    var group = _this.groupBy(s.details, 'name');
                    Object.keys(group).forEach(function (k) { return s.summary.push({
                        name: k,
                        total: d3.sum(group[k], function (data) { return data.value; }),
                        color: group[k][0].color
                    }); });
                });
                weekData = weekData.concat(scale);
            });
            weekData = GTSLib.cleanArray(weekData);
            var maxValue = d3.max(weekData, function (d) { return d.total; });
            // Define day labels and axis
            var dayLabels = d3.timeDays(moment__default$1['default'].utc().startOf('week').toDate(), moment__default$1['default'].utc().endOf('week').toDate());
            var dayScale = d3.scaleBand()
                .rangeRound([this.labelPadding, this.gHeight])
                .domain(dayLabels.map(function (d) { return moment__default$1['default'].utc(d).weekday().toString(); }));
            // Define hours labels and axis
            var hoursLabels = [];
            d3.range(0, 24).forEach(function (h) { return hoursLabels.push(moment__default$1['default'].utc().hours(h).startOf('hour').format('HH:mm')); });
            var hourScale = d3.scaleBand().rangeRound([this.labelPadding, this.gWidth]).padding(0.01).domain(hoursLabels);
            var color = d3.scaleLinear()
                .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
                .domain([-0.15 * maxValue, maxValue]);
            // Add week data items to the overview
            this.items.selectAll('.item-block-week').remove();
            this.items.selectAll('.item-block-week')
                .data(weekData)
                .enter()
                .append('rect')
                .style('opacity', 0)
                .attr('class', 'item item-block-week')
                .attr('y', function (d) { return _this.calcItemY(d)
                + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; })
                .attr('x', function (d) { return _this.gutter
                + hourScale(moment__default$1['default'](d.date).startOf('hour').format('HH:mm'))
                + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; })
                .attr('rx', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('ry', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('width', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('height', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('fill', function (d) { return (d.total > 0) ? color(d.total) : 'transparent'; })
                .on('click', function (d) {
                if (_this.inTransition) {
                    return;
                }
                // Don't transition if there is no data to show
                if (d.total === 0) {
                    return;
                }
                _this.inTransition = true;
                // Set selected date to the one clicked on
                _this.selected = d;
                // Hide tooltip
                _this.hideTooltip();
                // Remove all week overview related items and labels
                _this.removeWeekOverview();
                // Redraw the chart
                _this.overview = 'day';
                _this.drawChart();
            }).on('mouseover', function (d) {
                if (_this.inTransition) {
                    return;
                }
                // Calculate tooltip position
                var x = hourScale(moment__default$1['default'](d.date).startOf('hour').format('HH:mm')) + _this.tooltipPadding;
                while (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 3)) {
                    x -= 10;
                }
                var y = dayScale(d.date.weekday().toString()) + _this.tooltipPadding;
                // Show tooltip
                _this.tooltip.html(_this.getTooltip(d))
                    .style('left', x + 'px')
                    .style('top', y + 'px')
                    .transition()
                    .duration(_this.transitionDuration / 2)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                _this.hideTooltip();
            })
                .transition()
                .delay(function () { return (Math.cos(Math.PI * Math.random()) + 1) * _this.transitionDuration; })
                .duration(function () { return _this.transitionDuration; })
                .ease(d3.easeLinear)
                .style('opacity', 1)
                .call(function (transition, callback) {
                if (transition.empty()) {
                    callback();
                }
                var n = 0;
                transition.each(function () { return ++n; }).on('end', function () {
                    if (!--n) {
                        callback.apply(this, arguments);
                    }
                });
            }, function () { return _this.inTransition = false; });
            // Add week labels
            this.labels.selectAll('.label-week').remove();
            this.labels.selectAll('.label-week')
                .data(hoursLabels)
                .enter()
                .append('text')
                .attr('class', 'label label-week')
                .attr('font-size', function () { return Math.floor(_this.labelPadding / 3) + 'px'; })
                .text(function (d) { return d; })
                .attr('x', function (d) { return hourScale(d); })
                .attr('y', this.labelPadding / 2)
                .on('mouseenter', function (hour) {
                if (_this.inTransition) {
                    return;
                }
                _this.items.selectAll('.item-block-week')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', function (d) { return (moment__default$1['default'](d.date).startOf('hour').format('HH:mm') === hour) ? 1 : 0.1; });
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                _this.items.selectAll('.item-block-week')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            });
            // Add day labels
            this.labels.selectAll('.label-day').remove();
            this.labels.selectAll('.label-day')
                .data(dayLabels)
                .enter()
                .append('text')
                .attr('class', 'label label-day')
                .attr('x', this.labelPadding / 3)
                .attr('y', function (d, i) { return dayScale(i.toString()) + dayScale.bandwidth() / 1.75; })
                .style('text-anchor', 'left')
                .attr('font-size', function () { return Math.floor(_this.labelPadding / 3) + 'px'; })
                .text(function (d) { return moment__default$1['default'].utc(d).format('dddd')[0]; })
                .on('mouseenter', function (d) {
                if (_this.inTransition) {
                    return;
                }
                var selectedDay = moment__default$1['default'].utc(d);
                _this.items.selectAll('.item-block-week')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', function (data) { return (moment__default$1['default'](data.date).day() === selectedDay.day()) ? 1 : 0.1; });
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                _this.items.selectAll('.item-block-week')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            });
            // Add button to switch back to previous overview
            this.drawButton();
        };
        CalendarHeatmapComponent.prototype.drawDayOverview = function () {
            var _this = this;
            // Add current overview to the history
            if (this.history[this.history.length - 1] !== this.overview) {
                this.history.push(this.overview);
            }
            // Initialize selected date to today if it was not set
            if (!Object.keys(this.selected).length) {
                this.selected = this._data[this._data.length - 1];
            }
            var startOfDay = moment__default$1['default'](this.selected.date).startOf('day');
            var endOfDay = moment__default$1['default'](this.selected.date).endOf('day');
            // Filter data down to the selected month
            var dayData = [];
            this._data.filter(function (d) {
                return d.date.isBetween(startOfDay, endOfDay, null, '[]');
            }).map(function (d) {
                var scale = [];
                d.details.forEach(function (det) {
                    var date = moment__default$1['default'](det.date);
                    var i = date.hours();
                    if (!scale[i]) {
                        scale[i] = {
                            date: date.startOf('hour'),
                            total: 0,
                            details: [],
                            summary: []
                        };
                    }
                    scale[i].total += det.value;
                    scale[i].details.push(det);
                });
                scale.forEach(function (s) {
                    var group = _this.groupBy(s.details, 'name');
                    Object.keys(group).forEach(function (k) {
                        s.summary.push({
                            name: k,
                            total: d3.sum(group[k], function (item) { return item.value; }),
                            color: group[k][0].color
                        });
                    });
                });
                dayData = dayData.concat(scale);
            });
            var data = [];
            dayData.forEach(function (d) {
                var date = d.date;
                d.summary.forEach(function (s) {
                    s.date = date;
                    data.push(s);
                });
            });
            dayData = GTSLib.cleanArray(dayData);
            var maxValue = d3.max(data, function (d) { return d.total; });
            var gtsNames = this.selected.summary.map(function (summary) { return summary.name; });
            var gtsNameScale = d3.scaleBand().rangeRound([this.labelPadding, this.gHeight]).domain(gtsNames);
            var hourLabels = [];
            d3.range(0, 24).forEach(function (h) { return hourLabels.push(moment__default$1['default'].utc().hours(h).startOf('hour').format('HH:mm')); });
            var dayScale = d3.scaleBand()
                .rangeRound([this.labelPadding, this.gWidth])
                .padding(0.01)
                .domain(hourLabels);
            this.items.selectAll('.item-block').remove();
            this.items.selectAll('.item-block')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'item item-block')
                .attr('x', function (d) { return _this.gutter
                + dayScale(moment__default$1['default'](d.date).startOf('hour').format('HH:mm'))
                + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; })
                .attr('y', function (d) {
                return (gtsNameScale(d.name) || 1) - (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2;
            })
                .attr('rx', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('ry', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('width', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('height', function (d) { return _this.calcItemSize(d, maxValue); })
                .attr('fill', function (d) {
                var color = d3.scaleLinear()
                    .range(['#ffffff', d.color || CalendarHeatmapComponent.DEF_MIN_COLOR])
                    .domain([-0.5 * maxValue, maxValue]);
                return color(d.total);
            })
                .style('opacity', 0)
                .on('mouseover', function (d) {
                if (_this.inTransition) {
                    return;
                }
                // Calculate tooltip position
                var x = dayScale(moment__default$1['default'](d.date).startOf('hour').format('HH:mm')) + _this.tooltipPadding;
                while (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 3)) {
                    x -= 10;
                }
                var y = gtsNameScale(d.name) + _this.tooltipPadding;
                // Show tooltip
                _this.tooltip.html(_this.getTooltip(d))
                    .style('left', x + 'px')
                    .style('top', y + 'px')
                    .transition()
                    .duration(_this.transitionDuration / 2)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                _this.hideTooltip();
            })
                .on('click', function (d) {
                if (_this.handler) {
                    _this.handler.emit(d);
                }
            })
                .transition()
                .delay(function () { return (Math.cos(Math.PI * Math.random()) + 1) * _this.transitionDuration; })
                .duration(function () { return _this.transitionDuration; })
                .ease(d3.easeLinear)
                .style('opacity', 1)
                .call(function (transition, callback) {
                if (transition.empty()) {
                    callback();
                }
                var n = 0;
                transition.each(function () { return ++n; }).on('end', function () {
                    if (!--n) {
                        callback.apply(this, arguments);
                    }
                });
            }, function () { return _this.inTransition = false; });
            // Add time labels
            this.labels.selectAll('.label-time').remove();
            this.labels.selectAll('.label-time')
                .data(hourLabels)
                .enter()
                .append('text')
                .attr('class', 'label label-time')
                .attr('font-size', function () { return Math.floor(_this.labelPadding / 3) + 'px'; })
                .text(function (d) { return d; })
                .attr('x', function (d) { return dayScale(d); })
                .attr('y', this.labelPadding / 2)
                .on('mouseenter', function (d) {
                if (_this.inTransition) {
                    return;
                }
                var selected = d;
                // const selected = itemScale(moment.utc(d));
                _this.items.selectAll('.item-block')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', function (item) { return (item.date.format('HH:mm') === selected) ? 1 : 0.1; });
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                _this.items.selectAll('.item-block')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            });
            // Add project labels
            var labelPadding = this.labelPadding;
            this.labels.selectAll('.label-project').remove();
            this.labels.selectAll('.label-project')
                .data(gtsNames)
                .enter()
                .append('text')
                .attr('class', 'label label-project')
                .attr('x', this.gutter)
                .attr('y', function (d) { return gtsNameScale(d) + _this.itemSize / 2; })
                .attr('min-height', function () { return gtsNameScale.bandwidth(); })
                .style('text-anchor', 'left')
                .attr('font-size', function () { return Math.floor(_this.labelPadding / 3) + 'px'; })
                .text(function (d) { return d; })
                .each(function () {
                var obj = d3Selection.select(this);
                var textLength = obj.node().getComputedTextLength();
                var text = obj.text();
                while (textLength > (labelPadding * 1.5) && text.length > 0) {
                    text = text.slice(0, -1);
                    obj.text(text + '...');
                    textLength = obj.node().getComputedTextLength();
                }
            })
                .on('mouseenter', function (gtsName) {
                if (_this.inTransition) {
                    return;
                }
                _this.items.selectAll('.item-block')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', function (d) { return (d.name === gtsName) ? 1 : 0.1; });
            })
                .on('mouseout', function () {
                if (_this.inTransition) {
                    return;
                }
                _this.items.selectAll('.item-block')
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(d3.easeLinear)
                    .style('opacity', 1);
            });
            // Add button to switch back to previous overview
            this.drawButton();
        };
        CalendarHeatmapComponent.prototype.calcItemX = function (d, startOfYear) {
            var dayIndex = Math.round((+moment__default$1['default'](d.date) - +startOfYear.startOf('week')) / 86400000);
            var colIndex = Math.trunc(dayIndex / 7);
            return colIndex * (this.itemSize + this.gutter) + this.labelPadding;
        };
        CalendarHeatmapComponent.prototype.calcItemXMonth = function (d, start, offset) {
            var hourIndex = moment__default$1['default'](d.date).hours();
            var colIndex = Math.trunc(hourIndex / 3);
            return colIndex * (this.itemSize + this.gutter) + offset;
        };
        CalendarHeatmapComponent.prototype.calcItemY = function (d) {
            return this.labelPadding + d.date.weekday() * (this.itemSize + this.gutter);
        };
        CalendarHeatmapComponent.prototype.calcItemSize = function (d, m) {
            if (m <= 0) {
                return this.itemSize;
            }
            return this.itemSize * 0.75 + (this.itemSize * d.total / m) * 0.25;
        };
        CalendarHeatmapComponent.prototype.drawButton = function () {
            var _this = this;
            this.buttons.selectAll('.button').remove();
            var button = this.buttons.append('g')
                .attr('class', 'button button-back')
                .style('opacity', 0)
                .on('click', function () {
                if (_this.inTransition) {
                    return;
                }
                // Set transition boolean
                _this.inTransition = true;
                // Clean the canvas from whichever overview type was on
                if (_this.overview === 'year') {
                    _this.removeYearOverview();
                }
                else if (_this.overview === 'month') {
                    _this.removeMonthOverview();
                }
                else if (_this.overview === 'week') {
                    _this.removeWeekOverview();
                }
                else if (_this.overview === 'day') {
                    _this.removeDayOverview();
                }
                // Redraw the chart
                _this.history.pop();
                _this.overview = _this.history.pop();
                _this.drawChart();
            });
            button.append('circle')
                .attr('cx', this.labelPadding / 2.25)
                .attr('cy', this.labelPadding / 2.5)
                .attr('r', this.itemSize / 2);
            button.append('text')
                .attr('x', this.labelPadding / 2.25)
                .attr('y', this.labelPadding / 2.5)
                .attr('dy', function () {
                return Math.floor(_this.gWidth / 100) / 3;
            })
                .attr('font-size', function () {
                return Math.floor(_this.labelPadding / 3) + 'px';
            })
                .html('&#x2190;');
            button.transition()
                .duration(this.transitionDuration)
                .ease(d3.easeLinear)
                .style('opacity', 1);
        };
        CalendarHeatmapComponent.prototype.removeGlobalOverview = function () {
            this.items.selectAll('.item-block-year')
                .transition()
                .duration(this.transitionDuration)
                .ease(d3.easeLinear)
                .style('opacity', 0)
                .remove();
            this.labels.selectAll('.label-year').remove();
        };
        CalendarHeatmapComponent.prototype.removeYearOverview = function () {
            this.items.selectAll('.item-circle')
                .transition()
                .duration(this.transitionDuration)
                .ease(d3.easeLinear)
                .style('opacity', 0)
                .remove();
            this.labels.selectAll('.label-day').remove();
            this.labels.selectAll('.label-month').remove();
            this.hideBackButton();
        };
        CalendarHeatmapComponent.prototype.removeMonthOverview = function () {
            this.items.selectAll('.item-block-month')
                .transition()
                .duration(this.transitionDuration)
                .ease(d3.easeLinear)
                .style('opacity', 0)
                .remove();
            this.labels.selectAll('.label-day').remove();
            this.labels.selectAll('.label-week').remove();
            this.hideBackButton();
        };
        CalendarHeatmapComponent.prototype.removeWeekOverview = function () {
            var _this = this;
            this.items.selectAll('.item-block-week')
                .transition()
                .duration(this.transitionDuration)
                .ease(d3.easeLinear)
                .style('opacity', 0)
                .attr('x', function (d, i) { return (i % 2 === 0) ? -_this.gWidth / 3 : _this.gWidth / 3; })
                .remove();
            this.labels.selectAll('.label-day').remove();
            this.labels.selectAll('.label-week').remove();
            this.hideBackButton();
        };
        CalendarHeatmapComponent.prototype.removeDayOverview = function () {
            var _this = this;
            this.items.selectAll('.item-block')
                .transition()
                .duration(this.transitionDuration)
                .ease(d3.easeLinear)
                .style('opacity', 0)
                .attr('x', function (d, i) { return (i % 2 === 0) ? -_this.gWidth / 3 : _this.gWidth / 3; })
                .remove();
            this.labels.selectAll('.label-time').remove();
            this.labels.selectAll('.label-project').remove();
            this.hideBackButton();
        };
        CalendarHeatmapComponent.prototype.hideTooltip = function () {
            this.tooltip.transition()
                .duration(this.transitionDuration / 2)
                .ease(d3.easeLinear)
                .style('opacity', 0);
        };
        /**
         * Helper function to hide the back button
         */
        CalendarHeatmapComponent.prototype.hideBackButton = function () {
            this.buttons.selectAll('.button')
                .transition()
                .duration(this.transitionDuration)
                .ease(d3.easeLinear)
                .style('opacity', 0)
                .remove();
        };
        return CalendarHeatmapComponent;
    }());
    CalendarHeatmapComponent.DEF_MIN_COLOR = '#ffffff';
    CalendarHeatmapComponent.DEF_MAX_COLOR = '#333333';
    CalendarHeatmapComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'calendar-heatmap',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div #chart></div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;position:relative;user-select:none}:host .item,:host .label{cursor:pointer}:host .label{fill:#aaa;font-family:Helvetica,arial,Open Sans,sans-serif}:host .button{cursor:pointer;fill:transparent;stroke:#aaa;stroke-width:2}:host .button text{fill:#aaa;stroke-width:1;text-anchor:middle}:host .heatmap-tooltip{background:rgba(0,0,0,.75);color:#fff;font-family:Helvetica,arial,Open Sans,sans-serif;font-size:12px;line-height:14px;max-width:650px;overflow:hidden;padding:15px;pointer-events:none;position:absolute;width:450px;z-index:9999}:host .heatmap-tooltip ul{list-style:none;padding:0}:host .heatmap-tooltip ul li{padding:0}:host .heatmap-tooltip ul li .gtsInfo{max-width:650px;padding-left:20px;width:auto}:host .heatmap-tooltip .header strong{display:inline-block;width:100%}:host .heatmap-tooltip .round{background-color:#bbb;border:2px solid #454545;border-radius:50%;display:inline-block;height:12px;width:12px}:host .heatmap-tooltip .header strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"]
                },] }
    ];
    CalendarHeatmapComponent.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };
    CalendarHeatmapComponent.propDecorators = {
        debug: [{ type: i0.Input, args: ['debug',] }],
        data: [{ type: i0.Input, args: ['data',] }],
        minColor: [{ type: i0.Input, args: ['minColor',] }],
        maxColor: [{ type: i0.Input, args: ['maxColor',] }],
        div: [{ type: i0.ViewChild, args: ['chart', { static: true },] }],
        width: [{ type: i0.Input, args: ['width',] }],
        height: [{ type: i0.Input, args: ['height',] }],
        overview: [{ type: i0.Input, args: ['overview',] }],
        handler: [{ type: i0.Output, args: ['handler',] }],
        change: [{ type: i0.Output, args: ['change',] }],
        onResize: [{ type: i0.HostListener, args: ['window:resize',] }]
    };

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
    /**
     *
     */
    var WarpViewGtsPopupComponent = /** @class */ (function () {
        function WarpViewGtsPopupComponent() {
            this.maxToShow = 5;
            this.warpViewSelectedGTS = new i0.EventEmitter();
            this.warpViewModalOpen = new i0.EventEmitter();
            this.warpViewModalClose = new i0.EventEmitter();
            this.current = 0;
            // tslint:disable-next-line:variable-name
            this._gts = [];
            this._options = new Param();
            // tslint:disable-next-line:variable-name
            this._kbdLastKeyPressed = [];
            // tslint:disable-next-line:variable-name
            this._hiddenData = [];
            // tslint:disable-next-line:variable-name
            this._debug = false;
            this.displayed = [];
            this.modalOpenned = false;
            this.LOG = new Logger(WarpViewGtsPopupComponent, this.debug);
        }
        Object.defineProperty(WarpViewGtsPopupComponent.prototype, "options", {
            set: function (options) {
                this.LOG.debug(['onOptions'], options);
                if (typeof options === 'string') {
                    options = JSON.parse(options);
                }
                if (!deepEqual__default['default'](options, this._options)) {
                    this.LOG.debug(['options', 'changed'], options);
                    this._options = ChartLib.mergeDeep(this._options, options);
                    this.prepareData();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewGtsPopupComponent.prototype, "gtsList", {
            set: function (gtsList) {
                this._gtsList = gtsList;
                this.LOG.debug(['_gtsList'], this._gtsList);
                this.prepareData();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewGtsPopupComponent.prototype, "gtslist", {
            get: function () {
                return this._gtsList;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewGtsPopupComponent.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (debug) {
                this._debug = debug;
                this.LOG.setDebug(debug);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewGtsPopupComponent.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (data) {
                this.LOG.debug(['data'], data);
                if (data) {
                    this._data = data;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewGtsPopupComponent.prototype, "hiddenData", {
            get: function () {
                return this._hiddenData;
            },
            set: function (hiddenData) {
                this._hiddenData = hiddenData;
                this.prepareData();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewGtsPopupComponent.prototype, "kbdLastKeyPressed", {
            get: function () {
                return this._kbdLastKeyPressed;
            },
            set: function (kbdLastKeyPressed) {
                this._kbdLastKeyPressed = kbdLastKeyPressed;
                if (kbdLastKeyPressed[0] === 's' && !this.modalOpenned) {
                    this.showPopup();
                }
                else if (this.modalOpenned) {
                    switch (kbdLastKeyPressed[0]) {
                        case 'ArrowUp':
                        case 'j':
                            this.current = Math.max(0, this.current - 1);
                            this.prepareData();
                            break;
                        case 'ArrowDown':
                        case 'k':
                            this.current = Math.min(this._gts.length - 1, this.current + 1);
                            this.prepareData();
                            break;
                        case ' ':
                            this.warpViewSelectedGTS.emit({
                                gts: this._gts[this.current],
                                selected: this.hiddenData.indexOf(this._gts[this.current].id) > -1
                            });
                            break;
                        default:
                            return;
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        WarpViewGtsPopupComponent.prototype.ngAfterViewInit = function () {
            this.prepareData();
        };
        WarpViewGtsPopupComponent.prototype.onWarpViewModalOpen = function () {
            this.modalOpenned = true;
            this.warpViewModalOpen.emit({});
        };
        WarpViewGtsPopupComponent.prototype.onWarpViewModalClose = function () {
            this.modalOpenned = false;
            this.warpViewModalClose.emit({});
        };
        WarpViewGtsPopupComponent.prototype.isOpened = function () {
            return this.modal.isOpened();
        };
        WarpViewGtsPopupComponent.prototype.showPopup = function () {
            this.current = 0;
            this.prepareData();
            this.modal.open();
        };
        WarpViewGtsPopupComponent.prototype.close = function () {
            this.modal.close();
        };
        WarpViewGtsPopupComponent.prototype.prepareData = function () {
            if (this._gtsList && this._gtsList.data) {
                this._gts = GTSLib.flatDeep([this._gtsList.data]);
                this.displayed = this._gts.slice(Math.max(0, Math.min(this.current - this.maxToShow, this._gts.length - 2 * this.maxToShow)), Math.min(this._gts.length, this.current + this.maxToShow + Math.abs(Math.min(this.current - this.maxToShow, 0))));
                this.LOG.debug(['prepareData'], this.displayed);
            }
        };
        WarpViewGtsPopupComponent.prototype.isHidden = function (gts) {
            return !this.displayed.find(function (g) { return !!gts ? gts.id === g.id : false; });
        };
        WarpViewGtsPopupComponent.prototype.identify = function (index, item) {
            return index;
        };
        return WarpViewGtsPopupComponent;
    }());
    WarpViewGtsPopupComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-gts-popup',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n                modalTitle=\"GTS Selector\"\n                #modal\n                (warpViewModalClose)=\"onWarpViewModalClose()\"\n                (warpViewModalOpen)=\"onWarpViewModalOpen()\">\n  <div class=\"up-arrow\" *ngIf=\"this.current > 0\"></div>\n  <ul>\n    <li *ngFor=\"let g of _gts; index as index; trackBy:identify\"\n        [ngClass]=\"{ selected: current == index, hidden: isHidden(g.id) }\"\n    >\n      <warpview-chip [node]=\"{gts: g}\" [hiddenData]=\"hiddenData\" [options]=\"_options\"></warpview-chip>\n    </li>\n  </ul>\n  <div class=\"down-arrow\" *ngIf=\"current < _gts.length - 1\"></div>\n</warpview-modal>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}"]
                },] }
    ];
    WarpViewGtsPopupComponent.ctorParameters = function () { return []; };
    WarpViewGtsPopupComponent.propDecorators = {
        modal: [{ type: i0.ViewChild, args: ['modal', { static: true },] }],
        options: [{ type: i0.Input, args: ['options',] }],
        gtsList: [{ type: i0.Input, args: ['gtsList',] }],
        debug: [{ type: i0.Input, args: ['debug',] }],
        data: [{ type: i0.Input, args: ['data',] }],
        hiddenData: [{ type: i0.Input, args: ['hiddenData',] }],
        maxToShow: [{ type: i0.Input, args: ['maxToShow',] }],
        kbdLastKeyPressed: [{ type: i0.Input, args: ['kbdLastKeyPressed',] }],
        warpViewSelectedGTS: [{ type: i0.Output, args: ['warpViewSelectedGTS',] }],
        warpViewModalOpen: [{ type: i0.Output, args: ['warpViewModalOpen',] }],
        warpViewModalClose: [{ type: i0.Output, args: ['warpViewModalClose',] }]
    };

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
    var WarpViewModalComponent = /** @class */ (function () {
        function WarpViewModalComponent(el) {
            this.el = el;
            this.modalTitle = '';
            this.kbdLastKeyPressed = [];
            this.warpViewModalOpen = new i0.EventEmitter();
            this.warpViewModalClose = new i0.EventEmitter();
            this.opened = false;
        }
        WarpViewModalComponent.prototype.open = function () {
            this.el.nativeElement.style.display = 'block';
            this.el.nativeElement.style.zIndex = '999999';
            this.opened = true;
            this.warpViewModalOpen.emit({});
        };
        WarpViewModalComponent.prototype.close = function () {
            this.el.nativeElement.style.display = 'none';
            this.el.nativeElement.style.zIndex = '-1';
            this.opened = false;
            this.warpViewModalClose.emit({});
        };
        WarpViewModalComponent.prototype.isOpened = function () {
            var _this = this;
            return new Promise(function (resolve) {
                resolve(_this.opened);
            });
        };
        WarpViewModalComponent.prototype.handleKeyDown = function ($event) {
            if ('Escape' === $event[0]) {
                this.close();
            }
        };
        WarpViewModalComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.el.nativeElement.addEventListener('click', function (event) {
                if (event.path[0].nodeName === 'WARP-VIEW-MODAL') {
                    _this.close();
                }
            });
        };
        return WarpViewModalComponent;
    }());
    WarpViewModalComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-modal',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"popup\">\n  <div class=\"header\">\n    <div class=\"title\" [innerHTML]=\"modalTitle\"></div>\n    <div class=\"close\" (click)=\"close()\">&times;</div>\n  </div>\n  <div class=\"body\">\n    <ng-content></ng-content>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host{background-color:rgba(0,0,0,.3);display:none;height:100%;left:0;overflow:hidden;position:fixed;top:0;z-index:0}:host,:host .popup{outline:0;width:100%}:host .popup{background-clip:padding-box;background-color:var(--warp-view-popup-bg-color);border:1px solid var(--warp-view-popup-border-color);border-radius:.3rem;display:flex;flex-direction:column;height:auto;margin:1.75rem auto;pointer-events:auto;position:relative;top:10%;z-index:999999}@media (min-width:576px){:host .popup{max-width:800px}}:host .popup .header{align-items:flex-start;background-color:var(--warp-view-popup-header-bg-color);border-bottom:1px solid #e9ecef;border-top-left-radius:.3rem;border-top-right-radius:.3rem;display:flex;justify-content:space-between;padding:1rem}:host .popup .header .title{color:var(--warp-view-popup-title-color);line-height:1.5;margin-bottom:0}:host .popup .header .close{color:var(--warp-view-popup-close-color);cursor:pointer;margin:-1rem -1rem -1rem auto;padding:1rem}:host .popup .body{background-color:var(--warp-view-popup-body-bg-color);color:var(--warp-view-popup-body-color);height:auto;padding:10px;position:relative}"]
                },] }
    ];
    WarpViewModalComponent.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };
    WarpViewModalComponent.propDecorators = {
        modalTitle: [{ type: i0.Input, args: ['modalTitle',] }],
        kbdLastKeyPressed: [{ type: i0.Input, args: ['kbdLastKeyPressed',] }],
        warpViewModalOpen: [{ type: i0.Output, args: ['warpViewModalOpen',] }],
        warpViewModalClose: [{ type: i0.Output, args: ['warpViewModalClose',] }],
        handleKeyDown: [{ type: i0.HostListener, args: ['kbdLastKeyPressed', ['$event'],] }]
    };

    /**
     *
     */
    var WarpViewGtsTreeComponent = /** @class */ (function (_super) {
        __extends(WarpViewGtsTreeComponent, _super);
        function WarpViewGtsTreeComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.kbdLastKeyPressed = [];
            _this.warpViewSelectedGTS = new i0.EventEmitter();
            _this._gtsFilter = 'x';
            _this.gtsList = [];
            _this.params = [];
            _this.expand = false;
            _this.initOpen = new rxjs.Subject();
            _this.LOG = new Logger(WarpViewGtsTreeComponent, _this._debug);
            return _this;
        }
        Object.defineProperty(WarpViewGtsTreeComponent.prototype, "gtsFilter", {
            get: function () {
                return this._gtsFilter;
            },
            set: function (gtsFilter) {
                this._gtsFilter = gtsFilter;
            },
            enumerable: false,
            configurable: true
        });
        WarpViewGtsTreeComponent.prototype.ngAfterViewInit = function () {
            this.LOG.debug(['componentDidLoad', 'data'], this._data);
            if (!!this._options.foldGTSTree && !this.expand) {
                this.foldAll();
            }
            if (!this._options.foldGTSTree) {
                this.initOpen.next();
            }
            if (this._data) {
                this.doRender();
            }
        };
        WarpViewGtsTreeComponent.prototype.update = function (options, refresh) {
            if (!!this._options.foldGTSTree && !this.expand) {
                this.foldAll();
            }
            this.doRender();
        };
        WarpViewGtsTreeComponent.prototype.doRender = function () {
            this.LOG.debug(['doRender', 'gtsList'], this._data);
            if (!this._data) {
                return;
            }
            this._options = ChartLib.mergeDeep(this.defOptions, this._options);
            var dataList = GTSLib.getData(this._data).data;
            this.params = this._data.params || [];
            this.LOG.debug(['doRender', 'gtsList', 'dataList'], dataList);
            if (!dataList) {
                return;
            }
            this.expand = !this._options.foldGTSTree;
            this.gtsList = GTSLib.flattenGtsIdArray(dataList, 0).res;
            this.LOG.debug(['doRender', 'gtsList'], this.gtsList, this._options.foldGTSTree, this.expand);
            this.loading = false;
            this.chartDraw.emit();
        };
        WarpViewGtsTreeComponent.prototype.foldAll = function () {
            var _this = this;
            if (!this.root) {
                setTimeout(function () { return _this.foldAll(); });
            }
            else {
                this.expand = false;
            }
        };
        WarpViewGtsTreeComponent.prototype.toggleVisibility = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.expand = !_this.expand; });
        };
        WarpViewGtsTreeComponent.prototype.convert = function (data) {
            return [];
        };
        WarpViewGtsTreeComponent.prototype.warpViewSelectedGTSHandler = function (event) {
            this.LOG.debug(['warpViewSelectedGTS'], event);
            this.warpViewSelectedGTS.emit(event);
        };
        return WarpViewGtsTreeComponent;
    }(WarpViewComponent));
    WarpViewGtsTreeComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-gts-tree',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\">\n  <div class=\"stack-level\" (click)=\"toggleVisibility()\">\n    <span [ngClass]=\"{expanded: this.expand, collapsed: !this.expand}\" #root></span> Results\n    <small id=\"inner-a\">List of {{gtsList.length}} item{{gtsList.length > 1 ? 's' : ''}}</small>\n  </div>\n  <warpview-tree-view [events]=\"initOpen.asObservable()\"\n                      [gtsList]=\"gtsList\" [branch]=\"false\" *ngIf=\"expand\" [params]=\"params\"\n                      [options]=\"_options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\"\n                      [debug]=\"debug\" [hiddenData]=\"hiddenData\" [gtsFilter]=\"gtsFilter\"\n                      [kbdLastKeyPressed]=\"kbdLastKeyPressed\"></warpview-tree-view>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host .wrapper{min-height:0!important;text-align:left}:host .stack-level{color:var(--gts-stack-font-color);cursor:pointer;font-size:1em;padding-top:5px}:host .stack-level+div{padding-left:25px}:host .expanded{background-image:var(--gts-tree-expanded-icon)}:host .collapsed,:host .expanded{background-position:0;background-repeat:no-repeat;margin-right:5px;padding:1px 10px}:host .collapsed{background-image:var(--gts-tree-collapsed-icon)}"]
                },] }
    ];
    WarpViewGtsTreeComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewGtsTreeComponent.propDecorators = {
        root: [{ type: i0.ViewChild, args: ['root', { static: true },] }],
        kbdLastKeyPressed: [{ type: i0.Input, args: ['kbdLastKeyPressed',] }],
        gtsFilter: [{ type: i0.Input, args: ['gtsFilter',] }],
        warpViewSelectedGTS: [{ type: i0.Output, args: ['warpViewSelectedGTS',] }]
    };

    var WarpViewTreeViewComponent = /** @class */ (function () {
        function WarpViewTreeViewComponent() {
            this.gtsFilter = 'x';
            this.branch = false;
            this.hidden = false;
            this.warpViewSelectedGTS = new i0.EventEmitter();
            this.hide = {};
            this.initOpen = new rxjs.Subject();
            this.stateChange = new rxjs.Subject();
            this._debug = false;
            this._hiddenData = [];
            this._kbdLastKeyPressed = [];
            this.LOG = new Logger(WarpViewTreeViewComponent, this.debug);
        }
        Object.defineProperty(WarpViewTreeViewComponent.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (debug) {
                this._debug = debug;
                this.LOG.setDebug(debug);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewTreeViewComponent.prototype, "hiddenData", {
            get: function () {
                return this._hiddenData;
            },
            set: function (hiddenData) {
                this._hiddenData = __spread(hiddenData);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewTreeViewComponent.prototype, "kbdLastKeyPressed", {
            get: function () {
                return this._kbdLastKeyPressed;
            },
            set: function (kbdLastKeyPressed) {
                this.LOG.debug(['kbdLastKeyPressed'], kbdLastKeyPressed);
                this._kbdLastKeyPressed = kbdLastKeyPressed;
                if (kbdLastKeyPressed[0] === 'a') {
                    this.stateChange.next(true);
                }
                if (kbdLastKeyPressed[0] === 'n') {
                    this.stateChange.next(false);
                }
            },
            enumerable: false,
            configurable: true
        });
        WarpViewTreeViewComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.eventsSubscription = this.events.subscribe(function () { return _this.open(); });
            this.LOG.debug(['ngOnInit'], this.gtsList);
            var size = this.gtsList.length;
            for (var i = 0; i < size; i++) {
                this.hide[i + ''] = false;
            }
        };
        WarpViewTreeViewComponent.prototype.ngOnDestroy = function () {
            this.eventsSubscription.unsubscribe();
        };
        WarpViewTreeViewComponent.prototype.toggleVisibility = function (index) {
            this.LOG.debug(['toggleVisibility'], index, this.hide);
            this.hide[index + ''] = !this.hide[index + ''];
        };
        WarpViewTreeViewComponent.prototype.isHidden = function (index) {
            return !!this.hide[index + ''] ? !!this.hide[index + ''] : false;
        };
        WarpViewTreeViewComponent.prototype.isGts = function (node) {
            return GTSLib.isGts(node);
        };
        WarpViewTreeViewComponent.prototype.identify = function (index, item) {
            return index;
        };
        WarpViewTreeViewComponent.prototype.warpViewSelectedGTSHandler = function (event) {
            // this.LOG.debug(['warpViewSelectedGTS'], event);
            this.warpViewSelectedGTS.emit(event);
        };
        WarpViewTreeViewComponent.prototype.open = function () {
            var _this = this;
            this.gtsList.forEach(function (g, index) { return _this.hide[index + ''] = true; });
            setTimeout(function () { return _this.initOpen.next(); });
        };
        return WarpViewTreeViewComponent;
    }());
    WarpViewTreeViewComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-tree-view',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"list\">\n  <ul *ngIf=\"gtsList\">\n    <li *ngFor=\"let gts of gtsList; trackBy:identify; index as index; first as first\">\n      <warpview-chip\n        *ngIf=\"isGts(gts)\"\n        [options]=\"options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\" [param]=\"params[gts.id]\"\n        [node]=\"{gts: gts}\" [gtsFilter]=\"gtsFilter\" [debug]=\"debug\" [hiddenData]=\"hiddenData\"\n        [events]=\"stateChange.asObservable()\"></warpview-chip>\n      <span *ngIf=\"!isGts(gts)\">\n        <span *ngIf=\"gts\">\n          <span *ngIf=\"branch\">\n            <span>\n            <span [ngClass]=\"{expanded:  hide[index + ''], collapsed: !hide[index + '']}\"\n                  (click)=\"toggleVisibility(index)\" [id]=\"'span-' + index\"> </span>\n                    <small (click)=\"toggleVisibility(index)\"> List of {{gts.length}}\n                      item{{gts.length > 1 ? 's' : ''}}</small>\n           </span>\n          </span>\n          <span *ngIf=\"!branch\">\n            <span class=\"stack-level\">\n              <span [ngClass]=\"{expanded: hide[index + ''], collapsed: !hide[index + '']}\"\n                    (click)=\"toggleVisibility(index)\" [id]=\"'span-' + index\"></span>\n              <span (click)=\"toggleVisibility(index)\">{{first ? '[TOP]' : '[' + (index + 1) + ']'}}&nbsp;\n                <small [id]=\"'inner-' + index\">List of {{gts.length}} item{{gts.length > 1 ? 's' : ''}}</small>\n              </span>\n                  </span>\n          </span>\n    <warpview-tree-view [gtsList]=\"gts\" [branch]=\"true\" *ngIf=\"hide[index + '']\"\n                        [debug]=\"debug\" [gtsFilter]=\"gtsFilter\" [params]=\"params\"\n                        [events]=\"initOpen.asObservable()\"\n                        [options]=\"options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\"\n                        [kbdLastKeyPressed]=\"kbdLastKeyPressed\" [hiddenData]=\"hiddenData\"></warpview-tree-view>\n        </span>\n      </span>\n    </li>\n  </ul>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host ul{border:none;list-style:none;margin:0;overflow:hidden;padding:0}:host li{color:var(--gts-stack-font-color,#000);line-height:20px;padding:0 0 0 20px;position:relative}:host .list,:host li .stack-level{font-size:1em;padding-top:5px}:host .list+div,:host li .stack-level+div{padding-left:25px}:host li .expanded{background-image:var(--gts-tree-expanded-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==))}:host li .collapsed,:host li .expanded{background-position:0;background-repeat:no-repeat;margin-right:5px;padding:1px 10px}:host li .collapsed{background-image:var(--gts-tree-collapsed-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=))}:host li .gtsInfo{white-space:normal;word-wrap:break-word}:host li .gtsInfo[disabled]{color:#aaa;cursor:not-allowed}:host li .normal{background-color:#bbb;border-radius:50%;display:inline-block}:host li i,:host li span{cursor:pointer}:host li .selected{background-color:#adf;font-weight:700;padding:1px 5px}"]
                },] }
    ];
    WarpViewTreeViewComponent.ctorParameters = function () { return []; };
    WarpViewTreeViewComponent.propDecorators = {
        debug: [{ type: i0.Input, args: ['debug',] }],
        hiddenData: [{ type: i0.Input, args: ['hiddenData',] }],
        options: [{ type: i0.Input, args: ['options',] }],
        gtsFilter: [{ type: i0.Input, args: ['gtsFilter',] }],
        gtsList: [{ type: i0.Input, args: ['gtsList',] }],
        params: [{ type: i0.Input, args: ['params',] }],
        branch: [{ type: i0.Input, args: ['branch',] }],
        hidden: [{ type: i0.Input, args: ['hidden',] }],
        events: [{ type: i0.Input }],
        warpViewSelectedGTS: [{ type: i0.Output, args: ['warpViewSelectedGTS',] }],
        kbdLastKeyPressed: [{ type: i0.Input, args: ['kbdLastKeyPressed',] }]
    };

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
    var GTS = /** @class */ (function () {
        function GTS() {
        }
        return GTS;
    }());

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
    /**
     *
     */
    var WarpViewChipComponent = /** @class */ (function () {
        function WarpViewChipComponent(renderer) {
            this.renderer = renderer;
            this.param = new Param();
            this.options = new Param();
            this.warpViewSelectedGTS = new i0.EventEmitter();
            // the first character triggers change each filter apply to trigger events. it must be discarded.
            this._gtsFilter = 'x';
            this._debug = false;
            this._hiddenData = [];
            this._node = {
                selected: true,
                gts: GTS,
            };
            this.LOG = new Logger(WarpViewChipComponent, this.debug);
        }
        Object.defineProperty(WarpViewChipComponent.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (debug) {
                this._debug = debug;
                this.LOG.setDebug(debug);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewChipComponent.prototype, "hiddenData", {
            get: function () {
                return this._hiddenData;
            },
            set: function (hiddenData) {
                if (JSON.stringify(hiddenData) !== JSON.stringify(this._hiddenData)) {
                    this._hiddenData = hiddenData;
                    this.LOG.debug(['hiddenData'], hiddenData, this._node, this._node.gts, this._node.gts.c);
                    if (!!this._node && !!this._node.gts && !!this._node.gts.c) {
                        this.setState(this._hiddenData.indexOf(this._node.gts.id) === -1);
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewChipComponent.prototype, "gtsFilter", {
            get: function () {
                return this._gtsFilter;
            },
            set: function (gtsFilter) {
                this._gtsFilter = gtsFilter;
                if (this._gtsFilter.slice(1) !== '') {
                    this.setState(new RegExp(this._gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts)));
                }
                else {
                    this.setState(true);
                }
            },
            enumerable: false,
            configurable: true
        });
        WarpViewChipComponent.prototype.ngOnInit = function () {
            var _this = this;
            this._node = Object.assign(Object.assign({}, this.node), { selected: this._hiddenData.indexOf(this.node.gts.id) === -1 });
            if (!!this.events) {
                this.eventsSubscription = this.events.subscribe(function (state) { return _this.setState(state); });
            }
        };
        WarpViewChipComponent.prototype.ngOnDestroy = function () {
            if (!!this.eventsSubscription) {
                this.eventsSubscription.unsubscribe();
            }
        };
        WarpViewChipComponent.prototype.ngAfterViewInit = function () {
            if (this.gtsFilter.slice(1) !== '' && new RegExp(this.gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts))
                || this.hiddenData.indexOf(this._node.gts.id) > -1) {
                this.setState(false);
            }
            else {
                this.colorizeChip();
            }
        };
        WarpViewChipComponent.prototype.colorizeChip = function () {
            if (!!this.chip) {
                if (!!this._node.selected) {
                    var c = ColorLib.getColor(this._node.gts.id, this.options.scheme);
                    var color = (this.param || { datasetColor: c }).datasetColor || c;
                    this.renderer.setStyle(this.chip.nativeElement, 'background-color', color);
                    this.renderer.setStyle(this.chip.nativeElement, 'border-color', color);
                }
                else {
                    this.renderer.setStyle(this.chip.nativeElement, 'background-color', 'transparent');
                }
            }
        };
        WarpViewChipComponent.prototype.toArray = function (obj) {
            if (obj === undefined) {
                return [];
            }
            return Object.keys(obj).map(function (key) { return ({ name: key, value: obj[key] }); });
        };
        WarpViewChipComponent.prototype.switchPlotState = function (event) {
            event.preventDefault();
            this.setState(!this._node.selected);
            return false;
        };
        WarpViewChipComponent.prototype.setState = function (state) {
            if (this._node && this._node.gts) {
                this.LOG.debug(['switchPlotState'], state, this._node.selected);
                if (this._node.selected !== state) {
                    this._node.selected = !!state;
                    this.LOG.debug(['switchPlotState'], 'emit');
                    this.warpViewSelectedGTS.emit(this._node);
                }
                this.colorizeChip();
            }
        };
        WarpViewChipComponent.prototype.identify = function (index, item) {
            return index;
        };
        return WarpViewChipComponent;
    }());
    WarpViewChipComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-chip',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n   <span (click)=\"switchPlotState($event)\" *ngIf=\"_node && _node.gts && _node.gts.l\">\n     <i class=\"normal\" #chip></i>\n     <span class=\"gtsInfo\">\n       <span class='gts-classname'>&nbsp;{{_node.gts.c}}</span>\n       <span class='gts-separator'>&#x007B; </span>\n       <span *ngFor=\"let label of toArray(_node.gts.l); index as index; last as last; trackBy:identify\">\n         <span class='gts-labelname'>{{label.name}}</span>\n         <span class='gts-separator'>=</span>\n         <span class='gts-labelvalue'>{{label.value}}</span>\n         <span [hidden]=\"last\">, </span>\n       </span>\n       <span class=\"gts-separator\"> &#x007D; </span>\n         <span class='gts-separator'>&#x007B; </span>\n         <span *ngFor=\"let label of toArray(_node.gts.a); index as index; last as last; trackBy:identify\">\n           <span class='gts-attrname'>{{label.name}}</span>\n           <span class='gts-separator'>=</span>\n           <span class='gts-attrvalue'>{{label.value}}</span>\n           <span [hidden]=\"last\">, </span>\n         </span>\n       <span class=\"gts-separator\"> &#x007D;</span>\n       </span>\n   </span>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host .normal,:host div span{cursor:pointer}:host .normal{background-color:#bbb;border:2px solid #454545;border-radius:50%;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}"]
                },] }
    ];
    WarpViewChipComponent.ctorParameters = function () { return [
        { type: i0.Renderer2 }
    ]; };
    WarpViewChipComponent.propDecorators = {
        chip: [{ type: i0.ViewChild, args: ['chip',] }],
        node: [{ type: i0.Input, args: ['node',] }],
        param: [{ type: i0.Input, args: ['param',] }],
        options: [{ type: i0.Input, args: ['options',] }],
        events: [{ type: i0.Input }],
        debug: [{ type: i0.Input, args: ['debug',] }],
        hiddenData: [{ type: i0.Input, args: ['hiddenData',] }],
        gtsFilter: [{ type: i0.Input, args: ['gtsFilter',] }],
        warpViewSelectedGTS: [{ type: i0.Output, args: ['warpViewSelectedGTS',] }]
    };

    /**
     *
     */
    var WarpViewImageComponent = /** @class */ (function (_super) {
        __extends(WarpViewImageComponent, _super);
        function WarpViewImageComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.imageTitle = '';
            _this.parentWidth = -1;
            _this.LOG = new Logger(WarpViewImageComponent, _this._debug);
            return _this;
        }
        WarpViewImageComponent.prototype.ngAfterViewInit = function () {
            this.LOG.debug(['ngAfterViewInit'], this._options);
            this.drawChart();
        };
        WarpViewImageComponent.prototype.update = function (options, refresh) {
            this.drawChart();
        };
        WarpViewImageComponent.prototype.onResize = function () {
            var _this = this;
            if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth || this.parentWidth <= 0) {
                this.parentWidth = this.el.nativeElement.parentElement.clientWidth;
                clearTimeout(this.resizeTimer);
                this.resizeTimer = setTimeout(function () {
                    if (_this.el.nativeElement.parentElement.clientWidth > 0) {
                        _this.LOG.debug(['onResize'], _this.el.nativeElement.parentElement.clientWidth);
                        _this.drawChart();
                    }
                    else {
                        _this.onResize();
                    }
                }, 150);
            }
        };
        WarpViewImageComponent.prototype.drawChart = function () {
            if (!this._data || !this._data.data || this._data.data.length === 0) {
                return;
            }
            this.initChart(this.el);
            this.toDisplay = [];
            var gts = this._data;
            this.LOG.debug(['drawChart', 'gts'], gts);
            if (typeof gts === 'string') {
                try {
                    gts = JSON.parse(gts);
                }
                catch (error) {
                    // empty : it's a base64 string
                }
            }
            if (gts.data && gts.data.length > 0 && GTSLib.isEmbeddedImage(gts.data[0])) {
                this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {});
                this.toDisplay.push(gts.data[0]);
            }
            else if (gts.data && GTSLib.isEmbeddedImage(gts.data)) {
                this.toDisplay.push(gts.data);
            }
            this.LOG.debug(['drawChart', 'this.data', 'this.toDisplay'], this.data, this.toDisplay);
            this.loading = false;
            this.chartDraw.emit();
        };
        WarpViewImageComponent.prototype.getStyle = function () {
            this.LOG.debug(['getStyle'], this._options);
            if (!this._options) {
                return {};
            }
            else {
                var style = { 'background-color': this._options.bgColor || 'transparent', width: this.width, height: 'auto' };
                if (this._options.fontColor) {
                    style.color = this._options.fontColor;
                }
                this.LOG.debug(['getStyle', 'style'], style);
                return style;
            }
        };
        WarpViewImageComponent.prototype.convert = function (data) {
            return [];
        };
        return WarpViewImageComponent;
    }(WarpViewComponent));
    WarpViewImageComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-image',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div class=\"chart-container\" id=\"wrapper\" *ngIf=\"toDisplay\">\n    <div *ngFor=\"let img of toDisplay\" [ngStyle]=\"getStyle()\">\n      <img [src]=\"img\" class=\"responsive\" alt=\"Result\"/>\n    </div>\n  </div>\n  <warpview-spinner *ngIf=\"!toDisplay\" message=\"Parsing data\"></warpview-spinner>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host div{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}:host .chart-container{height:var(--warp-view-chart-height,100%);overflow:hidden;position:relative;width:var(--warp-view-chart-width,100%)}:host .chart-container div{display:block;height:99%!important;width:99%}:host .chart-container div .responsive{-o-object-fit:scale-down;height:99%;object-fit:scale-down;width:99%}"]
                },] }
    ];
    WarpViewImageComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewImageComponent.propDecorators = {
        imageTitle: [{ type: i0.Input, args: ['imageTitle',] }],
        onResize: [{ type: i0.HostListener, args: ['window:resize',] }]
    };

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
    var MapLib = /** @class */ (function () {
        function MapLib() {
        }
        MapLib.toLeafletMapPaths = function (data, hiddenData, scheme) {
            var paths = [];
            var size = (data.gts || []).length;
            var _loop_1 = function (i) {
                var gts = data.gts[i];
                var params = (data.params || [])[i];
                if (!params) {
                    params = {};
                }
                if (GTSLib.isGtsToPlotOnMap(gts) && (hiddenData || []).filter(function (id) { return id === gts.id; }).length === 0) {
                    var path = {};
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
            };
            for (var i = 0; i < size; i++) {
                _loop_1(i);
            }
            return paths;
        };
        MapLib.gtsToPath = function (gts) {
            var path = [];
            var size = (gts.v || []).length;
            for (var i = 0; i < size; i++) {
                var v = gts.v[i];
                var l = v.length;
                if (l >= 4) {
                    // timestamp, lat, lon, elev?, value
                    path.push({ ts: Math.floor(v[0]), lat: v[1], lon: v[2], val: v[l - 1] });
                }
            }
            return path;
        };
        MapLib.extractCommonParameters = function (obj, params, index, scheme) {
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
        };
        MapLib.validateWeightedDotsPositionArray = function (posArray, params) {
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
            var step = (posArray.maxValue - posArray.minValue) / posArray.numSteps;
            var steps = [];
            for (var i = 0; i < posArray.numSteps - 1; i++) {
                steps[i] = posArray.minValue + (i + 1) * step;
            }
            steps[posArray.numSteps - 1] = posArray.maxValue;
            var size = (posArray || []).length;
            for (var i = 0; i < size; i++) {
                var pos = posArray[i];
                var value = pos[2];
                pos[4] = posArray.numSteps - 1;
                for (var k in steps) {
                    if (value <= steps[k]) {
                        pos[4] = k;
                        break;
                    }
                }
            }
            return true;
        };
        MapLib.toLeafletMapPositionArray = function (data, hiddenData, scheme) {
            var positions = [];
            var size = (data.gts || []).length;
            var _loop_2 = function (i) {
                var gts = data.gts[i];
                if (GTSLib.isPositionArray(gts) && (hiddenData || []).filter(function (id) { return id === gts.id; }).length === 0) {
                    this_1.LOG.debug(['toLeafletMapPositionArray'], gts, data.params ? data.params[i] : '');
                    var posArray = gts;
                    var params = data.params ? data.params[i] || {} : {};
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
                    this_1.LOG.debug(['toLeafletMapPositionArray', 'posArray'], posArray);
                    positions.push(posArray);
                }
            };
            var this_1 = this;
            for (var i = 0; i < size; i++) {
                _loop_2(i);
            }
            return positions;
        };
        MapLib.validateWeightedColoredDotsPositionArray = function (posArray, params) {
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
            var re = /^#(?:[0-9a-f]{3}){1,2}$/i;
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
            var step = (posArray.maxColorValue - posArray.minColorValue) / posArray.numColorSteps;
            var steps = [];
            for (var j = 0; j < posArray.numColorSteps; j++) {
                steps[j] = posArray.minColorValue + (j + 1) * step;
            }
            posArray.steps = steps;
            posArray.positions.forEach(function (pos) {
                var colorValue = pos[3];
                pos[5] = posArray.numColorSteps - 1;
                for (var k = 0; k < steps.length - 1; k++) {
                    if (colorValue < steps[k]) {
                        pos[5] = k;
                        break;
                    }
                }
            });
        };
        MapLib.getBoundsArray = function (paths, positionsData, annotationsData, geoJson) {
            var pointsArray = [];
            var size;
            this.LOG.debug(['getBoundsArray', 'paths'], paths);
            size = (paths || []).length;
            for (var i = 0; i < size; i++) {
                var path = paths[i];
                var s = (path.path || []).length;
                for (var j = 0; j < s; j++) {
                    var p = path.path[j];
                    pointsArray.push([p.lat, p.lon]);
                }
            }
            this.LOG.debug(['getBoundsArray', 'positionsData'], positionsData);
            size = (positionsData || []).length;
            for (var i = 0; i < size; i++) {
                var position = positionsData[i];
                var s = (position.positions || []).length;
                for (var j = 0; j < s; j++) {
                    var p = position.positions[j];
                    pointsArray.push([p[0], p[1]]);
                }
            }
            this.LOG.debug(['getBoundsArray', 'annotationsData'], annotationsData);
            size = (annotationsData || []).length;
            for (var i = 0; i < size; i++) {
                var annotation = annotationsData[i];
                var s = (annotation.path || []).length;
                for (var j = 0; j < s; j++) {
                    var p = annotation.path[j];
                    pointsArray.push([p.lat, p.lon]);
                }
            }
            size = (geoJson || []).length;
            for (var i = 0; i < size; i++) {
                var g = geoJson[i];
                switch (g.geometry.type) {
                    case 'MultiPolygon':
                        g.geometry.coordinates.forEach(function (c) { return c.forEach(function (m) { return m.forEach(function (p) { return pointsArray.push([p[1], p[0]]); }); }); });
                        break;
                    case 'Polygon':
                        g.geometry.coordinates.forEach(function (c) { return c.forEach(function (p) { return pointsArray.push([p[1], p[0]]); }); });
                        break;
                    case 'LineString':
                        g.geometry.coordinates.forEach(function (p) { return pointsArray.push([p[1], p[0]]); });
                        break;
                    case 'Point':
                        pointsArray.push([g.geometry.coordinates[1], g.geometry.coordinates[0]]);
                        break;
                }
            }
            if (pointsArray.length === 1) {
                return pointsArray;
            }
            var south = 90;
            var west = -180;
            var north = -90;
            var east = 180;
            this.LOG.debug(['getBoundsArray'], pointsArray);
            size = (pointsArray || []).length;
            for (var i = 0; i < size; i++) {
                var point = pointsArray[i];
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
        };
        MapLib.pathDataToLeaflet = function (pathData) {
            var path = [];
            var size = pathData.length;
            for (var i = 0; i < size; i++) {
                path.push([pathData[i].lat, pathData[i].lon]);
            }
            return path;
        };
        MapLib.toGeoJSON = function (data) {
            var defShapes = ['Point', 'LineString', 'Polygon', 'MultiPolygon'];
            var geoJsons = [];
            data.gts.forEach(function (d) {
                if (d && d.type && d.type === 'Feature' && d.geometry && d.geometry.type && defShapes.indexOf(d.geometry.type) > -1) {
                    geoJsons.push(d);
                }
                else if (d && d.type && defShapes.indexOf(d.type) > -1) {
                    geoJsons.push({ type: 'Feature', geometry: d });
                }
            });
            return geoJsons;
        };
        MapLib.updatePositionArrayToLeaflet = function (positionArray) {
            var latLng = [];
            var size = (positionArray || []).length;
            for (var i = 0; i < size; i++) {
                var pos = positionArray[i];
                latLng.push([pos[0], pos[1]]);
            }
            return latLng;
        };
        return MapLib;
    }());
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
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, Tiles\n style by <a href=\"https://www.hotosm.org/\" target=\"_blank\">Humanitarian OpenStreetMap Team</a> hosted by\n <a href=\"https://openstreetmap.fr/\" target=\"_blank\">OpenStreetMap France</a>"
        },
        TOPO: {
            link: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: "Map data: &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors,\n <a href=\"http://viewfinderpanoramas.org\">SRTM</a> | Map style: &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a>\n  (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>)"
        },
        TOPO2: {
            link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN,\n       GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
        },
        SURFER: {
            link: 'https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png',
            attribution: "Imagery from <a href=\"http://giscience.uni-hd.de/\">GIScience Research Group @ University of\n Heidelberg</a> | Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
        },
        HYDRA: {
            link: 'https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
            attribution: "Tiles courtesy of <a href=\"http://openstreetmap.se/\" target=\"_blank\">OpenStreetMap Sweden</a>\n &mdash; Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
        },
        HYDRA2: {
            link: 'https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png',
            attribution: "Tiles courtesy of <a href=\"http://openstreetmap.se/\" target=\"_blank\">OpenStreetMap Sweden</a>\n &mdash; Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
        },
        TONER: {
            link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
            attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>,\n <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy;\n  <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            subdomains: 'abcd'
        },
        TONER_LITE: {
            link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
            attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>,\n <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy;\n  <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            subdomains: 'abcd',
        },
        TERRAIN: {
            link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
            attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>,\n <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy;\n <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            subdomains: 'abcd',
        },
        ESRI: {
            link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
            attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan,\n METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
        },
        SATELLITE: {
            link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN,\n IGP, UPR-EGP, and the GIS User Community"
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
            attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>,\n <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy;\n  <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            subdomains: 'abcd',
        },
        CARTODB: {
            link: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy;\n <a href=\"https://carto.com/attributions\">CartoDB</a>",
            subdomains: 'abcd',
        },
        CARTODB_DARK: {
            link: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy;\n <a href=\"https://carto.com/attributions\">CartoDB</a>",
            subdomains: 'abcd',
        },
    };

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
    /**
     *
     */
    var WarpViewMapComponent = /** @class */ (function () {
        function WarpViewMapComponent(el, sizeService, renderer) {
            var _this = this;
            this.el = el;
            this.sizeService = sizeService;
            this.renderer = renderer;
            this.heatData = [];
            this.responsive = false;
            this.showLegend = true;
            this.width = ChartLib.DEFAULT_WIDTH;
            this.height = ChartLib.DEFAULT_HEIGHT;
            this.change = new i0.EventEmitter();
            this.chartDraw = new i0.EventEmitter();
            this.divider = 1;
            this._options = new Param();
            this._firstDraw = true;
            this._debug = false;
            this.defOptions = ChartLib.mergeDeep(new Param(), {
                map: {
                    heatControls: false,
                    tiles: [],
                    dotsLimit: 1000,
                    animate: false
                },
                timeMode: 'date',
                showRangeSelector: true,
                gridLineColor: '#8e8e8e',
                showDots: false,
                timeZone: 'UTC',
                timeUnit: 'us',
                bounds: {}
            });
            this.pointslayer = [];
            this.annotationsMarkers = [];
            this.positionArraysMarkers = [];
            this._iconAnchor = [20, 38];
            this._popupAnchor = [0, -50];
            this.pathData = [];
            this.positionData = [];
            this.geoJson = [];
            this.firstDraw = true;
            this.finalHeight = 0;
            // Layers
            this.pathDataLayer = Leaflet__default['default'].featureGroup();
            this.positionDataLayer = Leaflet__default['default'].featureGroup();
            this.tileLayerGroup = Leaflet__default['default'].featureGroup();
            this.geoJsonLayer = Leaflet__default['default'].featureGroup();
            this.LOG = new Logger(WarpViewMapComponent, this.debug);
            this.LOG.debug(['constructor'], this.debug);
            this.sizeService.sizeChanged$.subscribe(function () {
                if (_this._map) {
                    _this.resizeMe();
                }
            });
        }
        Object.defineProperty(WarpViewMapComponent.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (debug) {
                this._debug = debug;
                this.LOG.setDebug(debug);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewMapComponent.prototype, "options", {
            set: function (options) {
                this.LOG.debug(['onOptions'], options);
                if (!deepEqual__default['default'](this._options, options)) {
                    var reZoom = options.map.startZoom !== this._options.map.startZoom
                        || options.map.startLat !== this._options.map.startLat
                        || options.map.startLong !== this._options.map.startLong;
                    this._options = options;
                    this.divider = GTSLib.getDivider(this._options.timeUnit);
                    this.drawMap(reZoom);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewMapComponent.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (data) {
                this.LOG.debug(['onData'], data);
                this.pointslayer = [];
                this.annotationsMarkers = [];
                this.positionArraysMarkers = [];
                if (!!data) {
                    this._data = data;
                    this.drawMap(true);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewMapComponent.prototype, "hiddenData", {
            get: function () {
                return this._hiddenData;
            },
            set: function (hiddenData) {
                this._hiddenData = hiddenData;
                this.drawMap(false);
            },
            enumerable: false,
            configurable: true
        });
        WarpViewMapComponent.prototype.ngOnInit = function () {
            this._options = ChartLib.mergeDeep(this.defOptions, this._options);
        };
        WarpViewMapComponent.prototype.resizeMe = function () {
            var _this = this;
            this.LOG.debug(['resizeMe'], this.wrapper.nativeElement.parentElement.getBoundingClientRect());
            var height = this.wrapper.nativeElement.parentElement.getBoundingClientRect().height;
            var width = this.wrapper.nativeElement.parentElement.getBoundingClientRect().width;
            if (this._options.map.showTimeSlider && this.timeSlider && this.timeSlider.nativeElement) {
                height -= this.timeSlider.nativeElement.getBoundingClientRect().height;
            }
            if (this._options.map.showTimeRange && this.timeRangeSlider && this.timeRangeSlider.nativeElement) {
                height -= this.timeRangeSlider.nativeElement.getBoundingClientRect().height;
            }
            this.finalHeight = height;
            this.renderer.setStyle(this.mapDiv.nativeElement, 'width', 'calc(' + width + 'px - '
                + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
                + ' - '
                + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
                + ')');
            this.renderer.setStyle(this.mapDiv.nativeElement, 'height', 'calc(' + height + 'px - '
                + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
                + ' - '
                + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
                + ')');
            this.width = width;
            this.height = height;
            if (!!this._map) {
                setTimeout(function () { return _this._map.invalidateSize(); });
            }
        };
        WarpViewMapComponent.prototype.heatRadiusDidChange = function (event) {
            this._heatLayer.setOptions({ radius: event.detail.valueAsNumber });
            this.LOG.debug(['heatRadiusDidChange'], event.detail.valueAsNumber);
        };
        WarpViewMapComponent.prototype.heatBlurDidChange = function (event) {
            this._heatLayer.setOptions({ blur: event.detail.valueAsNumber });
            this.LOG.debug(['heatBlurDidChange'], event.detail.valueAsNumber);
        };
        WarpViewMapComponent.prototype.heatOpacityDidChange = function (event) {
            var minOpacity = event.detail.valueAsNumber / 100;
            this._heatLayer.setOptions({ minOpacity: minOpacity });
            this.LOG.debug(['heatOpacityDidChange'], event.detail.valueAsNumber);
        };
        WarpViewMapComponent.prototype.drawMap = function (reZoom) {
            this.LOG.debug(['drawMap'], this._data);
            this._options = ChartLib.mergeDeep(this.defOptions, this._options);
            this.timeStart = this._options.map.timeStart;
            moment__default['default'].tz.setDefault(this._options.timeZone);
            var gts = this._data;
            if (!gts) {
                return;
            }
            if (typeof gts === 'string') {
                try {
                    gts = JSON.parse(gts);
                }
                catch (error) {
                    return;
                }
            }
            if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
                gts = gts[0];
            }
            if (!!this._map) {
                this._map.invalidateSize(true);
            }
            var dataList;
            var params;
            this.LOG.debug(['drawMap', 'this._options'], Object.assign({}, this._options));
            if (gts.data) {
                dataList = gts.data;
                this._options = ChartLib.mergeDeep(gts.globalParams || {}, this._options);
                this.timeSpan = this.timeSpan || this._options.map.timeSpan;
                params = gts.params;
            }
            else {
                dataList = gts;
                params = [];
            }
            this.divider = GTSLib.getDivider(this._options.timeUnit);
            this.LOG.debug(['drawMap'], dataList, this._options, gts.globalParams);
            var flattenGTS = GTSLib.flatDeep(dataList);
            var size = flattenGTS.length;
            for (var i = 0; i < size; i++) {
                var item = flattenGTS[i];
                if (GTSLib.isGts(item)) {
                    Timsort.sort(item.v, function (a, b) { return a[0] - b[0]; });
                    item.i = i;
                    i++;
                }
            }
            this.LOG.debug(['GTSLib.flatDeep(dataList)'], flattenGTS);
            this.displayMap({ gts: flattenGTS, params: params }, reZoom);
        };
        WarpViewMapComponent.prototype.icon = function (color, marker) {
            if (marker === void 0) { marker = ''; }
            var c = "" + color.slice(1);
            var m = marker !== '' ? marker : 'circle';
            return Leaflet__default['default'].icon({
                // tslint:disable-next-line:max-line-length
                iconUrl: "https://cdn.mapmarker.io/api/v1/font-awesome/v4/pin?icon=fa-" + m + "&iconSize=17&size=40&hoffset=" + (m === 'circle' ? 0 : -1) + "&voffset=-4&color=fff&background=" + c,
                iconAnchor: this._iconAnchor,
                popupAnchor: this._popupAnchor
            });
        };
        WarpViewMapComponent.prototype.patchMapTileGapBug = function () {
            // Workaround for 1px lines appearing in some browsers due to fractional transforms
            // and resulting anti-aliasing. adapted from @cmulders' solution:
            // https://github.com/Leaflet/Leaflet/issues/3575#issuecomment-150544739
            // @ts-ignore
            var originalInitTile = Leaflet__default['default'].GridLayer.prototype._initTile;
            if (originalInitTile.isPatched) {
                return;
            }
            Leaflet__default['default'].GridLayer.include({
                _initTile: function (tile) {
                    originalInitTile.call(this, tile);
                    var tileSize = this.getTileSize();
                    tile.style.width = tileSize.x + 1.5 + 'px';
                    tile.style.height = tileSize.y + 1 + 'px';
                }
            });
            // @ts-ignore
            Leaflet__default['default'].GridLayer.prototype._initTile.isPatched = true;
        };
        WarpViewMapComponent.prototype.displayMap = function (data, reDraw) {
            var _this = this;
            if (reDraw === void 0) { reDraw = false; }
            this.pointslayer = [];
            this.LOG.debug(['drawMap'], data, this._options, this._hiddenData || []);
            if (!this.lowerTimeBound) {
                this.lowerTimeBound = this._options.map.timeSliderMin / this.divider;
                this.upperTimeBound = this._options.map.timeSliderMax / this.divider;
            }
            var height = this.height || ChartLib.DEFAULT_HEIGHT;
            var width = this.width || ChartLib.DEFAULT_WIDTH;
            if (this.responsive && this.finalHeight === 0) {
                this.resizeMe();
            }
            else {
                if (this._options.map.showTimeSlider && this.timeSlider && this.timeSlider.nativeElement) {
                    height -= this.timeSlider.nativeElement.getBoundingClientRect().height;
                }
                if (this._options.map.showTimeRange && this.timeRangeSlider && this.timeRangeSlider.nativeElement) {
                    height -= this.timeRangeSlider.nativeElement.getBoundingClientRect().height;
                }
            }
            this.width = width;
            this.height = height;
            if (data.gts.length === 0) {
                return;
            }
            this.pathData = MapLib.toLeafletMapPaths(data, this._hiddenData || [], this._options.scheme) || [];
            this.LOG.debug(['displayMap'], 'this.pathData', this.pathData);
            this.positionData = MapLib.toLeafletMapPositionArray(data, this._hiddenData || [], this._options.scheme) || [];
            this.LOG.debug(['displayMap'], 'this.positionData', this.positionData);
            this.geoJson = MapLib.toGeoJSON(data);
            this.LOG.debug(['displayMap'], 'this.geoJson', this.geoJson);
            if (this._options.map.mapType !== 'NONE') {
                var map = MapLib.mapTypes[this._options.map.mapType || 'DEFAULT'];
                this.LOG.debug(['displayMap'], 'map', map);
                var mapOpts = {
                    maxZoom: 24,
                    maxNativeZoom: 19,
                };
                if (map.attribution) {
                    mapOpts.attribution = map.attribution;
                }
                if (map.subdomains) {
                    mapOpts.subdomains = map.subdomains;
                }
                this.tilesLayer = Leaflet__default['default'].tileLayer(map.link, mapOpts);
            }
            if (!!this._map) {
                this.LOG.debug(['displayMap'], 'map exists');
                this.pathDataLayer.clearLayers();
                this.positionDataLayer.clearLayers();
                this.geoJsonLayer.clearLayers();
                this.tileLayerGroup.clearLayers();
            }
            else {
                this.LOG.debug(['displayMap'], 'build map');
                this._map = Leaflet__default['default'].map(this.mapDiv.nativeElement, {
                    preferCanvas: true,
                    layers: [this.tileLayerGroup, this.geoJsonLayer, this.pathDataLayer, this.positionDataLayer],
                    zoomAnimation: true,
                    maxZoom: 24
                });
                this.geoJsonLayer.bringToBack();
                this.tilesLayer.bringToBack(); // TODO: tester
                this._map.on('load', function () { return _this.LOG.debug(['displayMap', 'load'], _this._map.getCenter().lng, _this.currentLong, _this._map.getZoom()); });
                this._map.on('zoomend', function () {
                    if (!_this.firstDraw) {
                        _this.currentZoom = _this._map.getZoom();
                    }
                });
                this._map.on('moveend', function () {
                    if (!_this.firstDraw) {
                        _this.currentLat = _this._map.getCenter().lat;
                        _this.currentLong = _this._map.getCenter().lng;
                    }
                });
            }
            this.tilesLayer.addTo(this.tileLayerGroup);
            this.LOG.debug(['displayMap'], 'build map', this.tilesLayer);
            // For each path
            var pathDataSize = (this.pathData || []).length;
            for (var i = 0; i < pathDataSize; i++) {
                var path = this.pathData[i];
                if (!!path) {
                    this.updateGtsPath(path);
                }
            }
            // For each position
            var positionsSize = (this.positionData || []).length;
            for (var i = 0; i < positionsSize; i++) {
                this.updatePositionArray(this.positionData[i]);
            }
            (this._options.map.tiles || []).forEach(function (t) {
                _this.LOG.debug(['displayMap'], t);
                if (_this._options.map.showTimeRange) {
                    _this.tileLayerGroup.addLayer(Leaflet__default['default'].tileLayer(t
                        .replace('{start}', moment__default['default'](_this.timeStart).toISOString())
                        .replace('{end}', moment__default['default'](_this.timeEnd).toISOString()), {
                        subdomains: 'abcd',
                        maxNativeZoom: 19,
                        maxZoom: 40
                    }));
                }
                else {
                    _this.tileLayerGroup.addLayer(Leaflet__default['default'].tileLayer(t, {
                        subdomains: 'abcd',
                        maxNativeZoom: 19,
                        maxZoom: 40
                    }));
                }
            });
            this.LOG.debug(['displayMap', 'geoJson'], this.geoJson);
            var size = (this.geoJson || []).length;
            var _loop_1 = function (i) {
                var m = this_1.geoJson[i];
                var color = ColorLib.getColor(i, this_1._options.scheme);
                var opts = {
                    style: function () { return ({
                        color: (data.params && data.params[i]) ? data.params[i].color || color : color,
                        fillColor: (data.params && data.params[i])
                            ? ColorLib.transparentize(data.params[i].fillColor || color)
                            : ColorLib.transparentize(color),
                    }); }
                };
                if (m.geometry.type === 'Point') {
                    opts.pointToLayer = function (geoJsonPoint, latlng) { return Leaflet__default['default'].marker(latlng, {
                        icon: _this.icon(color, (data.params && data.params[i]) ? data.params[i].marker : 'circle'),
                        opacity: 1,
                    }); };
                }
                var display = '';
                var geoShape = Leaflet__default['default'].geoJSON(m, opts);
                if (m.properties) {
                    Object.keys(m.properties).forEach(function (k) { return display += "<b>" + k + "</b>: " + m.properties[k] + "<br />"; });
                    geoShape.bindPopup(display);
                }
                geoShape.addTo(this_1.geoJsonLayer);
            };
            var this_1 = this;
            for (var i = 0; i < size; i++) {
                _loop_1(i);
            }
            if (this.pathData.length > 0 || this.positionData.length > 0 || this.geoJson.length > 0) {
                // Fit map to curves
                var group = Leaflet__default['default'].featureGroup([this.geoJsonLayer, this.positionDataLayer, this.pathDataLayer]);
                this.LOG.debug(['displayMap', 'setView'], 'fitBounds', group.getBounds());
                this.LOG.debug(['displayMap', 'setView'], { lat: this.currentLat, lng: this.currentLong }, {
                    lat: this._options.map.startLat,
                    lng: this._options.map.startLong
                });
                this.bounds = group.getBounds();
                setTimeout(function () {
                    if (!!_this.bounds && _this.bounds.isValid()) {
                        if ((_this.currentLat || _this._options.map.startLat) && (_this.currentLong || _this._options.map.startLong)) {
                            _this.LOG.debug(['displayMap', 'setView'], 'fitBounds', 'already have bounds');
                            _this._map.setView({
                                lat: _this.currentLat || _this._options.map.startLat || 0,
                                lng: _this.currentLong || _this._options.map.startLong || 0
                            }, _this.currentZoom || _this._options.map.startZoom || 10, { animate: false, duration: 500 });
                        }
                        else {
                            _this.LOG.debug(['displayMap', 'setView'], 'fitBounds', 'this.bounds', _this.bounds);
                            _this._map.fitBounds(_this.bounds, { padding: [1, 1], animate: false, duration: 0 });
                        }
                        _this.currentLat = _this._map.getCenter().lat;
                        _this.currentLong = _this._map.getCenter().lng;
                    }
                    else {
                        _this.LOG.debug(['displayMap', 'setView'], 'invalid bounds', { lat: _this.currentLat, lng: _this.currentLong });
                        _this._map.setView({
                            lat: _this.currentLat || _this._options.map.startLat || 0,
                            lng: _this.currentLong || _this._options.map.startLong || 0
                        }, _this.currentZoom || _this._options.map.startZoom || 10, {
                            animate: false,
                            duration: 500
                        });
                    }
                }, 10);
            }
            else {
                this.LOG.debug(['displayMap', 'lost'], 'lost', this.currentZoom, this._options.map.startZoom);
                this._map.setView([
                    this.currentLat || this._options.map.startLat || 0,
                    this.currentLong || this._options.map.startLong || 0
                ], this.currentZoom || this._options.map.startZoom || 2, {
                    animate: false,
                    duration: 0
                });
            }
            if (this.heatData && this.heatData.length > 0) {
                this._heatLayer = Leaflet__default['default'].heatLayer(this.heatData, {
                    radius: this._options.map.heatRadius,
                    blur: this._options.map.heatBlur,
                    minOpacity: this._options.map.heatOpacity
                });
                this._heatLayer.addTo(this._map);
            }
            this.firstDraw = false;
            this.resizeMe();
            this.patchMapTileGapBug();
            this.chartDraw.emit(true);
        };
        WarpViewMapComponent.prototype.getGTSDots = function (gts) {
            var dots = [];
            var icon;
            var size;
            switch (gts.render) {
                case 'marker':
                    icon = this.icon(gts.color, gts.marker);
                    size = (gts.path || []).length;
                    for (var i = 0; i < size; i++) {
                        var g = gts.path[i];
                        var marker = Leaflet__default['default'].marker(g, { icon: icon, opacity: 1 });
                        this.addPopup(gts, g.val, g.ts, marker);
                        dots.push(marker);
                    }
                    break;
                case 'weightedDots':
                    size = (gts.path || []).length;
                    for (var i = 0; i < size; i++) {
                        var p = gts.path[i];
                        if ((this._hiddenData || []).filter(function (h) { return h === gts.key; }).length === 0) {
                            var v = parseInt(p.val, 10);
                            if (isNaN(v)) {
                                v = 0;
                            }
                            var radius = 50 * v / ((gts.maxValue || 1) - (gts.minValue || 0));
                            var marker = Leaflet__default['default'].circleMarker(p, {
                                radius: radius === 0 ? 1 : radius,
                                color: gts.borderColor || 'transparent',
                                fillColor: gts.color, fillOpacity: 0.5,
                                weight: 1
                            });
                            this.addPopup(gts, p.val, p.ts, marker);
                            dots.push(marker);
                        }
                    }
                    break;
                case 'dots':
                default:
                    size = (gts.path || []).length;
                    for (var i = 0; i < size; i++) {
                        var g = gts.path[i];
                        var marker = Leaflet__default['default'].circleMarker(g, {
                            radius: gts.baseRadius || MapLib.BASE_RADIUS,
                            color: gts.color,
                            fillColor: gts.color,
                            fillOpacity: 1
                        });
                        this.addPopup(gts, g.val, g.ts, marker);
                        dots.push(marker);
                    }
                    break;
            }
            return dots;
        };
        WarpViewMapComponent.prototype.updateGtsPath = function (gts) {
            var path = MapLib.pathDataToLeaflet(gts.path);
            var group = Leaflet__default['default'].featureGroup();
            if ((path || []).length > 1 && !!gts.line && gts.render === 'dots') {
                if (!!this._options.map.animate) {
                    group.addLayer(leafletAntPath.antPath(path || [], {
                        delay: 800, dashArray: [10, 100],
                        weight: 5, color: ColorLib.transparentize(gts.color, 0.5),
                        pulseColor: gts.color,
                        paused: false, reverse: false, hardwareAccelerated: true, hardwareAcceleration: true
                    }));
                }
                else {
                    group.addLayer(Leaflet__default['default'].polyline(path || [], { color: gts.color, opacity: 0.5 }));
                }
            }
            var dots = this.getGTSDots(gts);
            var size = (dots || []).length;
            for (var i = 0; i < size; i++) {
                group.addLayer(dots[i]);
            }
            this.pathDataLayer.addLayer(group);
        };
        WarpViewMapComponent.prototype.addPopup = function (positionData, value, ts, marker) {
            if (!!positionData) {
                var date = void 0;
                if (ts && !this._options.timeMode || this._options.timeMode !== 'timestamp') {
                    date = (GTSLib.toISOString(ts, this.divider, this._options.timeZone) || '')
                        .replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '');
                }
                var content_1 = '';
                content_1 = "<p>" + date + "</p><p><b>" + positionData.key + "</b>: " + (value || 'na') + "</p>";
                Object.keys(positionData.properties || []).forEach(function (k) { return content_1 += "<b>" + k + "</b>: " + positionData.properties[k] + "<br />"; });
                marker.bindPopup(content_1);
            }
        };
        WarpViewMapComponent.prototype.updatePositionArray = function (positionData) {
            var group = Leaflet__default['default'].featureGroup();
            if ((this._hiddenData || []).filter(function (h) { return h === positionData.key; }).length === 0) {
                var path = MapLib.updatePositionArrayToLeaflet(positionData.positions);
                if ((positionData.positions || []).length > 1 && !!positionData.line) {
                    if (!!this._options.map.animate) {
                        group.addLayer(leafletAntPath.antPath(path || [], {
                            delay: 800, dashArray: [10, 100],
                            weight: 5, color: ColorLib.transparentize(positionData.color, 0.5),
                            pulseColor: positionData.color,
                            paused: false, reverse: false, hardwareAccelerated: true, hardwareAcceleration: true
                        }));
                    }
                    else {
                        group.addLayer(Leaflet__default['default'].polyline(path || [], { color: positionData.color, opacity: 0.5 }));
                    }
                }
                var icon = void 0;
                var result = void 0;
                var inStep = void 0;
                var size = void 0;
                this.LOG.debug(['updatePositionArray'], positionData);
                switch (positionData.render) {
                    case 'marker':
                        icon = this.icon(positionData.color, positionData.marker);
                        size = (positionData.positions || []).length;
                        for (var i = 0; i < size; i++) {
                            var p = positionData.positions[i];
                            var marker = Leaflet__default['default'].marker({ lat: p[0], lng: p[1] }, { icon: icon, opacity: 1 });
                            this.addPopup(positionData, p[2], undefined, marker);
                            group.addLayer(marker);
                        }
                        this.LOG.debug(['updatePositionArray', 'build marker'], icon);
                        break;
                    case 'coloredWeightedDots':
                        this.LOG.debug(['updatePositionArray', 'coloredWeightedDots'], positionData);
                        result = [];
                        inStep = [];
                        for (var j = 0; j < positionData.numColorSteps; j++) {
                            result[j] = 0;
                            inStep[j] = 0;
                        }
                        size = (positionData.positions || []).length;
                        for (var i = 0; i < size; i++) {
                            var p = positionData.positions[i];
                            var radius = (parseInt(p[2], 10) - (positionData.minValue || 0)) * 50 / (positionData.maxValue || 50);
                            this.LOG.debug(['updatePositionArray', 'coloredWeightedDots', 'radius'], positionData.baseRadius * p[4]);
                            var marker = Leaflet__default['default'].circleMarker({ lat: p[0], lng: p[1] }, {
                                radius: radius,
                                color: positionData.borderColor || positionData.color,
                                fillColor: ColorLib.rgb2hex(positionData.colorGradient[p[5]].r, positionData.colorGradient[p[5]].g, positionData.colorGradient[p[5]].b),
                                fillOpacity: 0.3,
                            });
                            this.addPopup(positionData, p[2], undefined, marker);
                            group.addLayer(marker);
                        }
                        break;
                    case 'weightedDots':
                        size = (positionData.positions || []).length;
                        for (var i = 0; i < size; i++) {
                            var p = positionData.positions[i];
                            var radius = (parseInt(p[2], 10) - (positionData.minValue || 0)) * 50 / (positionData.maxValue || 50);
                            var marker = Leaflet__default['default'].circleMarker({ lat: p[0], lng: p[1] }, {
                                radius: radius,
                                color: positionData.borderColor || positionData.color,
                                fillColor: positionData.color,
                                weight: 2,
                                fillOpacity: 0.3,
                            });
                            this.addPopup(positionData, p[2], undefined, marker);
                            group.addLayer(marker);
                        }
                        break;
                    case 'dots':
                    default:
                        size = (positionData.positions || []).length;
                        for (var i = 0; i < size; i++) {
                            var p = positionData.positions[i];
                            var marker = Leaflet__default['default'].circleMarker({ lat: p[0], lng: p[1] }, {
                                radius: positionData.baseRadius || MapLib.BASE_RADIUS,
                                color: positionData.borderColor || positionData.color,
                                fillColor: positionData.color,
                                weight: 2,
                                fillOpacity: 0.7,
                            });
                            this.addPopup(positionData, p[2] || 'na', undefined, marker);
                            group.addLayer(marker);
                        }
                        break;
                }
            }
            this.positionDataLayer.addLayer(group);
        };
        WarpViewMapComponent.prototype.resize = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.resizeMe();
                resolve(true);
            });
        };
        WarpViewMapComponent.prototype.onRangeSliderChange = function (event) {
            this.LOG.debug(['onRangeSliderChange'], event);
            this.timeStart = event.value || moment__default['default']().valueOf();
            this.timeEnd = event.highValue || moment__default['default']().valueOf();
            this.drawMap(true);
        };
        WarpViewMapComponent.prototype.onRangeSliderWindowChange = function (event) {
            this.LOG.debug(['onRangeSliderWindowChange'], event);
            if (this.lowerTimeBound !== event.min || this.upperTimeBound !== event.max) {
                this.lowerTimeBound = event.min;
                this.upperTimeBound = event.max;
            }
        };
        WarpViewMapComponent.prototype.onSliderChange = function (event) {
            this.LOG.debug(['onSliderChange'], event, moment__default['default'](event.value).toISOString());
            this._firstDraw = false;
            if (this.timeEnd !== event.value) {
                this.timeSpan = this.timeSpan || this._options.map.timeSpan;
                this.timeEnd = event.value || moment__default['default']().valueOf();
                this.timeStart = (event.value || moment__default['default']().valueOf()) - this.timeSpan / this.divider;
                this.LOG.debug(['onSliderChange'], moment__default['default'](this.timeStart).toISOString(), moment__default['default'](this.timeEnd).toISOString());
                this.change.emit(this.timeStart);
                this.drawMap(true);
            }
        };
        WarpViewMapComponent.prototype.updateTimeSpan = function (event) {
            this.LOG.debug(['updateTimeSpan'], event.target.value);
            if (this.timeSpan !== event.target.value) {
                this.timeSpan = event.target.value;
                this.timeStart = (this.timeEnd || moment__default['default']().valueOf()) - this.timeSpan / this.divider;
                this.drawMap(true);
            }
        };
        return WarpViewMapComponent;
    }());
    WarpViewMapComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-map',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" #wrapper (resized)=\"resizeMe()\">\n  <div class=\"map-container\">\n    <div #mapDiv></div>\n    <div *ngIf=\"_options.map.showTimeSlider && !_options.map.showTimeRange\" #timeSlider>\n      <warpview-slider\n        [min]=\"_options.map.timeSliderMin / divider\" [max]=\"_options.map.timeSliderMax / divider\"\n        [value]=\"minTimeValue / divider\"\n        [step]=\"_options.map.timeSliderStep\" [mode]=\"_options.map.timeSliderMode\"\n        (change)=\"onSliderChange($event)\"\n        [debug]=\"debug\"\n      ></warpview-slider>\n    </div>\n    <div *ngIf=\"_options.map.showTimeSlider && _options.map.showTimeRange\" #timeRangeSlider>\n      <!--    <warpview-range-slider *ngIf=\"!_options.map.timeSpan && lowerTimeBound\"\n                                  [min]=\"lowerTimeBound\" [max]=\"upperTimeBound\"\n                                  [minValue]=\"minTimeValue / divider\"\n                                  [maxValue]=\"maxTimeValue / divider\"\n                                  [step]=\"_options.map.timeSliderStep\"\n                                  [mode]=\"_options.map.timeSliderMode\"\n                                  [debug]=\"_debug\"\n                                  (change)=\"onRangeSliderChange($event)\"\n           ></warpview-range-slider>-->\n\n      <warpview-range-slider\n        [min]=\"(_options.map.timeSliderMin / divider)\" [max]=\"(_options.map.timeSliderMax / divider)\"\n        [minValue]=\"minTimeValue / divider\"\n        [maxValue]=\"maxTimeValue / divider\"\n        [mode]=\"_options.map.timeSliderMode\"\n        [debug]=\"debug\"\n        (change)=\"onRangeSliderWindowChange($event)\"\n      ></warpview-range-slider>\n      <warpview-slider *ngIf=\"_options.map.timeSpan && lowerTimeBound\"\n                       [min]=\"lowerTimeBound\" [max]=\"upperTimeBound\"\n                       [step]=\"(this.timeSpan || this._options.map.timeSpan) / divider\"\n                       [mode]=\"_options.map.timeSliderMode\"\n                       [debug]=\"debug\"\n                       (change)=\"onSliderChange($event)\"\n      ></warpview-slider>\n      <div *ngIf=\"_options.map?.timeSpan\">\n        <label for=\"timeSpan\">Timespan: </label>\n        <select id=\"timeSpan\" (change)=\"updateTimeSpan($event)\">\n          <option *ngFor=\"let ts of _options.map.timeSpanList\" [value]=\"ts.value\">{{ts.label}}</option>\n        </select>\n      </div>\n    </div>\n    <warpview-heatmap-sliders\n      *ngIf=\"_options.map.heatControls\"\n      (heatRadiusDidChange)=\"heatRadiusDidChange($event)\"\n      (heatBlurDidChange)=\"heatBlurDidChange($event)\"\n      (heatOpacityDidChange)=\"heatOpacityDidChange($event)\"\n    ></warpview-heatmap-sliders>\n  </div>\n\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.None,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */@import url(/home/xavier/workspace/warp-view/node_modules/leaflet/dist/leaflet.css);@import url(/home/xavier/workspace/warp-view/node_modules/leaflet.markercluster/dist/MarkerCluster.css);@import url(/home/xavier/workspace/warp-view/node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css);:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host,warp-view-map,warpview-map{height:100%;min-height:100px;width:100%}:host .status,warp-view-map .status,warpview-map .status{bottom:0}:host div.wrapper,warp-view-map div.wrapper,warpview-map div.wrapper{height:100%;min-height:100px;overflow:hidden;padding:var(--warp-view-map-margin);width:100%}:host div.wrapper div.leaflet-container,:host div.wrapper div.map-container,warp-view-map div.wrapper div.leaflet-container,warp-view-map div.wrapper div.map-container,warpview-map div.wrapper div.leaflet-container,warpview-map div.wrapper div.map-container{height:100%;min-height:100px;min-width:100%;overflow:hidden;position:relative;width:100%}:host div.wrapper .leaflet-container,warp-view-map div.wrapper .leaflet-container,warpview-map div.wrapper .leaflet-container{height:100%;min-height:100%;min-width:100%;width:100%}"]
                },] }
    ];
    WarpViewMapComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: SizeService },
        { type: i0.Renderer2 }
    ]; };
    WarpViewMapComponent.propDecorators = {
        mapDiv: [{ type: i0.ViewChild, args: ['mapDiv', { static: true },] }],
        wrapper: [{ type: i0.ViewChild, args: ['wrapper', { static: true },] }],
        timeSlider: [{ type: i0.ViewChild, args: ['timeSlider',] }],
        timeRangeSlider: [{ type: i0.ViewChild, args: ['timeRangeSlider',] }],
        heatData: [{ type: i0.Input, args: ['heatData',] }],
        responsive: [{ type: i0.Input, args: ['responsive',] }],
        showLegend: [{ type: i0.Input, args: ['showLegend',] }],
        width: [{ type: i0.Input, args: ['width',] }],
        height: [{ type: i0.Input, args: ['height',] }],
        debug: [{ type: i0.Input, args: ['debug',] }],
        options: [{ type: i0.Input, args: ['options',] }],
        data: [{ type: i0.Input, args: ['data',] }],
        hiddenData: [{ type: i0.Input, args: ['hiddenData',] }],
        change: [{ type: i0.Output, args: ['change',] }],
        chartDraw: [{ type: i0.Output, args: ['chartDraw',] }]
    };

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
    var WarpViewHeatmapSlidersComponent = /** @class */ (function () {
        function WarpViewHeatmapSlidersComponent() {
            this.heatRadiusDidChange = new i0.EventEmitter();
            this.heatBlurDidChange = new i0.EventEmitter();
            this.heatOpacityDidChange = new i0.EventEmitter();
        }
        WarpViewHeatmapSlidersComponent.prototype.radiusChanged = function (value) {
            this.heatRadiusDidChange.emit(value);
        };
        WarpViewHeatmapSlidersComponent.prototype.blurChanged = function (value) {
            this.heatBlurDidChange.emit(value);
        };
        WarpViewHeatmapSlidersComponent.prototype.opacityChanged = function (value) {
            this.heatOpacityDidChange.emit(value);
        };
        return WarpViewHeatmapSlidersComponent;
    }());
    WarpViewHeatmapSlidersComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-heatmap-sliders',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n  <div class=\"container\">\n    <div class=\"options\">\n      <label for=\"radius\">Radius </label>\n      <input type=\"number\" id=\"radius\" value=\"25\" min=\"10\" max=\"50\" (click)=\"radiusChanged($event.target)\"/>\n      <br/>\n      <label for=\"blur\">Blur </label>\n      <input type=\"number\" id=\"blur\" value=\"15\" min=\"10\" max=\"50\" (click)=\"blurChanged($event.target)\"/>\n      <br/>\n      <label for=\"opacity\">Opacity </label>\n      <input type=\"number\" id=\"opacity\" value=\"50\" min=\"10\" max=\"100\" (click)=\"opacityChanged($event.target)\"/>\n    </div>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}"]
                },] }
    ];
    WarpViewHeatmapSlidersComponent.propDecorators = {
        radiusValue: [{ type: i0.Input, args: ['radiusValue',] }],
        minRadiusValue: [{ type: i0.Input, args: ['minRadiusValue',] }],
        maxRadiusValue: [{ type: i0.Input, args: ['maxRadiusValue',] }],
        blurValue: [{ type: i0.Input, args: ['blurValue',] }],
        minBlurValue: [{ type: i0.Input, args: ['minBlurValue',] }],
        maxBlurValue: [{ type: i0.Input, args: ['maxBlurValue',] }],
        heatRadiusDidChange: [{ type: i0.Output, args: ['heatRadiusDidChange',] }],
        heatBlurDidChange: [{ type: i0.Output, args: ['heatBlurDidChange',] }],
        heatOpacityDidChange: [{ type: i0.Output, args: ['heatOpacityDidChange',] }]
    };

    var WarpViewPieComponent = /** @class */ (function (_super) {
        __extends(WarpViewPieComponent, _super);
        function WarpViewPieComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.chartDraw = new i0.EventEmitter();
            _this._type = 'pie';
            _this.layout = {
                showlegend: true,
                legend: {
                    orientation: 'h',
                    bgcolor: 'transparent',
                },
                orientation: 270,
                margin: {
                    t: 10,
                    b: 25,
                    r: 10,
                    l: 10
                }
            };
            _this.LOG = new Logger(WarpViewPieComponent, _this._debug);
            return _this;
        }
        Object.defineProperty(WarpViewPieComponent.prototype, "type", {
            set: function (type) {
                this._type = type;
                this.drawChart();
            },
            enumerable: false,
            configurable: true
        });
        WarpViewPieComponent.prototype.update = function (options, refresh) {
            this.LOG.debug(['onOptions', 'before'], this._options, options);
            if (!deepEqual__default['default'](options, this._options)) {
                this.LOG.debug(['options', 'changed'], options);
                this._options = ChartLib.mergeDeep(this._options, options);
            }
            this.drawChart();
        };
        WarpViewPieComponent.prototype.ngOnInit = function () {
            this._options = this._options || this.defOptions;
        };
        WarpViewPieComponent.prototype.drawChart = function () {
            if (!this.initChart(this.el)) {
                return;
            }
            this.LOG.debug(['drawChart', 'this.layout'], this.layout);
            this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
            this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
            this.layout.legend.font = {
                color: this.getCSSColor(this.el.nativeElement, '--warp-view-font-color', '#000')
            };
            this.layout.textfont = {
                color: this.getCSSColor(this.el.nativeElement, '--warp-view-font-color', '#000')
            };
            this.loading = false;
        };
        WarpViewPieComponent.prototype.convert = function (data) {
            var _this = this;
            var gtsList = GTSLib.flatDeep(data.data);
            var plotData = [];
            this.LOG.debug(['convert', 'gtsList'], gtsList);
            var pieData = {
                values: [],
                labels: [],
                marker: {
                    colors: [],
                    line: {
                        width: 3,
                        color: [],
                    }
                },
                textfont: {
                    color: this.getLabelColor(this.el.nativeElement)
                },
                hoverlabel: {
                    bgcolor: this.getCSSColor(this.el.nativeElement, '--warp-view-chart-legend-bg', '#000000'),
                    bordercolor: 'grey',
                    font: {
                        color: this.getCSSColor(this.el.nativeElement, '--warp-view-chart-legend-color', '#ffffff')
                    }
                },
                type: 'pie'
            };
            var dataList = [];
            this.LOG.debug(['convert', 'gtsList'], gtsList);
            if (!gtsList || gtsList.length === 0) {
                return;
            }
            var dataStruct = [];
            if (GTSLib.isGts(gtsList[0])) {
                gtsList.forEach(function (gts, i) {
                    var values = (gts.v || []);
                    var val = values[values.length - 1] || [];
                    var value = 0;
                    if (val.length > 0) {
                        value = val[val.length - 1];
                    }
                    dataStruct.push({
                        key: GTSLib.serializeGtsMetadata(gts),
                        value: value
                    });
                });
            }
            else {
                // custom data format
                gtsList.forEach(function (gts, i) {
                    dataStruct.push({
                        key: gts.key || '',
                        value: gts.value || Number.MIN_VALUE
                    });
                });
            }
            this.LOG.debug(['convert', 'dataStruct'], dataStruct);
            dataStruct.forEach(function (d, i) {
                var c = ColorLib.getColor(i, _this._options.scheme);
                var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                pieData.values.push(d.value);
                pieData.labels.push(d.key);
                pieData.marker.colors.push(ColorLib.transparentize(color));
                pieData.marker.line.color.push(color);
                if (_this._type === 'donut') {
                    pieData.hole = 0.5;
                }
                if (_this.unit) {
                    pieData.title = {
                        text: _this.unit
                    };
                }
            });
            if (pieData.values.length > 0) {
                plotData.push(pieData);
            }
            this.noData = plotData.length === 0;
            return plotData;
        };
        return WarpViewPieComponent;
    }(WarpViewComponent));
    WarpViewPieComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-pie',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display or wrong data format.</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host{display:block}:host,:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}"]
                },] }
    ];
    WarpViewPieComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewPieComponent.propDecorators = {
        type: [{ type: i0.Input, args: ['type',] }],
        chartDraw: [{ type: i0.Output, args: ['chartDraw',] }]
    };

    var WarpViewGaugeComponent = /** @class */ (function (_super) {
        __extends(WarpViewGaugeComponent, _super);
        function WarpViewGaugeComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.CHART_MARGIN = 0.05;
            _this.lineHeight = 50;
            // tslint:disable-next-line:variable-name
            _this._type = 'gauge'; // gauge or bullet
            _this.layout = {
                showlegend: false,
                autosize: false,
                autoexpand: false,
                margin: {
                    t: 10,
                    b: 2,
                    r: 10,
                    l: 10
                },
            };
            _this.LOG = new Logger(WarpViewGaugeComponent, _this._debug);
            return _this;
        }
        Object.defineProperty(WarpViewGaugeComponent.prototype, "type", {
            set: function (type) {
                this._type = type;
                this.drawChart();
            },
            enumerable: false,
            configurable: true
        });
        WarpViewGaugeComponent.prototype.ngOnInit = function () {
            this._options = this._options || this.defOptions;
        };
        WarpViewGaugeComponent.prototype.update = function (options, refresh) {
            this.LOG.debug(['onOptions', 'before'], this._options, options);
            if (!deepEqual__default['default'](options, this._options)) {
                this.LOG.debug(['options', 'changed'], options);
                this._options = ChartLib.mergeDeep(this._options, options);
            }
            this.drawChart();
        };
        WarpViewGaugeComponent.prototype.drawChart = function () {
            if (!this.initChart(this.el)) {
                return;
            }
            this._autoResize = this._type !== 'bullet';
            this.LOG.debug(['drawChart', 'plotlyData'], this.plotlyData, this._type);
            // this.layout.autosize = true;
            this.layout.grid = {
                rows: Math.ceil(this.plotlyData.length / 2),
                columns: 2,
                pattern: 'independent',
                xgap: 0.2,
                ygap: 0.2
            };
            this.layout.margin = { t: 25, r: 25, l: 25, b: 25 };
            if (this._type === 'bullet') {
                this.layout.height = 100;
                this.layout.yaxis = {
                    automargin: true
                };
                this.layout.grid = { rows: this.plotlyData.length, columns: 1, pattern: 'independent', ygap: 0.5 };
                var count = this.plotlyData.length;
                var calculatedHeight = this.lineHeight * count + this.layout.margin.t + this.layout.margin.b;
                calculatedHeight += this.layout.grid.ygap * calculatedHeight;
                this.el.nativeElement.style.height = calculatedHeight + 'px';
                this.el.nativeElement.style.height = calculatedHeight + 'px';
                this.height = calculatedHeight;
                this.layout.height = this.height;
                this.layout.autosize = false;
            }
            this.loading = false;
        };
        WarpViewGaugeComponent.prototype.convert = function (data) {
            var _this = this;
            this.LOG.debug(['convert'], data);
            var gtsList = data.data;
            var dataList = [];
            var overallMax = this._options.maxValue || Number.MIN_VALUE;
            this.LOG.debug(['convert', 'gtsList'], gtsList);
            if (!gtsList || gtsList.length === 0) {
                return;
            }
            gtsList = GTSLib.flatDeep(gtsList);
            var dataStruct = [];
            if (GTSLib.isGts(gtsList[0])) {
                gtsList.forEach(function (gts, i) {
                    var max = Number.MIN_VALUE;
                    var values = (gts.v || []);
                    var val = values[values.length - 1] || [];
                    var value = 0;
                    if (val.length > 0) {
                        value = val[val.length - 1];
                    }
                    if (!!data.params && !!data.params[i] && !!data.params[i].maxValue) {
                        max = data.params[i].maxValue;
                    }
                    else {
                        if (overallMax < value) {
                            overallMax = value;
                        }
                    }
                    dataStruct.push({
                        key: GTSLib.serializeGtsMetadata(gts),
                        value: value,
                        max: max
                    });
                });
            }
            else {
                // custom data format
                gtsList.forEach(function (gts, i) {
                    var max = Number.MIN_VALUE;
                    if (!!data.params && !!data.params[i] && !!data.params[i].maxValue) {
                        max = data.params[i].maxValue;
                    }
                    else {
                        if (overallMax < gts.value || Number.MIN_VALUE) {
                            overallMax = gts.value || Number.MIN_VALUE;
                        }
                    }
                    dataStruct.push({
                        key: gts.key || '',
                        value: gts.value || Number.MIN_VALUE,
                        max: max
                    });
                });
            }
            //  dataStruct.reverse();
            this.LOG.debug(['convert', 'dataStruct'], dataStruct);
            this.layout.annotations = [];
            var count = Math.ceil(dataStruct.length / 2);
            if (this._type === 'bullet') {
                count = dataStruct.length;
            }
            var itemHeight = 1 / count;
            var x = 0;
            var y = -1 * itemHeight;
            if (this._type === 'bullet') {
                y = this.CHART_MARGIN;
            }
            dataStruct.forEach(function (gts, i) {
                if (_this._type === 'bullet') {
                    y += itemHeight;
                }
                else {
                    if (i % 2 === 0) {
                        y += itemHeight;
                        x = 0;
                    }
                    else {
                        x = 0.5;
                    }
                }
                var c = ColorLib.getColor(i, _this._options.scheme);
                var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                var domain = dataStruct.length > 1 ? {
                    x: [x + _this.CHART_MARGIN, x + 0.5 - _this.CHART_MARGIN],
                    y: [y - itemHeight + _this.CHART_MARGIN, y - _this.CHART_MARGIN]
                } : {
                    x: [0, 1],
                    y: [0, 1]
                };
                if (_this._type === 'bullet') {
                    domain.x = [0, 1];
                    domain.y = [y - itemHeight + _this.CHART_MARGIN * 2, y - _this.CHART_MARGIN * 2];
                    // domain.y = [(i > 0 ? i / dataStruct.length : 0) + this.CHART_MARGIN * 2, (i + 1) / dataStruct.length - this.CHART_MARGIN * 2];
                    _this.layout.annotations.push({
                        xref: 'x domain',
                        yref: 'y domain',
                        x: 0,
                        xanchor: 'left',
                        y: (i + 1) / count + _this.CHART_MARGIN,
                        yanchor: 'top',
                        text: gts.key,
                        showarrow: false,
                        align: 'left',
                        font: {
                            size: 14,
                            color: _this.getLabelColor(_this.el.nativeElement)
                        }
                    });
                }
                dataList.push({
                    domain: domain,
                    align: 'left',
                    value: gts.value,
                    delta: {
                        reference: !!data.params && !!data.params[i] && !!data.params[i].delta ? data.params[i].delta + gts.value : 0,
                        font: { color: _this.getLabelColor(_this.el.nativeElement) }
                    },
                    title: {
                        text: _this._type === 'bullet'
                            || (!!data.params && !!data.params[i] && !!data.params[i].type && data.params[i].type === 'bullet') ? '' : gts.key,
                        align: 'center',
                        font: { color: _this.getLabelColor(_this.el.nativeElement) }
                    },
                    number: {
                        font: { color: _this.getLabelColor(_this.el.nativeElement) }
                    },
                    type: 'indicator',
                    mode: !!data.params && !!data.params[i] && !!data.params[i].delta ? 'number+delta+gauge' : 'gauge+number',
                    gauge: {
                        bgcolor: 'transparent',
                        shape: !!data.params && !!data.params[i] && !!data.params[i].type ? data.params[i].type : _this._type || 'gauge',
                        bordercolor: _this.getGridColor(_this.el.nativeElement),
                        axis: {
                            range: [null, overallMax === Number.MIN_VALUE ? gts.max : overallMax],
                            tickcolor: _this.getGridColor(_this.el.nativeElement),
                            tickfont: { color: _this.getGridColor(_this.el.nativeElement) }
                        },
                        bar: {
                            color: ColorLib.transparentize(color),
                            thickness: 1,
                            line: {
                                width: 1,
                                color: color
                            }
                        }
                    }
                });
                _this.LOG.debug(['convert', 'dataList'], i);
            });
            this.LOG.debug(['convert', 'dataList'], dataList);
            return dataList;
        };
        return WarpViewGaugeComponent;
    }(WarpViewComponent));
    WarpViewGaugeComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-gauge',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host{display:block}:host,:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height,100%);width:var(--warp-view-chart-width,100%)}"]
                },] }
    ];
    WarpViewGaugeComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewGaugeComponent.propDecorators = {
        type: [{ type: i0.Input, args: ['type',] }]
    };

    var WarpViewAnnotationComponent = /** @class */ (function (_super) {
        __extends(WarpViewAnnotationComponent, _super);
        function WarpViewAnnotationComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.pointHover = new i0.EventEmitter();
            _this.chartDraw = new i0.EventEmitter();
            _this.boundsDidChange = new i0.EventEmitter();
            _this.displayExpander = true;
            _this.layout = {
                showlegend: false,
                hovermode: 'closest',
                xaxis: {
                    gridwidth: 1,
                    fixedrange: false,
                    autorange: false,
                    automargin: false,
                    showticklabels: true,
                    showgrid: false
                },
                autosize: false,
                autoexpand: false,
                yaxis: {
                    showticklabels: false,
                    fixedrange: true,
                    dtick: 1,
                    gridwidth: 1,
                    tick0: 0,
                    nticks: 2,
                    rangemode: 'tozero',
                    tickson: 'boundaries',
                    automargin: true,
                    showline: false,
                    zeroline: true
                },
                margin: {
                    t: 30,
                    b: 2,
                    r: 10,
                    l: 10
                },
            };
            _this.marginLeft = 50;
            _this.expanded = false;
            // tslint:disable-next-line:variable-name
            _this._type = 'line';
            _this.visibility = [];
            _this._standalone = true;
            _this.maxTick = Number.MIN_VALUE;
            _this.minTick = Number.MAX_VALUE;
            _this.visibleGtsId = [];
            _this.gtsId = [];
            _this.dataHashset = {};
            _this.lineHeight = 30;
            _this.chartBounds = new ChartBounds();
            _this._autoResize = false;
            _this.LOG = new Logger(WarpViewAnnotationComponent, _this._debug);
            return _this;
        }
        Object.defineProperty(WarpViewAnnotationComponent.prototype, "hiddenData", {
            set: function (hiddenData) {
                var _this = this;
                var previousVisibility = JSON.stringify(this.visibility);
                this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
                this._hiddenData = hiddenData;
                this.visibility = [];
                this.visibleGtsId.forEach(function (id) { return _this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1)); });
                this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
                var newVisibility = JSON.stringify(this.visibility);
                this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility);
                if (previousVisibility !== newVisibility) {
                    var visible_1 = [];
                    var hidden_1 = [];
                    this.gtsId.forEach(function (id, i) {
                        if (_this._hiddenData.indexOf(id) > -1) {
                            hidden_1.push(i);
                        }
                        else {
                            visible_1.push(i);
                        }
                    });
                    if (visible_1.length > 0) {
                        this.graph.restyleChart({ visible: true }, visible_1);
                    }
                    if (hidden_1.length > 0) {
                        this.graph.restyleChart({ visible: false }, hidden_1);
                    }
                    this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewAnnotationComponent.prototype, "type", {
            set: function (type) {
                this._type = type;
                this.drawChart();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewAnnotationComponent.prototype, "standalone", {
            get: function () {
                return this._standalone;
            },
            set: function (isStandalone) {
                if (this._standalone !== isStandalone) {
                    this._standalone = isStandalone;
                    this.drawChart();
                }
            },
            enumerable: false,
            configurable: true
        });
        WarpViewAnnotationComponent.prototype.handleKeyDown = function ($event) {
            var _this = this;
            if ($event.key === 'Control') {
                this.trimmed = setInterval(function () {
                    if (!!_this.toolTip.nativeElement.querySelector('#tooltip-body')) {
                        _this.toolTip.nativeElement.querySelector('#tooltip-body').classList.add('full');
                    }
                }, 100);
            }
        };
        WarpViewAnnotationComponent.prototype.handleKeyup = function ($event) {
            this.LOG.debug(['document:keyup'], $event);
            if ($event.key === 'Control') {
                if (!!this.toolTip.nativeElement.querySelector('#tooltip-body')) {
                    if (this.trimmed) {
                        clearInterval(this.trimmed);
                    }
                    this.toolTip.nativeElement.querySelector('#tooltip-body').classList.remove('full');
                }
            }
        };
        WarpViewAnnotationComponent.prototype.update = function (options, refresh) {
            if (!!options) {
                this._options = ChartLib.mergeDeep(this._options, options);
            }
            this.drawChart(refresh);
        };
        WarpViewAnnotationComponent.prototype.updateBounds = function (min, max, marginLeft) {
            this.LOG.debug(['updateBounds'], min, max, this._options);
            this._options.bounds.minDate = min;
            this._options.bounds.maxDate = max;
            this.layout.xaxis.autorange = false;
            this.LOG.debug(['updateBounds'], GTSLib.toISOString(min, this.divider, this._options.timeZone), GTSLib.toISOString(max, this.divider, this._options.timeZone));
            this.minTick = min;
            this.maxTick = max;
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                this.layout.xaxis.tick0 = min / this.divider;
                this.layout.xaxis.range = [min / this.divider, max / this.divider];
            }
            else {
                this.layout.xaxis.tick0 = GTSLib.toISOString(min, this.divider, this._options.timeZone);
                this.layout.xaxis.range = [
                    GTSLib.toISOString(min, this.divider, this._options.timeZone),
                    GTSLib.toISOString(max, this.divider, this._options.timeZone)
                ];
            }
            this.layout.margin.l = marginLeft;
            this.marginLeft = marginLeft;
            this.layout = Object.assign({}, this.layout);
            this.LOG.debug(['updateBounds'], Object.assign({}, this.layout.xaxis.range));
        };
        WarpViewAnnotationComponent.prototype.drawChart = function (reparseNewData) {
            var _this = this;
            if (reparseNewData === void 0) { reparseNewData = false; }
            this.layout.margin.l = !!this._standalone ? 10 : 50;
            this.layout.margin.b = !!this._standalone ? 50 : 1;
            this.height = this.lineHeight + this.layout.margin.t + this.layout.margin.b;
            if (!this.initChart(this.el)) {
                return;
            }
            this.el.nativeElement.style.display = 'block';
            this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
            this.LOG.debug(['drawChart', 'hiddenData'], this._hiddenData);
            this.LOG.debug(['drawChart', 'this._options.bounds'], this._options.bounds);
            this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
            this.layout.yaxis.gridcolor = this.getGridColor(this.el.nativeElement);
            this.layout.yaxis.showline = !!this._standalone;
            this.layout.yaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
            this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
            this.layout.xaxis.gridcolor = this.getGridColor(this.el.nativeElement);
            this.layout.xaxis.autorange = !!this._standalone;
            this.layout.xaxis.showticklabels = !!this._standalone;
            this.displayExpander = (this.plotlyData.length > 1);
            var count = this.plotlyData.filter(function (d) { return d.y.length > 0; }).length;
            var calculatedHeight = (this.expanded ? this.lineHeight * count : this.lineHeight) + this.layout.margin.t + this.layout.margin.b;
            this.el.nativeElement.style.height = calculatedHeight + 'px';
            this.height = calculatedHeight;
            this.layout.height = this.height;
            this.LOG.debug(['drawChart', 'height'], this.height, count, calculatedHeight, this.expanded);
            this.layout.yaxis.range = [0, this.expanded ? count : 1];
            this.LOG.debug(['drawChart', 'this.layout'], this.layout);
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                this.layout.xaxis.tick0 = this.minTick;
                this.layout.xaxis.range = [this.minTick, this.maxTick];
                this.layout.xaxis.type = 'linear';
            }
            else {
                this.layout.xaxis.tick0 =
                    GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone);
                this.layout.xaxis.range = [
                    GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone),
                    GTSLib.toISOString(this.maxTick, this.divider, this._options.timeZone)
                ];
                this.layout.xaxis.type = 'date';
            }
            this.plotlyConfig.scrollZoom = true;
            this.layout.xaxis.showgrid = false;
            setTimeout(function () {
                _this.plotlyConfig = Object.assign({}, _this.plotlyConfig);
                _this.layout = Object.assign({}, _this.layout);
                _this.loading = false;
            });
            this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig, this.plotlyData);
        };
        WarpViewAnnotationComponent.prototype.relayout = function (data) {
            if (data['xaxis.range'] && data['xaxis.range'].length === 2) {
                this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range'], data['xaxis.range']);
                this.chartBounds.msmin = data['xaxis.range'][0];
                this.chartBounds.msmax = data['xaxis.range'][1];
                this.chartBounds.tsmin = moment__default['default'].tz(moment__default['default'](this.chartBounds.msmin), this._options.timeZone).valueOf();
                this.chartBounds.tsmax = moment__default['default'].tz(moment__default['default'](this.chartBounds.msmax), this._options.timeZone).valueOf();
            }
            else if (data['xaxis.range[0]'] && data['xaxis.range[1]']) {
                this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range[x]'], data['xaxis.range[0]']);
                this.chartBounds.msmin = data['xaxis.range[0]'];
                this.chartBounds.msmax = data['xaxis.range[1]'];
                this.chartBounds.tsmin = moment__default['default'].tz(moment__default['default'](this.chartBounds.msmin), this._options.timeZone).valueOf();
                this.chartBounds.tsmax = moment__default['default'].tz(moment__default['default'](this.chartBounds.msmax), this._options.timeZone).valueOf();
            }
            else if (data['xaxis.autorange']) {
                this.LOG.debug(['relayout', 'updateBounds', 'autorange'], data);
                this.chartBounds.tsmin = this.minTick / this.divider;
                this.chartBounds.tsmax = this.maxTick / this.divider;
            }
            this.emitNewBounds(moment__default['default'].utc(this.chartBounds.tsmin).valueOf(), moment__default['default'].utc(this.chartBounds.msmax).valueOf());
        };
        WarpViewAnnotationComponent.prototype.hover = function (data) {
            this.LOG.debug(['hover'], data);
            var tooltip = this.toolTip.nativeElement;
            this.pointHover.emit({
                x: data.event.offsetX,
                y: data.event.offsetY
            });
            var x = data.xvals[0];
            if (!!data.points[0]) {
                x = data.points[0].x;
            }
            var layout = this.el.nativeElement.getBoundingClientRect();
            var count = this.plotlyData.filter(function (d) { return d.y.length > 0; }).length;
            tooltip.style.opacity = '1';
            tooltip.style.display = 'block';
            tooltip.style.paddingLeft = (this._standalone ? 0 : 40) + 'px';
            tooltip.style.top = ((this.expanded ? count - 1 - (data.points[0].y + 0.5) : -1) * (this.lineHeight) + this.layout.margin.t) + 6 + 'px';
            tooltip.classList.remove('right', 'left');
            tooltip.innerHTML = "<div class=\"tooltip-body trimmed\" id=\"tooltip-body\">\n<span class=\"tooltip-date\">" + (this._options.timeMode === 'timestamp'
                ? x
                : (moment__default['default'].utc(x).toISOString().replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '') || '')) + "</span>\n<ul>\n<li>" + GTSLib.formatLabel(data.points[0].data.name) + ": <span class=\"value\">" + data.points[0].text + "</span></li>\n</ul>\n      </div>";
            if (data.event.offsetX > layout.width / 2) {
                tooltip.classList.add('left');
            }
            else {
                tooltip.classList.add('right');
            }
            tooltip.style.pointerEvents = 'none';
        };
        WarpViewAnnotationComponent.prototype.unhover = function () {
            this.toolTip.nativeElement.style.display = 'none';
        };
        WarpViewAnnotationComponent.prototype.afterPlot = function (div) {
            this.loading = false;
            this.chartBounds.tsmin = this.minTick;
            this.chartBounds.tsmax = this.maxTick;
            this.chartDraw.emit(this.chartBounds);
            this.LOG.debug(['afterPlot'], this.chartBounds, div);
        };
        WarpViewAnnotationComponent.prototype.emitNewBounds = function (min, max) {
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                this.boundsDidChange.emit({ bounds: { min: min, max: max }, source: 'annotation' });
            }
            else {
                this.boundsDidChange.emit({
                    bounds: {
                        min: moment__default['default'].tz(min, this._options.timeZone).valueOf(),
                        max: moment__default['default'].tz(max, this._options.timeZone).valueOf()
                    },
                    source: 'annotation'
                });
            }
        };
        WarpViewAnnotationComponent.prototype.convert = function (data) {
            var _this = this;
            var dataset = [];
            var gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data, 0).res);
            this.maxTick = Number.NEGATIVE_INFINITY;
            this.minTick = Number.POSITIVE_INFINITY;
            this.visibleGtsId = [];
            this.gtsId = [];
            var nonPlottable = gtsList.filter(function (g) { return g.v && GTSLib.isGtsToPlot(g); });
            gtsList = gtsList.filter(function (g) { return g.v && !GTSLib.isGtsToPlot(g); });
            var timestampMode = true;
            var tsLimit = 100 * GTSLib.getDivider(this._options.timeUnit);
            gtsList.forEach(function (gts) {
                var ticks = gts.v.map(function (t) { return t[0]; });
                var size = gts.v.length;
                timestampMode = timestampMode && (ticks[0] > -tsLimit && ticks[0] < tsLimit);
                timestampMode = timestampMode && (ticks[size - 1] > -tsLimit && ticks[size - 1] < tsLimit);
            });
            if (timestampMode || this._options.timeMode === 'timestamp') {
                this.layout.xaxis.type = 'linear';
            }
            else {
                this.layout.xaxis.type = 'date';
            }
            gtsList.forEach(function (gts, i) {
                if (gts.v) {
                    var size = gts.v.length;
                    var label = GTSLib.serializeGtsMetadata(gts);
                    var c = ColorLib.getColor(gts.id, _this._options.scheme);
                    var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                    var series = {
                        type: 'scattergl',
                        mode: 'markers',
                        name: label,
                        x: [],
                        y: [],
                        text: [],
                        hoverinfo: 'none',
                        connectgaps: false,
                        visible: !(_this._hiddenData.filter(function (h) { return h === gts.id; }).length > 0),
                        line: { color: color },
                        marker: {
                            symbol: 'line-ns-open',
                            color: color,
                            size: 20,
                            width: 5,
                        }
                    };
                    _this.visibleGtsId.push(gts.id);
                    _this.gtsId.push(gts.id);
                    if (timestampMode || _this._options.timeMode && _this._options.timeMode === 'timestamp') {
                        _this.layout.xaxis.type = 'linear';
                    }
                    else {
                        _this.layout.xaxis.type = 'date';
                    }
                    var ticks = [];
                    series.text = [];
                    series.y = [];
                    if (size > 0) {
                        _this.minTick = gts.v[0][0];
                        _this.maxTick = gts.v[0][0];
                        for (var v = 0; v < size; v++) {
                            var val = gts.v[v];
                            var t = val[0];
                            ticks.push(t);
                            series.text.push(val[val.length - 1]);
                            series.y.push((_this.expanded ? i : 0) + 0.5);
                            _this.minTick = (t < _this.minTick) ? t : _this.minTick;
                            _this.maxTick = (t > _this.maxTick) ? t : _this.maxTick;
                        }
                    }
                    if (timestampMode || _this._options.timeMode === 'timestamp') {
                        series.x = ticks;
                    }
                    else {
                        series.x = ticks.map(function (t) { return GTSLib.toISOString(t, _this.divider, _this._options.timeZone); });
                    }
                    if (series.x.length > 0) {
                        dataset.push(series);
                    }
                }
            });
            this.LOG.debug(['convert'], 'forEach value end', this.minTick, this.maxTick);
            if (nonPlottable.length > 0) {
                nonPlottable.forEach(function (g) {
                    g.v.forEach(function (value) {
                        var ts = value[0];
                        if (ts < _this.minTick) {
                            _this.minTick = ts;
                        }
                        if (ts > _this.maxTick) {
                            _this.maxTick = ts;
                        }
                    });
                });
                // if there is not any plottable data, we must add a fake one with id -1. This one will always be hidden.
                if (0 === gtsList.length) {
                    if (!this.dataHashset[this.minTick]) {
                        this.dataHashset[this.minTick] = [0];
                    }
                    if (!this.dataHashset[this.maxTick]) {
                        this.dataHashset[this.maxTick] = [0];
                    }
                    this.visibility.push(false);
                    this.visibleGtsId.push(-1);
                }
            }
            var x = { tick0: undefined, range: [] };
            if (timestampMode || this._options.timeMode && this._options.timeMode === 'timestamp') {
                x.tick0 = this.minTick;
                x.range = [this.minTick, this.maxTick];
            }
            else {
                x.tick0 = GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone);
                x.range = [
                    GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone),
                    GTSLib.toISOString(this.maxTick, this.divider, this._options.timeZone)
                ];
            }
            this.layout.xaxis = x;
            this.noData = dataset.length === 0;
            return dataset;
        };
        WarpViewAnnotationComponent.prototype.toggle = function () {
            this.expanded = !this.expanded;
            this.drawChart();
        };
        WarpViewAnnotationComponent.prototype.setRealBounds = function (chartBounds) {
            this.minTick = chartBounds.tsmin;
            this.maxTick = chartBounds.tsmax;
            this._options.bounds = this._options.bounds || {};
            this._options.bounds.minDate = this.minTick;
            this._options.bounds.maxDate = this.maxTick;
            var x = {
                tick0: undefined,
                range: [],
            };
            if (this._options.showRangeSelector) {
                x.rangeslider = {
                    bgcolor: 'transparent',
                    thickness: 40 / this.height
                };
            }
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                x.tick0 = this.minTick / this.divider;
                x.range = [this.minTick, this.maxTick];
            }
            else {
                x.tick0 = GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone);
                x.range = [
                    GTSLib.toISOString(this.minTick, this.divider, this._options.timeZone),
                    GTSLib.toISOString(this.maxTick, this.divider, this._options.timeZone)
                ];
            }
            this.layout.xaxis = x;
            this.layout = Object.assign({}, this.layout);
        };
        return WarpViewAnnotationComponent;
    }(WarpViewComponent));
    WarpViewAnnotationComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-annotation',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <button *ngIf=\"displayExpander && plotlyData && plotlyData.length > 1\" class=\"expander\" (click)=\"toggle()\"\n          title=\"collapse/expand\">+/-\n  </button>\n  <div #toolTip class=\"wv-tooltip\"></div>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <div *ngIf=\"!loading && !noData\">\n    <div class=\"upperLine\" [ngStyle]=\"{left: standalone? '10px': marginLeft + 'px'}\" *ngIf=\"standalone || !expanded\"></div>\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot($event)\"\n                     (relayout)=\"relayout($event)\" className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover()\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host{display:block}:host .expander{left:0;position:absolute;top:0;width:35px;z-index:9}:host #chartContainer{height:auto;position:relative}:host #chartContainer div.upperLine{border-bottom:1px solid var(--warp-view-chart-grid-color,#8e8e8e);height:0;left:0;position:absolute;right:10px;top:30px}:host .date{display:block;height:20px;left:40px;line-height:20px;position:absolute;text-align:right;top:0;vertical-align:middle}:host .chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}:host .wv-tooltip{margin-left:10px;position:absolute;top:-1000px;width:calc(100% - 50px);z-index:999}:host .wv-tooltip .tooltip-body{background-color:hsla(0,0%,100%,.8);color:var(--warp-view-annotationtooltip-font-color);height:50px;line-height:20px;margin:1px;max-width:100%;overflow:visible;padding-left:10px;padding-right:10px;vertical-align:middle;width:auto}:host .wv-tooltip .tooltip-body ul{list-style:none;margin-top:10px;padding-top:0}:host .wv-tooltip .tooltip-body.trimmed{max-width:49%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host .wv-tooltip .tooltip-body.full{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host .wv-tooltip .tooltip-body .timestamp{font-size:1rem}:host .wv-tooltip .tooltip-body .value{color:var(--warp-view-annotationtooltip-value-font-color)}:host .wv-tooltip .tooltip-body .tooltip-date{display:block;font-size:.8rem;font-weight:700;height:.8rem;line-height:.8rem;padding-top:5px;text-align:left;vertical-align:middle;width:100%}:host .wv-tooltip .tooltip-body .round{background-color:#bbb;border:2px solid #454545;border-radius:50%;display:inline-block;height:5px;margin-bottom:auto;margin-right:5px;margin-top:auto;vertical-align:middle;width:5px}:host .wv-tooltip.left .tooltip-body{float:left;text-align:left}:host .wv-tooltip.left .tooltip-body .tooltip-date{text-align:left}:host .wv-tooltip.right .tooltip-body{float:right;text-align:right}:host .wv-tooltip.right .tooltip-body .tooltip-date{text-align:right}"]
                },] }
    ];
    WarpViewAnnotationComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewAnnotationComponent.propDecorators = {
        hiddenData: [{ type: i0.Input, args: ['hiddenData',] }],
        type: [{ type: i0.Input, args: ['type',] }],
        standalone: [{ type: i0.Input, args: ['standalone',] }],
        pointHover: [{ type: i0.Output, args: ['pointHover',] }],
        chartDraw: [{ type: i0.Output, args: ['chartDraw',] }],
        boundsDidChange: [{ type: i0.Output, args: ['boundsDidChange',] }],
        handleKeyDown: [{ type: i0.HostListener, args: ['keydown', ['$event'],] }, { type: i0.HostListener, args: ['document:keydown', ['$event'],] }],
        handleKeyup: [{ type: i0.HostListener, args: ['keyup', ['$event'],] }, { type: i0.HostListener, args: ['document:keyup', ['$event'],] }]
    };

    /**
     *
     */
    var WarpViewPolarComponent = /** @class */ (function (_super) {
        __extends(WarpViewPolarComponent, _super);
        function WarpViewPolarComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.layout = {
                paper_bgcolor: 'rgba(0,0,0,0)',
                showlegend: true,
                legend: { orientation: 'h' },
                font: { size: 12, familly: '\'Quicksand\', sans-serif' },
                polar: {
                    bgcolor: 'rgba(0,0,0,0)',
                    angularaxis: {
                        type: 'category'
                    },
                    radialaxis: {
                        visible: true,
                    }
                },
                orientation: 270,
                margin: {
                    t: 10,
                    b: 25,
                    r: 10,
                    l: 10
                }
            };
            _this.LOG = new Logger(WarpViewPolarComponent, _this._debug);
            return _this;
        }
        WarpViewPolarComponent.prototype.update = function (options, refresh) {
            this.LOG.debug(['onOptions', 'before'], this._options, options);
            if (!deepEqual__default['default'](options, this._options)) {
                this.LOG.debug(['options', 'changed'], options);
                this._options = ChartLib.mergeDeep(this._options, options);
            }
            this.drawChart();
        };
        WarpViewPolarComponent.prototype.ngOnInit = function () {
            this._options = this._options || this.defOptions;
        };
        WarpViewPolarComponent.prototype.drawChart = function () {
            if (!this.initChart(this.el)) {
                return;
            }
            this.layout.polar.radialaxis.color = this.getGridColor(this.el.nativeElement);
            this.layout.polar.angularaxis.color = this.getGridColor(this.el.nativeElement);
            this.layout.showlegend = !!this.showLegend;
            this.LOG.debug(['drawChart', 'this.layout'], this.layout);
            this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
            this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
            this.loading = false;
        };
        WarpViewPolarComponent.prototype.convert = function (data) {
            var _this = this;
            var dataset = [];
            var divider = GTSLib.getDivider(this._options.timeUnit);
            var gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data, 0).res);
            this.LOG.debug(['convert', 'gtsList'], gtsList);
            var minVal = Number.MAX_VALUE;
            var maxVal = Number.MIN_VALUE;
            gtsList.forEach(function (gts, i) {
                var c = ColorLib.getColor(i, _this._options.scheme);
                var color = ((data.params || [])[gts.id] || { datasetColor: c }).datasetColor || c;
                var series = {
                    r: [],
                    theta: [],
                    marker: {
                        line: { color: color, width: 1 },
                        color: ColorLib.transparentize(color),
                    },
                    fillcolor: ColorLib.transparentize(color),
                    hoverinfo: 'none',
                    name: GTSLib.serializeGtsMetadata(gts),
                    text: GTSLib.serializeGtsMetadata(gts),
                    fill: 'toself',
                    type: 'barpolar',
                };
                gts.v.forEach(function (value) {
                    var ts = value[0];
                    minVal = Math.min(minVal, value[value.length - 1]);
                    maxVal = Math.max(maxVal, value[value.length - 1]);
                    series.r.push(value[value.length - 1]);
                    if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                        series.theta.push(ts.toString());
                    }
                    else {
                        series.theta.push(GTSLib.toISOString(ts, _this.divider, _this._options.timeZone));
                    }
                });
                if (_this.unit) {
                    series.title = {
                        text: _this.unit
                    };
                }
                dataset.push(series);
            });
            this.layout.polar.radialaxis.range = [minVal, maxVal];
            return dataset;
        };
        return WarpViewPolarComponent;
    }(WarpViewComponent));
    WarpViewPolarComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-polar',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"wv-tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;display:none;font-size:10px;height:auto!important;left:-1000px;max-width:50%;min-width:100px;padding:10px;pointer-events:none;position:absolute;text-align:left;width:auto;z-index:999}.wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}:host{display:block;height:100%}:host .bglayer{display:none}:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}"]
                },] }
    ];
    WarpViewPolarComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };

    /**
     *
     */
    var WarpViewRadarComponent = /** @class */ (function (_super) {
        __extends(WarpViewRadarComponent, _super);
        function WarpViewRadarComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.layout = {
                paper_bgcolor: 'transparent',
                showlegend: true,
                legend: { orientation: 'h' },
                font: { size: 12 },
                polar: {
                    bgcolor: 'transparent',
                    angularaxis: { type: 'category' },
                    radialaxis: { visible: true }
                },
                margin: {
                    t: 0,
                    b: 25,
                    r: 10,
                    l: 10
                }
            };
            _this.LOG = new Logger(WarpViewRadarComponent, _this._debug);
            return _this;
        }
        WarpViewRadarComponent.prototype.update = function (options, refresh) {
            this.LOG.debug(['onOptions', 'before'], this._options, options);
            if (!deepEqual__default['default'](options, this._options)) {
                this.LOG.debug(['options', 'changed'], options);
                this._options = ChartLib.mergeDeep(this._options, options);
            }
            this.drawChart();
        };
        WarpViewRadarComponent.prototype.ngOnInit = function () {
            this._options = this._options || this.defOptions;
        };
        WarpViewRadarComponent.prototype.drawChart = function () {
            if (!this.initChart(this.el)) {
                return;
            }
            this.layout.polar.radialaxis.color = this.getGridColor(this.el.nativeElement);
            this.layout.polar.angularaxis.color = this.getGridColor(this.el.nativeElement);
            this.layout.showlegend = this.showLegend;
            this.LOG.debug(['drawChart', 'this.layout'], this.layout);
            this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
            this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
            this.loading = false;
        };
        WarpViewRadarComponent.prototype.convert = function (data) {
            var _this = this;
            var dataset = [];
            var divider = GTSLib.getDivider(this._options.timeUnit);
            var gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data, 0).res);
            this.LOG.debug(['convert', 'gtsList'], gtsList);
            var minVal = Number.MAX_VALUE;
            var maxVal = Number.MIN_VALUE;
            gtsList.forEach(function (gts, i) {
                var c = ColorLib.getColor(i, _this._options.scheme);
                var color = ((data.params || [])[gts.id] || { datasetColor: c }).datasetColor || c;
                var series = {
                    r: [],
                    theta: [],
                    line: { color: color },
                    marker: {
                        line: { color: color, width: 1 },
                        color: ColorLib.transparentize(color)
                    },
                    fillcolor: ColorLib.transparentize(color),
                    hoverinfo: 'none',
                    name: GTSLib.serializeGtsMetadata(gts),
                    text: GTSLib.serializeGtsMetadata(gts),
                    type: 'scatterpolar',
                    fill: 'toself'
                };
                gts.v.forEach(function (value) {
                    var ts = value[0];
                    series.r.push(value[value.length - 1]);
                    minVal = Math.min(minVal, value[value.length - 1]);
                    maxVal = Math.max(maxVal, value[value.length - 1]);
                    if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                        series.theta.push(ts.toString());
                    }
                    else {
                        series.theta.push(GTSLib.toISOString(ts, _this.divider, _this._options.timeZone));
                    }
                });
                dataset.push(series);
            });
            this.layout.polar.radialaxis.range = [minVal, maxVal];
            return dataset;
        };
        return WarpViewRadarComponent;
    }(WarpViewComponent));
    WarpViewRadarComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-radar',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"wv-tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;display:none;font-size:10px;height:auto!important;left:-1000px;max-width:50%;min-width:100px;padding:10px;pointer-events:none;position:absolute;text-align:left;width:auto;z-index:999}.wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}:host{display:block;height:100%}:host .bglayer{display:none}:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}"]
                },] }
    ];
    WarpViewRadarComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };

    /**
     *
     */
    var WarpViewPlotComponent = /** @class */ (function (_super) {
        __extends(WarpViewPlotComponent, _super);
        function WarpViewPlotComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.isAlone = false;
            _this.initialChartHeight = 400;
            _this.initialMapHeight = 400;
            _this.warpViewChartResize = new i0.EventEmitter();
            _this.warpViewNewOptions = new i0.EventEmitter();
            _this._options = Object.assign(Object.assign({}, new Param()), {
                showControls: true,
                showGTSTree: true,
                showDots: true,
                timeZone: 'UTC',
                timeUnit: 'us',
                timeMode: 'date',
                bounds: {}
            });
            _this._toHide = [];
            _this.showChart = true;
            _this.showMap = false;
            _this.timeClipValue = '';
            _this.kbdLastKeyPressed = [];
            _this.warningMessage = '';
            _this.loading = false;
            _this.gtsIdList = [];
            _this.kbdCounter = 0;
            _this.gtsFilterCount = 0;
            _this.gtsBrowserIndex = -1;
            _this._gtsFilter = 'x';
            _this._type = 'line';
            _this.chartBounds = {
                tsmin: Number.MAX_VALUE,
                tsmax: Number.MIN_VALUE,
                msmax: '',
                msmin: '',
                marginLeft: 0
            };
            // key event are trapped in plot component.
            // if one of this key is pressed, default action is prevented.
            _this.preventDefaultKeyList = ['Escape', '/'];
            _this.preventDefaultKeyListInModals = ['Escape', 'ArrowUp', 'ArrowDown', ' ', '/'];
            _this.showLine = false;
            _this.LOG = new Logger(WarpViewPlotComponent, _this._debug);
            return _this;
        }
        Object.defineProperty(WarpViewPlotComponent.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (type) {
                this._type = type;
                this.drawChart();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewPlotComponent.prototype, "gtsFilter", {
            get: function () {
                return this._gtsFilter;
            },
            set: function (gtsFilter) {
                this._gtsFilter = gtsFilter;
                this.drawChart();
            },
            enumerable: false,
            configurable: true
        });
        WarpViewPlotComponent.prototype.ngOnInit = function () {
            this._options = this._options || this.defOptions;
        };
        WarpViewPlotComponent.prototype.ngAfterViewInit = function () {
            this.drawChart(true);
            this.resizeArea();
        };
        WarpViewPlotComponent.prototype.handleKeydown = function (ev) {
            this.LOG.debug(['handleKeydown'], ev);
            if (!this.isAlone) {
                this.handleKeyPress(ev).then(function () {
                    // empty
                });
            }
        };
        WarpViewPlotComponent.prototype.stateChange = function (event) {
            var _this = this;
            this.LOG.debug(['stateChange'], event);
            switch (event.id) {
                case 'timeSwitch':
                    if (event.state) {
                        this._options.timeMode = 'timestamp';
                    }
                    else {
                        this._options.timeMode = 'date';
                    }
                    this.drawChart(true);
                    break;
                case 'typeSwitch':
                    if (event.state) {
                        this._type = 'step';
                    }
                    else {
                        this._type = 'line';
                    }
                    this.drawChart(true);
                    break;
                case 'chartSwitch':
                    this.showChart = event.state;
                    this.drawChart(false);
                    break;
                case 'mapSwitch':
                    this.showMap = event.state;
                    if (this.showMap) {
                        requestAnimationFrame(function () { return _this.map.resize(); });
                    }
                    break;
            }
            this.warpViewNewOptions.emit(this._options);
        };
        WarpViewPlotComponent.prototype.boundsDidChange = function (event) {
            this.LOG.debug(['updateBounds'], event);
            this._options.bounds = this._options.bounds || {};
            if (this._options.bounds.minDate !== event.bounds.min && this._options.bounds.maxDate !== event.bounds.max) {
                this._options.bounds = this._options.bounds || {};
                this._options.bounds.minDate = event.bounds.min;
                this._options.bounds.maxDate = event.bounds.max;
                this.warpViewNewOptions.emit(this._options);
                if (event.source === 'chart') {
                    this.annotation.updateBounds(event.bounds.min, event.bounds.max, event.bounds.marginLeft);
                }
                else if (event.source === 'annotation') {
                    this.chart.updateBounds(event.bounds.min, event.bounds.max);
                }
                this.LOG.debug(['updateBounds'], GTSLib.toISOString(event.bounds.min, 1, this._options.timeZone), GTSLib.toISOString(event.bounds.max, 1, this._options.timeZone));
                this.line.nativeElement.style.left = '-100px';
            }
        };
        WarpViewPlotComponent.prototype.onWarpViewModalClose = function () {
            this.mainPlotDiv.nativeElement.focus();
        };
        WarpViewPlotComponent.prototype.warpViewSelectedGTS = function (event) {
            var _this = this;
            this.LOG.debug(['warpViewSelectedGTS'], event);
            if (!this._toHide.find(function (i) {
                return i === event.gts.id;
            }) && !event.selected) { // if not in toHide and state false, put id in toHide
                this._toHide.push(event.gts.id);
            }
            else {
                if (event.selected) { // if in toHide and state true, remove it from toHide
                    this._toHide = this._toHide.filter(function (i) {
                        return i !== event.gts.id;
                    });
                }
            }
            this.LOG.debug(['warpViewSelectedGTS', 'this._toHide'], this._toHide);
            this.ngZone.run(function () {
                _this._toHide = __spread(_this._toHide);
            });
        };
        WarpViewPlotComponent.prototype.handleMouseMove = function (evt) {
            evt.preventDefault();
            if (this.showLine && this.line) {
                this.line.nativeElement.style.left = Math.max(evt.pageX - this.left, 50) + 'px';
            }
        };
        WarpViewPlotComponent.prototype.handleMouseEnter = function (evt) {
            evt.preventDefault();
            this.left = this.left || this.main.nativeElement.getBoundingClientRect().left;
            this.showLine = true;
            if (this.line) {
                this.renderer.setStyle(this.line.nativeElement, 'display', 'block');
            }
        };
        WarpViewPlotComponent.prototype.handleMouseOut = function (evt) {
            // evt.preventDefault();
            if (this.line) {
                this.showLine = false;
                this.renderer.setStyle(this.line.nativeElement, 'left', '-100px');
                this.renderer.setStyle(this.line.nativeElement, 'display', 'none');
            }
        };
        WarpViewPlotComponent.prototype.update = function (options, refresh) {
            this.drawChart(refresh);
        };
        WarpViewPlotComponent.prototype.inputTextKeyboardEvents = function (e) {
            e.stopImmediatePropagation();
            if (e.key === 'Enter') {
                this.applyFilter();
            }
            else if (e.key === 'Escape') {
                this.pushKbdEvent('Escape');
                this.modal.close();
            }
        };
        WarpViewPlotComponent.prototype.tzSelected = function (event) {
            var timeZone = this.tzSelector.nativeElement.value;
            this.LOG.debug(['timezone', 'tzselect'], timeZone, event);
            delete this._options.bounds;
            this._options.timeZone = timeZone;
            this.tzSelector.nativeElement.setAttribute('class', timeZone === 'UTC' ? 'defaulttz' : 'customtz');
            this.drawChart();
        };
        WarpViewPlotComponent.prototype.getTimeClip = function () {
            this.LOG.debug(['getTimeClip'], this.chart.getTimeClip());
            return this.chart.getTimeClip();
        };
        WarpViewPlotComponent.prototype.resizeChart = function (event) {
            if (this.initialChartHeight !== event) {
                this.LOG.debug(['resizeChart'], event);
                this.initialChartHeight = event;
                this.sizeService.change(new Size(this.width, event));
            }
        };
        WarpViewPlotComponent.prototype.drawChart = function (firstDraw) {
            var _this = this;
            if (firstDraw === void 0) { firstDraw = false; }
            this.LOG.debug(['drawCharts'], this._data, this._options);
            if (!this._data || !this._data.data || this._data.data.length === 0) {
                return;
            }
            if (this.timeClip) {
                this.timeClip.close();
            }
            if (this.modal) {
                this.modal.close();
            }
            this.LOG.debug(['PPts'], 'firstdraw ', firstDraw);
            if (firstDraw) { // on the first draw, we can set some default options.
                // automatically switch to timestamp mode
                // when the first tick and last tick of all the series are in the interval [-100ms 100ms]
                var tsLimit_1 = 100 * GTSLib.getDivider(this._options.timeUnit);
                var dataList = this._data.data;
                if (dataList) {
                    var gtsList = GTSLib.flattenGtsIdArray(dataList, 0).res;
                    gtsList = GTSLib.flatDeep(gtsList);
                    var timestampMode_1 = true;
                    var totalDatapoints_1 = 0;
                    gtsList.forEach(function (g) {
                        _this.gtsIdList.push(g.id); // usefull for gts browse shortcut
                        if (g.v.length > 0) { // if gts not empty
                            timestampMode_1 = timestampMode_1 && (g.v[0][0] > -tsLimit_1 && g.v[0][0] < tsLimit_1);
                            timestampMode_1 = timestampMode_1 && (g.v[g.v.length - 1][0] > -tsLimit_1 && g.v[g.v.length - 1][0] < tsLimit_1);
                            totalDatapoints_1 += g.v.length;
                        }
                    });
                    if (timestampMode_1) {
                        this._options.timeMode = 'timestamp';
                    }
                    this.LOG.debug(['drawCharts', 'parsed', 'timestampMode'], timestampMode_1);
                }
            }
            this.gtsList = this._data;
            this._options = Object.assign({}, this._options);
            this.LOG.debug(['drawCharts', 'parsed'], this._data, this._options);
            this.resizeArea();
        };
        WarpViewPlotComponent.prototype.focus = function (event) {
            // read the first 4 letters of id of all elements in the click tree
            var idListClicked = event.path.map(function (el) { return (el.id || '').slice(0, 4); });
            // if not alone on the page, and click is not on the timezone selector and not on the map, force focus.
            if (!this.isAlone && idListClicked.indexOf('tzSe') < 0 && idListClicked.indexOf('map-') < 0) {
                this.mainPlotDiv.nativeElement.focus();
            } // prevent stealing focus of the timezone selector.
        };
        WarpViewPlotComponent.prototype.handleKeyPress = function (ev) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            this.LOG.debug(['handleKeyPress'], ev);
                            if (this.preventDefaultKeyList.indexOf(ev.key) >= 0) {
                                ev.preventDefault();
                            }
                            return [4 /*yield*/, this.timeClip.isOpened()];
                        case 1:
                            _b = (_c.sent());
                            if (_b) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.modal.isOpened()];
                        case 2:
                            _b = (_c.sent());
                            _c.label = 3;
                        case 3:
                            _a = _b;
                            if (_a) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.gtsPopupModal.isOpened()];
                        case 4:
                            _a = (_c.sent());
                            _c.label = 5;
                        case 5:
                            if (_a) {
                                if (this.preventDefaultKeyListInModals.indexOf(ev.key) >= 0) {
                                    ev.preventDefault();
                                }
                            }
                            if (ev.key === '/') {
                                this.modal.open();
                                this.filterInput.nativeElement.focus();
                                this.filterInput.nativeElement.select();
                            }
                            else if (ev.key === 't') {
                                this.chart.getTimeClip().then(function (tc) {
                                    _this.timeClipValue = "<p>keep data between\n          " + (_this._options.timeMode === 'timestamp' ? tc.tsmin : moment__default['default'].tz(tc.tsmin, _this._options.timeZone).toLocaleString()) + " and\n          " + (_this._options.timeMode === 'timestamp' ? tc.tsmax : moment__default['default'].tz(tc.tsmax, _this._options.timeZone).toLocaleString()) + "\n          " + (_this._options.timeUnit !== 'us' ? ' (for a ' + _this._options.timeUnit + ' platform)' : '') + "</p>\n          <pre><code>" + Math.round(tc.tsmax) + " " + Math.round(tc.tsmax - tc.tsmin) + " TIMECLIP</code></pre>";
                                    _this.timeClip.open();
                                });
                            }
                            else if (ev.key === 'b' || ev.key === 'B') { // browse among all gts
                                if (this.gtsBrowserIndex < 0) {
                                    this.gtsBrowserIndex = 0;
                                }
                                if (ev.key === 'b') { // increment index
                                    this.gtsBrowserIndex++;
                                    if (this.gtsBrowserIndex === this.gtsIdList.length) {
                                        this.gtsBrowserIndex = 0;
                                    }
                                }
                                else { // decrement index
                                    this.gtsBrowserIndex--;
                                    if (this.gtsBrowserIndex < 0) {
                                        this.gtsBrowserIndex = this.gtsIdList.length - 1;
                                    }
                                }
                                this._toHide = this.gtsIdList.filter(function (v) { return v !== _this.gtsIdList[_this.gtsBrowserIndex]; }); // hide all but one
                            }
                            else if (ev.key === 'n') {
                                this._toHide = __spread(this.gtsIdList);
                                return [2 /*return*/, false];
                            }
                            else if (ev.key === 'a') {
                                this._toHide = [];
                            }
                            else if (ev.key === 'Escape') {
                                this.timeClip.isOpened().then(function (r) {
                                    if (r) {
                                        _this.timeClip.close();
                                    }
                                });
                                this.modal.isOpened().then(function (r) {
                                    if (r) {
                                        _this.modal.close();
                                    }
                                });
                                this.gtsPopupModal.isOpened().then(function (r) {
                                    if (r) {
                                        _this.gtsPopupModal.close();
                                    }
                                });
                            }
                            else {
                                this.pushKbdEvent(ev.key);
                            }
                            this.LOG.debug(['handleKeyPress', 'this.gtsIdList'], this._toHide, this.gtsBrowserIndex);
                            return [2 /*return*/];
                    }
                });
            });
        };
        WarpViewPlotComponent.prototype.applyFilter = function () {
            this.gtsFilterCount++;
            this._gtsFilter = this.gtsFilterCount.toString().slice(0, 1) + this.filterInput.nativeElement.value;
            this.modal.close();
        };
        WarpViewPlotComponent.prototype.pushKbdEvent = function (key) {
            this.kbdCounter++;
            this.kbdLastKeyPressed = [key, this.kbdCounter.toString()];
        };
        WarpViewPlotComponent.prototype.getTZ = function () {
            return moment__default['default'].tz.names();
        };
        WarpViewPlotComponent.prototype.convert = function (data) {
            return [];
        };
        WarpViewPlotComponent.prototype.onChartDraw = function ($event, component) {
            if (this.chartBounds
                && $event
                && this.chartBounds.tsmin !== Math.min(this.chartBounds.tsmin, $event.tsmin)
                && this.chartBounds.tsmax !== Math.max(this.chartBounds.tsmax, $event.tsmax)) {
                this.chartBounds.tsmin = Math.min(this.chartBounds.tsmin, $event.tsmin);
                this.chartBounds.tsmax = Math.max(this.chartBounds.tsmax, $event.tsmax);
                this.annotation.setRealBounds(this.chartBounds);
                this.chart.setRealBounds(this.chartBounds);
                this.chartDraw.emit();
                this.LOG.debug(['onChartDraw', 'this.chartBounds'], component, this.chartBounds, $event);
            }
            else {
                this.chartDraw.emit($event);
            }
            this.resizeArea();
        };
        WarpViewPlotComponent.prototype.resizeArea = function () {
            var _this = this;
            if (this.showChart && !!this.chart) {
                var h = this.chart.el.nativeElement.getBoundingClientRect().height;
                if (h > 0) {
                    if (!!this.GTSTree) {
                        h -= this.GTSTree.nativeElement.getBoundingClientRect().height;
                    }
                    if (!!this.controls) {
                        h -= this.controls.nativeElement.getBoundingClientRect().height;
                    }
                    this.initialChartHeight = h;
                }
                else {
                    setTimeout(function () { return _this.resizeArea(); }, 100);
                }
            }
        };
        return WarpViewPlotComponent;
    }(WarpViewComponent));
    WarpViewPlotComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-plot',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div #mainPlotDiv tabindex=\"0\" (click)=\"focus($event)\" id=\"focusablePlotDiv\">\n  <warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\" modalTitle=\"TimeClip\" #timeClip\n                  (warpViewModalClose)=\"onWarpViewModalClose()\"\n  >\n    <div #timeClipElement [innerHTML]=\"timeClipValue\"></div>\n  </warpview-modal>\n  <warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\" modalTitle=\"GTS Filter\" #modal\n                  (warpViewModalClose)=\"onWarpViewModalClose()\"\n  >\n    <label for=\"filterInput\">Enter a regular expression to filter GTS.</label>\n    <br />\n    <input tabindex=\"1\" type=\"text\" (keypress)=\"inputTextKeyboardEvents($event)\" #filterInput id=\"filterInput\"\n           (keydown)=\"inputTextKeyboardEvents($event)\" (keyup)=\"inputTextKeyboardEvents($event)\"\n           [value]=\"gtsFilter.slice(1)\"/>\n    <button (click)=\"applyFilter()\" [innerHTML]=\"_options.popupButtonValidateLabel || 'Apply'\"\n            class=\"{{_options.popupButtonValidateClass}}\" tabindex=\"2\"\n            type=\"button\">\n    </button>\n  </warpview-modal>\n  <warpview-gts-popup [maxToShow]=\"5\" [hiddenData]=\"_toHide\" [gtsList]=\"gtsList\"\n                      [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n                      [options]=\"_options\" [debug]=\"debug\"\n                      (warpViewModalClose)=\"onWarpViewModalClose()\"\n                      (warpViewSelectedGTS)=\"warpViewSelectedGTS($event)\"\n                      #gtsPopupModal></warpview-gts-popup>\n  <div class=\"inline\" *ngIf=\"_options.showControls\" #controls>\n    <warpview-toggle id=\"timeSwitch\" text1=\"Date\" text2=\"Timestamp\"\n                     (stateChange)=\"stateChange($event)\"\n                     [checked]=\"_options.timeMode === 'timestamp'\"></warpview-toggle>\n    <warpview-toggle id=\"typeSwitch\" text1=\"Line\" text2=\"Step\"\n                     (stateChange)=\"stateChange($event)\"></warpview-toggle>\n    <warpview-toggle id=\"chartSwitch\" text1=\"Hide chart\" text2=\"Display chart\"\n                     (stateChange)=\"stateChange($event)\"\n                     [checked]=\"showChart\"></warpview-toggle>\n    <warpview-toggle id=\"mapSwitch\" text1=\"Hide map\" text2=\"Display map\"\n                     (stateChange)=\"stateChange($event)\" [checked]=\"showMap\"></warpview-toggle>\n    <div class=\"tzcontainer\">\n      <label for=\"tzSelector\"></label>\n      <select id=\"tzSelector\" class=\"defaulttz\" #tzSelector (change)=\"tzSelected($event)\">\n        <option *ngFor=\"let z of getTZ()\" [value]=\"z\" [selected]=\"z === 'UTC'\"\n                [ngClass]=\"{'defaulttz' :z === 'UTC','customtz': z !== 'UTC'}\">{{z}}</option>\n      </select>\n    </div>\n  </div>\n  <div *ngIf=\"warningMessage\" class=\"warningMessage\">{{warningMessage}}</div>\n  <warpview-gts-tree\n    *ngIf=\"_options.showGTSTree\"\n    [data]=\"gtsList\" id=\"tree\" [gtsFilter]=\"gtsFilter\" [debug]=\"debug\" #GTSTree\n    (warpViewSelectedGTS)=\"warpViewSelectedGTS($event)\"\n    [hiddenData]=\"_toHide\" [options]=\"_options\"\n    [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n  ></warpview-gts-tree>\n  <div [hidden]=\"!showChart\" #main class=\"main-container\"\n       (mouseleave)=\"handleMouseOut($event)\"\n       (mousemove)=\"handleMouseMove($event)\"\n       (mouseenter)=\"handleMouseEnter($event)\">\n    <div class=\"bar\" #line></div>\n    <div class=\"annotation\">\n      <warpview-annotation #annotation\n                           [data]=\"gtsList\" [responsive]=\"true\"\n                           (boundsDidChange)=\"boundsDidChange($event)\"\n                           (chartDraw)=\"onChartDraw($event, 'annotation')\"\n                           [showLegend]='showLegend' [debug]=\"debug\" [standalone]=\"false\"\n                           [hiddenData]=\"_toHide\" [options]=\"_options\"\n      ></warpview-annotation>\n    </div>\n    <warpview-resize minHeight=\"100\" [initialHeight]=\"initialChartHeight\" [debug]=\"debug\"\n                     (resize)=\"resizeChart($event)\"\n    >\n      <warpview-chart [responsive]=\"true\" [standalone]=\"false\" [data]=\"gtsList\"\n                      [showLegend]=\"showLegend\"\n                      (boundsDidChange)=\"boundsDidChange($event)\"\n                      (chartDraw)=\"onChartDraw($event, 'chart')\"\n                      #chart [debug]=\"debug\" [hiddenData]=\"_toHide\" [type]=\"type\" [options]=\"_options\"\n      ></warpview-chart>\n    </warpview-resize>\n  </div>\n  <warpview-resize *ngIf=\"showMap\" minHeight=\"100\" [initialHeight]=\"initialMapHeight\" [debug]=\"debug\">\n    <div class=\"map-container\">\n      <warpview-map [options]=\"_options\" #map [data]=\"gtsList\" [debug]=\"debug\" [responsive]=\"true\"\n                    [hiddenData]=\"_toHide\"\n      ></warpview-map>\n    </div>\n  </warpview-resize>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.None,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host,warp-view-plot,warpview-plot{height:100%;position:relative}:host .main-container,warp-view-plot .main-container,warpview-plot .main-container{position:relative}:host .map-container,warp-view-plot .map-container,warpview-plot .map-container{height:100%;margin-right:20px;position:relative;width:100%}:host .bar,warp-view-plot .bar,warpview-plot .bar{-webkit-backface-visibility:hidden;backface-visibility:hidden;background-color:transparent;border-left:2px dashed var(--warp-view-bar-color);bottom:55px;display:none;height:calc(100% - 75px);left:-100px;overflow:hidden;pointer-events:none;position:absolute;top:0;width:1px;z-index:0}:host .inline,warp-view-plot .inline,warpview-plot .inline{align-items:stretch;display:inline-flex;flex-direction:row;flex-wrap:wrap;justify-content:space-evenly;width:100%}:host label,warp-view-plot label,warpview-plot label{display:inline-block}:host input,warp-view-plot input,warpview-plot input{display:block;font-size:1rem;font-weight:400;line-height:1.5;padding:5px;width:calc(100% - 20px)}:host .annotation,warp-view-plot .annotation,warpview-plot .annotation{height:auto;margin-bottom:0;max-width:100%;padding-top:20px}:host #focusablePlotDiv:focus,warp-view-plot #focusablePlotDiv:focus,warpview-plot #focusablePlotDiv:focus{outline:none}:host #tzSelector,warp-view-plot #tzSelector,warpview-plot #tzSelector{border:none;border-radius:var(--warp-view-switch-radius);box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);color:var(--warp-view-font-color);height:var(--warp-view-switch-height);margin:auto;padding-left:calc(var(--warp-view-switch-radius)/2);padding-right:5px}:host .defaulttz,warp-view-plot .defaulttz,warpview-plot .defaulttz{background:var(--warp-view-switch-inset-color)}:host .customtz,warp-view-plot .customtz,warpview-plot .customtz{background:var(--warp-view-switch-inset-checked-color)}:host .tzcontainer,warp-view-plot .tzcontainer,warpview-plot .tzcontainer{display:flex}:host .chart-container,warp-view-plot .chart-container,warpview-plot .chart-container{height:var(--warp-view-plot-chart-height);width:100%}:host #bottomPlaceHolder,warp-view-plot #bottomPlaceHolder,warpview-plot #bottomPlaceHolder{height:200px;width:100%}:host .warningMessage,warp-view-plot .warningMessage,warpview-plot .warningMessage{background:#faebd7;border:2px solid orange;border-radius:3px;color:orange;display:block;margin:1em;padding:10px}"]
                },] }
    ];
    WarpViewPlotComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewPlotComponent.propDecorators = {
        mainPlotDiv: [{ type: i0.ViewChild, args: ['mainPlotDiv', { static: true },] }],
        timeClip: [{ type: i0.ViewChild, args: ['timeClip', { static: true },] }],
        modal: [{ type: i0.ViewChild, args: ['modal', { static: true },] }],
        chart: [{ type: i0.ViewChild, args: ['chart',] }],
        gtsPopupModal: [{ type: i0.ViewChild, args: ['gtsPopupModal',] }],
        annotation: [{ type: i0.ViewChild, args: ['annotation',] }],
        map: [{ type: i0.ViewChild, args: ['map',] }],
        timeClipElement: [{ type: i0.ViewChild, args: ['timeClipElement', { static: true },] }],
        GTSTree: [{ type: i0.ViewChild, args: ['GTSTree', { static: true },] }],
        controls: [{ type: i0.ViewChild, args: ['controls', { static: true },] }],
        filterInput: [{ type: i0.ViewChild, args: ['filterInput', { static: true },] }],
        tzSelector: [{ type: i0.ViewChild, args: ['tzSelector',] }],
        line: [{ type: i0.ViewChild, args: ['line',] }],
        main: [{ type: i0.ViewChild, args: ['main',] }],
        type: [{ type: i0.Input, args: ['type',] }],
        gtsFilter: [{ type: i0.Input, args: ['gtsFilter',] }],
        isAlone: [{ type: i0.Input, args: ['isAlone',] }],
        initialChartHeight: [{ type: i0.Input, args: ['initialChartHeight',] }],
        initialMapHeight: [{ type: i0.Input, args: ['initialMapHeight',] }],
        warpViewChartResize: [{ type: i0.Output, args: ['warpViewChartResize',] }],
        warpViewNewOptions: [{ type: i0.Output, args: ['warpViewNewOptions',] }],
        handleKeydown: [{ type: i0.HostListener, args: ['keydown', ['$event'],] }]
    };

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
    /**
     *
     */
    var WarpViewResizeComponent = /** @class */ (function () {
        function WarpViewResizeComponent(el, renderer) {
            this.el = el;
            this.renderer = renderer;
            this.minHeight = '10';
            this.initialHeight = 100;
            this.resize = new i0.EventEmitter();
            this.dragging = false;
            this._debug = false;
            this.LOG = new Logger(WarpViewResizeComponent, this._debug);
        }
        Object.defineProperty(WarpViewResizeComponent.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (debug) {
                this._debug = debug;
                this.LOG.setDebug(debug);
            },
            enumerable: false,
            configurable: true
        });
        WarpViewResizeComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.LOG.debug(['ngAfterViewInit'], this.initialHeight);
            this.renderer.setStyle(this.wrapper.nativeElement, 'height', this.initialHeight + 'px');
            // the click event on the handlebar attach mousemove and mouseup events to document.
            this.handleDiv.nativeElement.addEventListener('mousedown', function (ev) {
                if (0 === ev.button) {
                    // keep left click only
                    _this.moveListener = _this.handleDraggingMove.bind(_this);
                    _this.clickUpListener = _this.handleDraggingEnd.bind(_this);
                    document.addEventListener('mousemove', _this.moveListener, false);
                    document.addEventListener('mouseup', _this.clickUpListener, false);
                }
            });
        };
        WarpViewResizeComponent.prototype.handleDraggingEnd = function () {
            this.dragging = false;
            // the mouseup detach mousemove and mouseup events from document.
            if (this.moveListener) {
                document.removeEventListener('mousemove', this.moveListener, false);
                this.moveListener = null;
            }
            if (this.clickUpListener) {
                document.removeEventListener('mouseup', this.clickUpListener, false);
                this.clickUpListener = null;
            }
        };
        WarpViewResizeComponent.prototype.handleDraggingMove = function (ev) {
            ev.preventDefault();
            this.LOG.debug(['handleDraggingMove'], ev);
            // compute Y of the parent div top relative to page
            var yTopParent = this.handleDiv.nativeElement.parentElement.getBoundingClientRect().top
                - document.body.getBoundingClientRect().top;
            // compute new parent height
            var h = ev.pageY - yTopParent + this.handleDiv.nativeElement.getBoundingClientRect().height / 2;
            if (h < parseInt(this.minHeight, 10)) {
                h = parseInt(this.minHeight, 10);
            }
            // apply new height
            this.renderer.setStyle(this.handleDiv.nativeElement.parentElement, 'height', h + 'px');
            this.LOG.debug(['handleDraggingMove'], h);
            this.resize.emit(h);
        };
        return WarpViewResizeComponent;
    }());
    WarpViewResizeComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-resize',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" #wrapper>\n  <ng-content></ng-content>\n  <div class=\"handle\" #handleDiv></div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.None,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host .handle,warp-view-resize .handle,warpview-resize .handle{background-color:var(--warp-view-resize-handle-color);background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=\");background-position:50%;background-repeat:no-repeat;bottom:0;height:var(--warp-view-resize-handle-height);position:absolute;width:100%}:host .handle:hover,warp-view-resize .handle:hover,warpview-resize .handle:hover{cursor:row-resize}:host .wrapper,warp-view-resize .wrapper,warpview-resize .wrapper{height:100%;padding-bottom:var(--warp-view-resize-handle-height);position:relative;width:100%}"]
                },] }
    ];
    WarpViewResizeComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 }
    ]; };
    WarpViewResizeComponent.propDecorators = {
        handleDiv: [{ type: i0.ViewChild, args: ['handleDiv', { static: true },] }],
        wrapper: [{ type: i0.ViewChild, args: ['wrapper', { static: true },] }],
        minHeight: [{ type: i0.Input, args: ['minHeight',] }],
        initialHeight: [{ type: i0.Input, args: ['initialHeight',] }],
        debug: [{ type: i0.Input, args: ['debug',] }],
        resize: [{ type: i0.Output, args: ['resize',] }]
    };

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
    /**
     *
     */
    var WarpViewSliderComponent = /** @class */ (function () {
        function WarpViewSliderComponent() {
            this.mode = 'timestamp';
            this.change = new i0.EventEmitter();
            this.show = false;
            this._step = 0;
            this.loaded = false;
            this.manualRefresh = new i0.EventEmitter();
            this._debug = false;
            this.LOG = new Logger(WarpViewSliderComponent, this.debug);
            this.LOG.debug(['constructor'], this.debug);
        }
        Object.defineProperty(WarpViewSliderComponent.prototype, "min", {
            get: function () {
                return this._min;
            },
            set: function (m) {
                this.LOG.debug(['min'], m);
                this._min = m;
                this.setOptions();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewSliderComponent.prototype, "max", {
            get: function () {
                return this._max;
            },
            set: function (m) {
                this.LOG.debug(['max'], m);
                this._max = m;
                this.setOptions();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewSliderComponent.prototype, "step", {
            get: function () {
                return this._step;
            },
            set: function (step) {
                this.LOG.debug(['step'], step);
                if (this._step !== step) {
                    this._step = step;
                    this.setOptions();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewSliderComponent.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (debug) {
                this._debug = debug;
                this.LOG.setDebug(debug);
            },
            enumerable: false,
            configurable: true
        });
        WarpViewSliderComponent.prototype.ngAfterViewInit = function () {
            this.loaded = false;
            this.setOptions();
        };
        WarpViewSliderComponent.prototype.setOptions = function () {
            var _this = this;
            if (!this._min && !this._max) {
                return;
            }
            this.LOG.debug(['_step'], this._step);
            var tmpVAl = Math.min(Math.max(this.value || Number.MIN_VALUE, this._min), this._max);
            if (tmpVAl !== this.value && this.loaded) {
                this.change.emit(tmpVAl);
            }
            this.value = tmpVAl;
            this.loaded = true;
            this.LOG.debug(['noUiSlider'], this.slider);
            if (this.slider) {
                if (!this._uiSlider) {
                    var opts = {
                        start: [this.value + 1],
                        tooltips: [this.getFormat()],
                        range: { min: [this._min], max: [this._max] }
                    };
                    if (!!this._step && this._step > 0) {
                        opts.step = Math.floor((this._max - this._min) / this._step);
                    }
                    this._uiSlider = noUiSlider.create(this.slider.nativeElement, opts);
                    this._uiSlider.on('end', function (event) {
                        _this.LOG.debug(['onChange'], event);
                        _this.value = parseInt(event[0], 10);
                        _this.change.emit({ value: parseInt(event[0], 10) });
                    });
                }
                else {
                    this.updateSliderOptions();
                }
            }
        };
        WarpViewSliderComponent.prototype.updateSliderOptions = function () {
            // tslint:disable-next-line:no-string-literal
            this.slider.nativeElement['noUiSlider'].set([this.value]);
            var opts = { range: { min: [this._min], max: [this._max] } };
            if (!!this._step && this._step > 0) {
                opts.step = Math.floor((this._max - this._min) / this._step);
            }
            // tslint:disable-next-line:no-string-literal
            this.slider.nativeElement['noUiSlider'].updateOptions(opts);
        };
        WarpViewSliderComponent.prototype.format = function (value) {
            if (this.mode !== 'timestamp') {
                return moment__default$1['default'](value).utc(true).format('YYYY/MM/DD hh:mm:ss');
            }
            else {
                return value.toString();
            }
        };
        WarpViewSliderComponent.prototype.getFormat = function () {
            var _this = this;
            return {
                to: function (value) { return _this.format(value); },
                from: function (value) { return value.replace(',-', ''); }
            };
        };
        return WarpViewSliderComponent;
    }());
    WarpViewSliderComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-slider',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"custom-slider\" *ngIf=\"loaded\">\n  <div style=\"display: flex; width: 100%;justify-content: flex-start;\">\n    <div>{{format(_min)}}</div>\n    <div #slider style=\"flex-grow: 4\"></div>\n    <div>{{format(_max)}}</div>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */@import url(/home/xavier/workspace/warp-view/node_modules/nouislider/distribute/nouislider.min.css);\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.noUi-origin{left:100%}.noUi-target{margin:0 20px 40px;max-width:100%}.noUi-connect{background:var(--warp-slider-connect-color);left:0}.noUi-handle{background:var(--warp-slider-handle-bg-color);border:1px solid var(--warp-slider-handle-color);border-radius:3px;box-shadow:var(--warp-slider-handle-shadow);cursor:pointer}.noUi-handle:after,.noUi-handle:before{background:var(--warp-slider-handle-color)}.noUi-tooltip{display:none}.noUi-active .noUi-tooltip{display:block}:host .custom-slider{margin-top:50px}"]
                },] }
    ];
    WarpViewSliderComponent.ctorParameters = function () { return []; };
    WarpViewSliderComponent.propDecorators = {
        slider: [{ type: i0.ViewChild, args: ['slider',] }],
        min: [{ type: i0.Input, args: ['min',] }],
        max: [{ type: i0.Input, args: ['max',] }],
        value: [{ type: i0.Input, args: ['value',] }],
        step: [{ type: i0.Input, args: ['step',] }],
        mode: [{ type: i0.Input, args: ['mode',] }],
        debug: [{ type: i0.Input, args: ['debug',] }],
        change: [{ type: i0.Output, args: ['change',] }]
    };

    /**
     *
     */
    var WarpViewRangeSliderComponent = /** @class */ (function (_super) {
        __extends(WarpViewRangeSliderComponent, _super);
        function WarpViewRangeSliderComponent() {
            var _this = _super.call(this) || this;
            _this.LOG = new Logger(WarpViewRangeSliderComponent, _this.debug);
            _this.LOG.debug(['constructor'], _this.debug);
            return _this;
        }
        WarpViewRangeSliderComponent.prototype.ngOnInit = function () {
            this.setOptions();
            this.minValue = this.minValue || this._min;
            this.maxValue = this.maxValue || this._max;
        };
        WarpViewRangeSliderComponent.prototype.ngAfterViewInit = function () {
            this.loaded = false;
            this.setOptions();
        };
        WarpViewRangeSliderComponent.prototype.onChange = function (val) {
            this.change.emit({ value: this.minValue, highValue: this.maxValue });
            this.LOG.debug(['onChange'], val, { value: this.minValue, highValue: this.maxValue });
        };
        WarpViewRangeSliderComponent.prototype.setOptions = function () {
            var _this = this;
            this.LOG.debug(['setOptions'], this._min, this._max);
            if (!this._min && !this._max) {
                return;
            }
            this.loaded = true;
            this.value = Math.max(this.value || Number.MIN_VALUE, this._min);
            this.LOG.debug(['noUiSlider'], this.slider);
            if (this.slider) {
                if (!this._uiSlider) {
                    var opts = {
                        start: [this.minValue, this.maxValue],
                        connect: true,
                        tooltips: [this.getFormat(), this.getFormat()],
                        range: { min: [this._min], max: [this._max] }
                    };
                    if (!!this._step && this._step > 0) {
                        opts.step = Math.floor((this._max - this._min) / this._step);
                    }
                    var uiSlider = noUiSlider.create(this.slider.nativeElement, opts);
                    uiSlider.on('end', function (event) {
                        _this.LOG.debug(['onChange'], event);
                        _this.change.emit({
                            min: parseInt(event[0], 10),
                            max: parseInt(event[1], 10)
                        });
                    });
                }
                else {
                    this.updateSliderOptions();
                }
            }
        };
        return WarpViewRangeSliderComponent;
    }(WarpViewSliderComponent));
    WarpViewRangeSliderComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-range-slider',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"custom-slider\" *ngIf=\"loaded\">\n  <div style=\"display: flex; width: 100%;justify-content: flex-start;\">\n    <div>{{format(_min)}}</div>\n    <div #slider style=\"flex-grow: 4\"></div>\n    <div>{{format(_max)}}</div>\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.noUi-origin{left:100%}.noUi-target{margin:0 20px 40px;max-width:100%}.noUi-connect{background:var(--warp-slider-connect-color);left:0}.noUi-handle{background:var(--warp-slider-handle-bg-color);border:1px solid var(--warp-slider-handle-color);border-radius:3px;box-shadow:var(--warp-slider-handle-shadow);cursor:pointer}.noUi-handle:after,.noUi-handle:before{background:var(--warp-slider-handle-color)}.noUi-tooltip{display:none}.noUi-active .noUi-tooltip{display:block}:host .custom-slider{margin-top:50px}"]
                },] }
    ];
    WarpViewRangeSliderComponent.ctorParameters = function () { return []; };
    WarpViewRangeSliderComponent.propDecorators = {
        slider: [{ type: i0.ViewChild, args: ['slider',] }],
        minValue: [{ type: i0.Input, args: ['minValue',] }],
        maxValue: [{ type: i0.Input, args: ['maxValue',] }]
    };

    var WarpViewSpectrumComponent = /** @class */ (function (_super) {
        __extends(WarpViewSpectrumComponent, _super);
        function WarpViewSpectrumComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.layout = {
                showlegend: false,
                xaxis: {},
                yaxis: {},
                margin: {
                    t: 10,
                    b: 25,
                    r: 10,
                    l: 50
                }
            };
            _this._type = 'histogram2d';
            _this.visibility = [];
            _this.visibilityStatus = 'unknown';
            _this.maxTick = 0;
            _this.minTick = 0;
            _this.visibleGtsId = [];
            _this.LOG = new Logger(WarpViewSpectrumComponent, _this._debug);
            return _this;
        }
        Object.defineProperty(WarpViewSpectrumComponent.prototype, "type", {
            set: function (type) {
                this._type = type;
                this.drawChart();
            },
            enumerable: false,
            configurable: true
        });
        WarpViewSpectrumComponent.prototype.update = function (options) {
            this.drawChart();
        };
        WarpViewSpectrumComponent.prototype.drawChart = function () {
            if (!this.initChart(this.el)) {
                return;
            }
            this.plotlyConfig.scrollZoom = true;
            this.buildGraph();
        };
        WarpViewSpectrumComponent.prototype.convert = function (data) {
            var _this = this;
            var type = this._options.histo || { histnorm: 'density', histfunc: 'count' };
            var dataset = [];
            this.LOG.debug(['convert'], this._options);
            this.visibility = [];
            var gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray([data.data], 0).res) || [];
            this.maxTick = Number.NEGATIVE_INFINITY;
            this.minTick = Number.POSITIVE_INFINITY;
            this.visibleGtsId = [];
            var nonPlottable = gtsList.filter(function (g) {
                _this.LOG.debug(['convert'], GTSLib.isGtsToPlot(g));
                return (g.v && !GTSLib.isGtsToPlot(g));
            });
            gtsList = gtsList.filter(function (g) {
                return (g.v && GTSLib.isGtsToPlot(g));
            });
            // initialize visibility status
            if (this.visibilityStatus === 'unknown') {
                this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
            }
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                this.layout.xaxis.type = 'linear';
            }
            else {
                this.layout.xaxis.type = 'date';
            }
            gtsList.forEach(function (gts, i) {
                if (gts.v && GTSLib.isGtsToPlot(gts)) {
                    var label = GTSLib.serializeGtsMetadata(gts);
                    var c = ColorLib.getColor(i, _this._options.scheme);
                    var color = ((data.params || [])[gts.id] || { datasetColor: c }).datasetColor || c;
                    var series_1 = {
                        type: _this._type,
                        histnorm: type.histnorm || 'density',
                        histfunc: type.histfunc || 'count',
                        contours: {
                            showlabels: true,
                            labelfont: {
                                color: 'white'
                            }
                        },
                        colorbar: {
                            tickcolor: _this.getGridColor(_this.el.nativeElement),
                            thickness: 0,
                            tickfont: {
                                color: _this.getLabelColor(_this.el.nativeElement)
                            },
                            x: 1 + gts.id / 20,
                            xpad: 0
                        },
                        showscale: _this.showLegend,
                        colorscale: ColorLib.getColorGradient(gts.id, _this._options.scheme),
                        autocolorscale: false,
                        name: label,
                        text: label,
                        x: [],
                        y: [],
                        line: { color: color },
                        hoverinfo: 'none',
                        connectgaps: false,
                        visible: _this._hiddenData.filter(function (h) { return h === gts.id; }).length >= 0,
                    };
                    gts.v.forEach(function (value) {
                        var ts = value[0];
                        series_1.y.push(value[value.length - 1]);
                        if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                            series_1.x.push(ts);
                        }
                        else {
                            series_1.x.push(GTSLib.toISOString(ts, _this.divider, _this._options.timeZone));
                        }
                    });
                    dataset.push(series_1);
                }
            });
            this.LOG.debug(['convert', 'dataset'], dataset);
            return dataset;
        };
        WarpViewSpectrumComponent.prototype.buildGraph = function () {
            this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
            this.LOG.debug(['drawChart', 'this.layout'], this.layout);
            this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
            this.layout.showlegend = this.showLegend;
            this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
            this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
            this.loading = false;
        };
        return WarpViewSpectrumComponent;
    }(WarpViewComponent));
    WarpViewSpectrumComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-spectrum',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"wv-tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;display:none;font-size:10px;height:auto!important;left:-1000px;max-width:50%;min-width:100px;padding:10px;pointer-events:none;position:absolute;text-align:left;width:auto;z-index:999}.wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}:host{display:block}:host,:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}:host .executionErrorText{background:#faebd7;border:2px solid red;border-radius:3px;color:red;padding:10px;position:absolute;top:-30px}"]
                },] }
    ];
    WarpViewSpectrumComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewSpectrumComponent.propDecorators = {
        type: [{ type: i0.Input, args: ['type',] }]
    };

    var PlotlyComponent = /** @class */ (function () {
        function PlotlyComponent(iterableDiffers, el, keyValueDiffers) {
            this.iterableDiffers = iterableDiffers;
            this.el = el;
            this.keyValueDiffers = keyValueDiffers;
            this.defaultClassName = 'js-plotly-plot';
            this._debug = false;
            this.revision = 0;
            this.useResizeHandler = false;
            this.updateOnLayoutChange = true;
            this.updateOnDataChange = true;
            this.updateOnlyWithRevision = true;
            this.initialized = new i0.EventEmitter();
            this.update = new i0.EventEmitter();
            this.purge = new i0.EventEmitter();
            this.error = new i0.EventEmitter();
            this.afterExport = new i0.EventEmitter();
            this.afterPlot = new i0.EventEmitter();
            this.animated = new i0.EventEmitter();
            this.animatingFrame = new i0.EventEmitter();
            this.animationInterrupted = new i0.EventEmitter();
            this.autoSize = new i0.EventEmitter();
            this.beforeExport = new i0.EventEmitter();
            this.buttonClicked = new i0.EventEmitter();
            this.click = new i0.EventEmitter();
            this.plotly_click = new i0.EventEmitter();
            this.clickAnnotation = new i0.EventEmitter();
            this.deselect = new i0.EventEmitter();
            this.doubleClick = new i0.EventEmitter();
            this.framework = new i0.EventEmitter();
            this.hover = new i0.EventEmitter();
            this.legendClick = new i0.EventEmitter();
            this.legendDoubleClick = new i0.EventEmitter();
            this.relayout = new i0.EventEmitter();
            this.restyle = new i0.EventEmitter();
            this.redraw = new i0.EventEmitter();
            this.selected = new i0.EventEmitter();
            this.selecting = new i0.EventEmitter();
            this.sliderChange = new i0.EventEmitter();
            this.sliderEnd = new i0.EventEmitter();
            this.sliderStart = new i0.EventEmitter();
            this.transitioning = new i0.EventEmitter();
            this.transitionInterrupted = new i0.EventEmitter();
            this.unhover = new i0.EventEmitter();
            this.relayouting = new i0.EventEmitter();
            this.eventNames = [
                // 'afterExport',
                //   'afterPlot', // 'animated', 'animatingFrame', 'animationInterrupted', 'autoSize',
                // 'beforeExport', 'buttonClicked', 'clickAnnotation', 'deselect', 'doubleClick', 'framework',
                'hover', 'unhover',
                // 'legendClick', 'legendDoubleClick',
                'relayout',
            ];
            this.LOG = new Logger(PlotlyComponent, this.debug);
        }
        Object.defineProperty(PlotlyComponent.prototype, "data", {
            get: function () {
                return this._data;
            },
            /*
             this.LOG.debug(['ngOnChanges'], changes);
                const revision: SimpleChange = changes.revision;
                if (changes.debug) {
                  this.debug = changes.debug.currentValue;
                }
                if (!!changes.data && !deepEqual(changes.data.currentValue, changes.data.previousValue)) {
                  this.updatePlot();
                } else if (!changes.layout && ((revision && !revision.isFirstChange()) || !!changes.data || !!changes.config)) {
                  this.updatePlot();
                }
                if (!!changes.debug) {
                  this.LOG.setDebug(changes.debug.currentValue);
                }
                this.updateWindowResizeHandler();
                this.LOG.debug(['ngOnChanges'], changes);
             */
            set: function (data) {
                this._data = data;
                this.updatePlot();
                this.updateWindowResizeHandler();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PlotlyComponent.prototype, "layout", {
            get: function () {
                return this._layout;
            },
            set: function (layout) {
                this._layout = layout;
                if (!!this._data && !!this.plotEl.nativeElement) {
                    try {
                        Plotlyjs.relayout(this.plotEl.nativeElement, layout);
                        this.updateWindowResizeHandler();
                    }
                    catch (e) {
                        //
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PlotlyComponent.prototype, "config", {
            get: function () {
                return this._config;
            },
            set: function (config) {
                this._config = config;
                this.updatePlot();
                this.updateWindowResizeHandler();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PlotlyComponent.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (debug) {
                this._debug = debug;
            },
            enumerable: false,
            configurable: true
        });
        PlotlyComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.createPlot().then(function () {
                var figure = _this.createFigure();
                _this.LOG.debug(['figure'], figure);
                _this.initialized.emit(_this.plotlyInstance);
            });
        };
        PlotlyComponent.prototype.ngOnDestroy = function () {
            if (typeof this.resizeHandler === 'function') {
                this.getWindow().removeEventListener('resize', this.resizeHandler);
                this.resizeHandler = undefined;
            }
            var figure = this.createFigure();
            this.purge.emit(figure);
            this.remove(this.plotlyInstance);
        };
        PlotlyComponent.prototype.ngDoCheck = function () {
            if (this.updateOnlyWithRevision) {
                return false;
            }
            var shouldUpdate = false;
            if (this.updateOnLayoutChange) {
                if (this.layoutDiffer) {
                    var layoutHasDiff = this.layoutDiffer.diff(this.layout);
                    if (layoutHasDiff) {
                        shouldUpdate = true;
                    }
                }
                else if (this.layout) {
                    this.layoutDiffer = this.keyValueDiffers.find(this.layout).create();
                }
                else {
                    this.layoutDiffer = undefined;
                }
            }
            if (this.updateOnDataChange) {
                if (this.dataDiffer) {
                    var dataHasDiff = this.dataDiffer.diff(this.data);
                    if (dataHasDiff) {
                        shouldUpdate = true;
                    }
                }
                else if (Array.isArray(this.data)) {
                    this.dataDiffer = this.iterableDiffers.find(this.data).create(this.dataDifferTrackBy);
                }
                else {
                    this.dataDiffer = undefined;
                }
            }
            if (shouldUpdate && this.plotlyInstance) {
                this.updatePlot();
            }
        };
        PlotlyComponent.prototype.getWindow = function () {
            return window;
        };
        PlotlyComponent.prototype.getBoundingClientRect = function () {
            return this.rect;
        };
        PlotlyComponent.prototype.getClassName = function () {
            var classes = [this.defaultClassName];
            if (Array.isArray(this.className)) {
                classes = classes.concat(this.className);
            }
            else if (!!this.className) {
                classes.push(this.className);
            }
            return classes.join(' ');
        };
        PlotlyComponent.prototype.restyleChart = function (properties, curves) {
            Plotlyjs.restyle(this.plotlyInstance, properties, curves);
        };
        PlotlyComponent.prototype.createPlot = function () {
            var _this = this;
            this.LOG.debug(['createPlot'], this.data, this.layout, this.config, this.plotlyInstance);
            return Plotlyjs.react(this.plotEl.nativeElement, this.data, this.layout, this.config).then(function (plotlyInstance) {
                _this.rect = _this.el.nativeElement.getBoundingClientRect();
                _this.plotlyInstance = plotlyInstance;
                _this.LOG.debug(['plotlyInstance'], plotlyInstance);
                _this.getWindow().gd = _this.debug ? plotlyInstance : undefined;
                _this.eventNames.forEach(function (name) {
                    var eventName = "plotly_" + name.toLowerCase();
                    // @ts-ignore
                    plotlyInstance.on(eventName, function (data) {
                        _this.LOG.debug(['plotlyEvent', eventName], data);
                        _this[name].emit(data);
                    });
                });
                plotlyInstance.on('plotly_click', function (data) {
                    _this.click.emit(data);
                    _this.plotly_click.emit(data);
                });
                _this.updateWindowResizeHandler();
                _this.afterPlot.emit(plotlyInstance);
            }, function (err) {
                console.error('Error while plotting:', err);
                _this.error.emit(err);
            });
        };
        PlotlyComponent.prototype.createFigure = function () {
            var p = this.plotlyInstance;
            return {
                data: p.data,
                layout: p.layout,
                frames: p._transitionData ? p._transitionData._frames : null
            };
        };
        PlotlyComponent.prototype.updatePlot = function () {
            var _this = this;
            this.LOG.debug(['updatePlot'], this.data, this.layout, Object.assign({}, this.config));
            if (!this.plotlyInstance) {
                var error = new Error("Plotly component wasn't initialized");
                this.error.emit(error);
                return;
            }
            Plotlyjs.purge(this.plotlyInstance);
            this.createPlot().then(function () {
                var figure = _this.createFigure();
                _this.update.emit(figure);
            }, function (err) {
                console.error('Error while updating plot:', err);
                _this.error.emit(err);
            });
        };
        PlotlyComponent.prototype.updateWindowResizeHandler = function () {
            var _this = this;
            if (this.useResizeHandler) {
                if (this.resizeHandler === undefined) {
                    this.resizeHandler = function () { return setTimeout(function () { return Plotlyjs.Plots.resize(_this.plotlyInstance); }); };
                    this.getWindow().addEventListener('resize', this.resizeHandler);
                }
            }
            else {
                if (typeof this.resizeHandler === 'function') {
                    this.getWindow().removeEventListener('resize', this.resizeHandler);
                    this.resizeHandler = undefined;
                }
            }
        };
        PlotlyComponent.prototype.dataDifferTrackBy = function (_, item) {
            var obj = Object.assign({}, item, { uid: '' });
            return JSON.stringify(obj);
        };
        PlotlyComponent.prototype.remove = function (div) {
            Plotlyjs.purge(div);
            delete this.plotlyInstance;
        };
        PlotlyComponent.prototype.resize = function (layout) {
            Plotlyjs.relayout(this.plotEl.nativeElement, layout);
        };
        return PlotlyComponent;
    }());
    PlotlyComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-plotly',
                    template: "<div #plot [attr.id]=\"divId\" [className]=\"getClassName()\" [ngStyle]=\"style\"></div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}.js-plotly-plot .plotly,.js-plotly-plot .plotly div{direction:ltr;font-family:Open Sans,verdana,arial,sans-serif;margin:0;padding:0}.js-plotly-plot .plotly button,.js-plotly-plot .plotly input{font-family:Open Sans,verdana,arial,sans-serif}.js-plotly-plot .plotly button:focus,.js-plotly-plot .plotly input:focus{outline:none}.js-plotly-plot .plotly a,.js-plotly-plot .plotly a:hover{text-decoration:none}.js-plotly-plot .plotly .crisp{shape-rendering:crispEdges}.js-plotly-plot .plotly .user-select-none{-moz-user-select:none;-ms-user-select:none;-o-user-select:none;-webkit-user-select:none;user-select:none}.js-plotly-plot .plotly svg{overflow:hidden}.js-plotly-plot .plotly svg a{fill:#447adb}.js-plotly-plot .plotly svg a:hover{fill:#3c6dc5}.js-plotly-plot .plotly .main-svg{left:0;pointer-events:none;position:absolute;top:0}.js-plotly-plot .plotly .main-svg .draglayer{pointer-events:all}.js-plotly-plot .plotly .cursor-default{cursor:default}.js-plotly-plot .plotly .cursor-pointer{cursor:pointer}.js-plotly-plot .plotly .cursor-crosshair{cursor:crosshair}.js-plotly-plot .plotly .cursor-move{cursor:move}.js-plotly-plot .plotly .cursor-col-resize{cursor:col-resize}.js-plotly-plot .plotly .cursor-row-resize{cursor:row-resize}.js-plotly-plot .plotly .cursor-ns-resize{cursor:ns-resize}.js-plotly-plot .plotly .cursor-ew-resize{cursor:ew-resize}.js-plotly-plot .plotly .cursor-sw-resize{cursor:sw-resize}.js-plotly-plot .plotly .cursor-s-resize{cursor:s-resize}.js-plotly-plot .plotly .cursor-se-resize{cursor:se-resize}.js-plotly-plot .plotly .cursor-w-resize{cursor:w-resize}.js-plotly-plot .plotly .cursor-e-resize{cursor:e-resize}.js-plotly-plot .plotly .cursor-nw-resize{cursor:nw-resize}.js-plotly-plot .plotly .cursor-n-resize{cursor:n-resize}.js-plotly-plot .plotly .cursor-ne-resize{cursor:ne-resize}.js-plotly-plot .plotly .cursor-grab{cursor:-webkit-grab;cursor:grab}.js-plotly-plot .plotly .modebar{position:absolute;right:2px;top:2px}.js-plotly-plot .plotly .ease-bg{transition:background-color .3s ease 0s}.js-plotly-plot .plotly .modebar--hover>:not(.watermark){opacity:0;transition:opacity .3s ease 0s}.js-plotly-plot .plotly:hover .modebar--hover .modebar-group{opacity:1}.js-plotly-plot .plotly .modebar-group{box-sizing:border-box;display:inline-block;float:left;padding-left:8px;position:relative;vertical-align:middle;white-space:nowrap}.js-plotly-plot .plotly .modebar-btn{box-sizing:border-box;cursor:pointer;font-size:16px;height:22px;line-height:normal;padding:3px 4px;position:relative}.js-plotly-plot .plotly .modebar-btn svg{position:relative;top:2px}.js-plotly-plot .plotly .modebar.vertical{align-content:flex-end;display:flex;flex-direction:column;flex-wrap:wrap;max-height:100%}.js-plotly-plot .plotly .modebar.vertical svg{top:-1px}.js-plotly-plot .plotly .modebar.vertical .modebar-group{display:block;float:none;padding-bottom:8px;padding-left:0}.js-plotly-plot .plotly .modebar.vertical .modebar-group .modebar-btn{display:block;text-align:center}.js-plotly-plot .plotly [data-title]:after,.js-plotly-plot .plotly [data-title]:before{display:none;opacity:0;pointer-events:none;position:absolute;right:50%;top:110%;transform:translateZ(0);z-index:1001}.js-plotly-plot .plotly [data-title]:hover:after,.js-plotly-plot .plotly [data-title]:hover:before{display:block;opacity:1}.js-plotly-plot .plotly [data-title]:before{background:transparent;border:6px solid transparent;border-bottom-color:#69738a;content:\"\";margin-right:-6px;margin-top:-12px;position:absolute;z-index:1002}.js-plotly-plot .plotly [data-title]:after{background:#69738a;border-radius:2px;color:#fff;content:attr(data-title);font-size:12px;line-height:12px;margin-right:-18px;padding:8px 10px;white-space:nowrap}.js-plotly-plot .plotly .vertical [data-title]:after,.js-plotly-plot .plotly .vertical [data-title]:before{right:200%;top:0}.js-plotly-plot .plotly .vertical [data-title]:before{border:6px solid transparent;border-left-color:#69738a;margin-right:-30px;margin-top:8px}.js-plotly-plot .plotly .select-outline{fill:none;shape-rendering:crispEdges;stroke-width:1}.js-plotly-plot .plotly .select-outline-1{stroke:#fff}.js-plotly-plot .plotly .select-outline-2{stroke:#000;stroke-dasharray:2px 2px}.plotly-notifier{font-family:Open Sans,verdana,arial,sans-serif;font-size:10pt;max-width:180px;position:fixed;right:20px;top:50px;z-index:10000}.plotly-notifier p{margin:0}.plotly-notifier .notifier-note{-ms-hyphens:auto;-webkit-hyphens:auto;background-color:#8c97af;background-color:rgba(140,151,175,.9);border:1px solid #fff;color:#fff;hyphens:auto;margin:0;max-width:250px;min-width:180px;overflow-wrap:break-word;padding:10px;word-wrap:break-word;z-index:3000}.plotly-notifier .notifier-close{background:none;border:none;color:#fff;float:right;font-size:20px;font-weight:700;line-height:20px;opacity:.8;padding:0 5px}.plotly-notifier .notifier-close:hover{color:#444;cursor:pointer;text-decoration:none}:host{height:100%;width:100%}:host .ylines-above{stroke:var(--warp-view-chart-grid-color)!important}:host .modebar-btn path,:host .xtick>text,:host .ytick>text{fill:var(--warp-view-font-color)!important}"]
                },] }
    ];
    PlotlyComponent.ctorParameters = function () { return [
        { type: i0.IterableDiffers },
        { type: i0.ElementRef },
        { type: i0.KeyValueDiffers }
    ]; };
    PlotlyComponent.propDecorators = {
        plotEl: [{ type: i0.ViewChild, args: ['plot', { static: true },] }],
        data: [{ type: i0.Input }],
        layout: [{ type: i0.Input }],
        config: [{ type: i0.Input }],
        debug: [{ type: i0.Input }],
        frames: [{ type: i0.Input }],
        style: [{ type: i0.Input }],
        divId: [{ type: i0.Input }],
        revision: [{ type: i0.Input }],
        className: [{ type: i0.Input }],
        useResizeHandler: [{ type: i0.Input }],
        updateOnLayoutChange: [{ type: i0.Input }],
        updateOnDataChange: [{ type: i0.Input }],
        updateOnlyWithRevision: [{ type: i0.Input }],
        initialized: [{ type: i0.Output }],
        update: [{ type: i0.Output }],
        purge: [{ type: i0.Output }],
        error: [{ type: i0.Output }],
        afterExport: [{ type: i0.Output }],
        afterPlot: [{ type: i0.Output }],
        animated: [{ type: i0.Output }],
        animatingFrame: [{ type: i0.Output }],
        animationInterrupted: [{ type: i0.Output }],
        autoSize: [{ type: i0.Output }],
        beforeExport: [{ type: i0.Output }],
        buttonClicked: [{ type: i0.Output }],
        click: [{ type: i0.Output }],
        plotly_click: [{ type: i0.Output }],
        clickAnnotation: [{ type: i0.Output }],
        deselect: [{ type: i0.Output }],
        doubleClick: [{ type: i0.Output }],
        framework: [{ type: i0.Output }],
        hover: [{ type: i0.Output }],
        legendClick: [{ type: i0.Output }],
        legendDoubleClick: [{ type: i0.Output }],
        relayout: [{ type: i0.Output }],
        restyle: [{ type: i0.Output }],
        redraw: [{ type: i0.Output }],
        selected: [{ type: i0.Output }],
        selecting: [{ type: i0.Output }],
        sliderChange: [{ type: i0.Output }],
        sliderEnd: [{ type: i0.Output }],
        sliderStart: [{ type: i0.Output }],
        transitioning: [{ type: i0.Output }],
        transitionInterrupted: [{ type: i0.Output }],
        unhover: [{ type: i0.Output }],
        relayouting: [{ type: i0.Output }]
    };

    var WarpViewBoxComponent = /** @class */ (function (_super) {
        __extends(WarpViewBoxComponent, _super);
        function WarpViewBoxComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.layout = {
                showlegend: false,
                xaxis: {
                    type: '-'
                },
                yaxis: { zeroline: false },
                boxmode: 'group',
                margin: {
                    t: 10,
                    b: 25,
                    r: 10,
                    l: 10
                }
            };
            _this._type = 'box';
            _this.LOG = new Logger(WarpViewBoxComponent, _this._debug);
            return _this;
        }
        Object.defineProperty(WarpViewBoxComponent.prototype, "type", {
            set: function (type) {
                this._type = type;
                this.drawChart();
            },
            enumerable: false,
            configurable: true
        });
        WarpViewBoxComponent.prototype.ngOnInit = function () {
            this.drawChart();
        };
        WarpViewBoxComponent.prototype.update = function (options) {
            this.drawChart();
        };
        WarpViewBoxComponent.prototype.drawChart = function () {
            if (!this.initChart(this.el)) {
                return;
            }
            this.plotlyConfig.scrollZoom = true;
            this.buildGraph();
        };
        WarpViewBoxComponent.prototype.convert = function (data) {
            var _this = this;
            var dataset = [];
            this.LOG.debug(['convert'], this._options, this._type);
            var gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data, 0).res);
            gtsList = gtsList.filter(function (g) {
                return (g.v && GTSLib.isGtsToPlot(g));
            });
            var pattern = 'YYYY/MM/DD hh:mm:ss';
            var format = pattern.slice(0, pattern.lastIndexOf(this._options.split || 'D') + 1);
            gtsList.forEach(function (gts, i) {
                if (gts.v) {
                    var label = GTSLib.serializeGtsMetadata(gts);
                    var c = ColorLib.getColor(gts.id, _this._options.scheme);
                    var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                    var series_1 = {
                        type: 'box',
                        boxmean: 'sd',
                        marker: { color: color },
                        name: label,
                        x: _this._type === 'box' ? undefined : [],
                        y: [],
                        //  hoverinfo: 'none',
                        boxpoints: false
                    };
                    if (!!_this._options.showDots) {
                        series_1.boxpoints = 'all';
                    }
                    gts.v.forEach(function (value) {
                        series_1.y.push(value[value.length - 1]);
                        if (_this._type === 'box-date') {
                            series_1.x.push(GTSLib.toISOString(value[0], _this.divider, _this._options.timeZone));
                        }
                    });
                    dataset.push(series_1);
                }
            });
            this.LOG.debug(['convert', 'dataset'], dataset, format);
            return dataset;
        };
        WarpViewBoxComponent.prototype.buildGraph = function () {
            this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
            this.LOG.debug(['drawChart', 'this.layout'], this.layout);
            this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
            this.layout.showlegend = this.showLegend;
            this.layout.xaxis.showticklabels = this._type === 'box-date';
            this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
            this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
            this.loading = false;
        };
        WarpViewBoxComponent.prototype.hover = function (data) {
        };
        return WarpViewBoxComponent;
    }(WarpViewComponent));
    WarpViewBoxComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-box',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"wv-tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;display:none;font-size:10px;height:auto!important;left:-1000px;max-width:50%;min-width:100px;padding:10px;pointer-events:none;position:absolute;text-align:left;width:auto;z-index:999}.wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}:host{display:block}:host,:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}"]
                },] }
    ];
    WarpViewBoxComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewBoxComponent.propDecorators = {
        type: [{ type: i0.Input, args: ['type',] }]
    };

    var WarpView3dLineComponent = /** @class */ (function (_super) {
        __extends(WarpView3dLineComponent, _super);
        function WarpView3dLineComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.layout = {
                showlegend: false,
                xaxis: {},
                yaxis: {},
                zaxis: {},
                margin: {
                    t: 10,
                    b: 25,
                    r: 10,
                    l: 10
                }
            };
            _this._type = 'line3d';
            _this.LOG = new Logger(WarpView3dLineComponent, _this._debug);
            return _this;
        }
        Object.defineProperty(WarpView3dLineComponent.prototype, "type", {
            set: function (type) {
                this._type = type;
                this.drawChart();
            },
            enumerable: false,
            configurable: true
        });
        WarpView3dLineComponent.prototype.ngOnInit = function () {
            this.drawChart();
        };
        WarpView3dLineComponent.prototype.update = function (options) {
            this.drawChart();
        };
        WarpView3dLineComponent.prototype.drawChart = function () {
            if (!this.initChart(this.el)) {
                return;
            }
            this.plotlyConfig.scrollZoom = true;
            this.buildGraph();
        };
        WarpView3dLineComponent.prototype.convert = function (data) {
            var _this = this;
            var dataset = [];
            this.LOG.debug(['convert'], data, this._options, this._type);
            GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data, 0).res)
                .filter(function (g) { return (g.v && GTSLib.isGts(g)); })
                .forEach(function (gts, i) {
                if (gts.v) {
                    var label = GTSLib.serializeGtsMetadata(gts);
                    var c = ColorLib.getColor(gts.id, _this._options.scheme);
                    var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                    var series_1 = {
                        mode: 'line',
                        type: 'scatter3d',
                        marker: {
                            color: ColorLib.transparentize(color),
                            size: 3,
                            symbol: 'circle',
                            line: {
                                color: color,
                                width: 0
                            }
                        },
                        line: {
                            color: color,
                            width: 1
                        },
                        name: label,
                        x: [],
                        y: [],
                        z: [],
                    };
                    gts.v.forEach(function (value) {
                        if (value.length > 2) { // lat lon
                            series_1.x.push(value[1]);
                            series_1.y.push(value[2]);
                            series_1.z.push(value[3]);
                        }
                        else { // time value
                            series_1.x.push(value[0]);
                            series_1.y.push(value[1]);
                            series_1.z.push(1);
                        }
                    });
                    dataset.push(series_1);
                }
            });
            return dataset;
        };
        WarpView3dLineComponent.prototype.buildGraph = function () {
            this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
            this.LOG.debug(['drawChart', 'this.layout'], this.layout);
            this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
            this.layout.showlegend = this.showLegend;
            this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
            this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
            this.layout.zaxis.color = this.getGridColor(this.el.nativeElement);
            this.loading = false;
        };
        return WarpView3dLineComponent;
    }(WarpViewComponent));
    WarpView3dLineComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-3d-line',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"wv-tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;display:none;font-size:10px;height:auto!important;left:-1000px;max-width:50%;min-width:100px;padding:10px;pointer-events:none;position:absolute;text-align:left;width:auto;z-index:999}.wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}:host{display:block}:host,:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}"]
                },] }
    ];
    WarpView3dLineComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpView3dLineComponent.propDecorators = {
        type: [{ type: i0.Input, args: ['type',] }]
    };

    var WarpViewGlobeComponent = /** @class */ (function (_super) {
        __extends(WarpViewGlobeComponent, _super);
        function WarpViewGlobeComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.layout = {
                showlegend: false,
                margin: {
                    t: 10,
                    b: 25,
                    r: 10,
                    l: 10
                },
                geo: {
                    projection: {
                        type: 'orthographic',
                    },
                    showframe: true,
                    fitbounds: 'locations',
                    showocean: true,
                    oceancolor: ColorLib.transparentize('#004eff', 0.2),
                    showland: true,
                    landcolor: ColorLib.transparentize('#6F694E', 0.2),
                    showlakes: true,
                    lakecolor: ColorLib.transparentize('#004eff', 0.2),
                    showcountries: true,
                    lonaxis: {
                        showgrid: true,
                        gridcolor: 'rgb(102, 102, 102)'
                    },
                    lataxis: {
                        showgrid: true,
                        gridcolor: 'rgb(102, 102, 102)'
                    }
                }
            };
            _this._type = 'scattergeo';
            _this.geoData = [];
            _this.LOG = new Logger(WarpViewGlobeComponent, _this._debug);
            return _this;
        }
        Object.defineProperty(WarpViewGlobeComponent.prototype, "type", {
            set: function (type) {
                this._type = type;
                this.drawChart();
            },
            enumerable: false,
            configurable: true
        });
        WarpViewGlobeComponent.prototype.ngOnInit = function () {
            this.drawChart();
        };
        WarpViewGlobeComponent.prototype.update = function (options) {
            this.drawChart();
        };
        WarpViewGlobeComponent.prototype.drawChart = function () {
            if (!this.initChart(this.el)) {
                return;
            }
            this.plotlyConfig.scrollZoom = true;
            this.buildGraph();
        };
        WarpViewGlobeComponent.prototype.convert = function (data) {
            var _this = this;
            var dataset = [];
            this.geoData = [];
            this.LOG.debug(['convert'], data, this._options, this._type);
            GTSLib.flatDeep(GTSLib.flattenGtsIdArray(data.data, 0).res)
                .filter(function (g) { return (g.v && GTSLib.isGts(g)); })
                .forEach(function (gts, i) {
                if (gts.v) {
                    var geoData_1 = { path: [] };
                    var label = GTSLib.serializeGtsMetadata(gts);
                    var c = ColorLib.getColor(gts.id, _this._options.scheme);
                    var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                    var series_1 = {
                        mode: 'lines',
                        type: 'scattergeo',
                        marker: {
                            color: ColorLib.transparentize(color),
                            size: 3,
                            symbol: 'circle',
                            line: {
                                color: color,
                                width: 0
                            }
                        },
                        line: {
                            color: color,
                            width: 1
                        },
                        name: label,
                        lon: [],
                        lat: [],
                        hoverinfo: 'none',
                    };
                    gts.v.forEach(function (value) {
                        if (value.length > 2) {
                            series_1.lat.push(value[1]);
                            series_1.lon.push(value[2]);
                            geoData_1.path.push({ lat: value[1], lon: value[2] });
                        }
                    });
                    _this.geoData.push(geoData_1);
                    dataset.push(series_1);
                }
            });
            return dataset;
        };
        WarpViewGlobeComponent.prototype.buildGraph = function () {
            this.LOG.debug(['drawChart', 'this.layout'], this._responsive);
            this.LOG.debug(['drawChart', 'this.layout'], this.layout);
            this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
            this.layout.showlegend = this._showLegend;
            var bounds = MapLib.getBoundsArray(this.geoData, [], [], []);
            this.LOG.debug(['drawChart', 'bounds'], bounds);
            this.layout.geo.lonaxis.color = this.getGridColor(this.el.nativeElement);
            this.layout.geo.lataxis.range = [bounds[0][0], bounds[1][0]];
            this.layout.geo.lonaxis.range = [bounds[0][1], bounds[1][1]];
            this.layout.geo.lataxis.color = this.getGridColor(this.el.nativeElement);
            this.layout = Object.assign({}, this.layout);
            this.loading = false;
        };
        return WarpViewGlobeComponent;
    }(WarpViewComponent));
    WarpViewGlobeComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-globe',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"wv-tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;display:none;font-size:10px;height:auto!important;left:-1000px;max-width:50%;min-width:100px;padding:10px;pointer-events:none;position:absolute;text-align:left;width:auto;z-index:999}.wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}:host{display:block}:host,:host #chartContainer,:host #chartContainer div{height:100%}:host div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}"]
                },] }
    ];
    WarpViewGlobeComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewGlobeComponent.propDecorators = {
        type: [{ type: i0.Input, args: ['type',] }]
    };

    var WarpViewEventDropComponent = /** @class */ (function (_super) {
        __extends(WarpViewEventDropComponent, _super);
        function WarpViewEventDropComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.pointHover = new i0.EventEmitter();
            _this.warpViewChartResize = new i0.EventEmitter();
            _this.chartDraw = new i0.EventEmitter();
            _this.boundsDidChange = new i0.EventEmitter();
            _this.visibility = [];
            _this.maxTick = Number.MIN_VALUE;
            _this.minTick = Number.MAX_VALUE;
            _this.visibleGtsId = [];
            _this._type = 'drops';
            _this.eventConf = {
                d3: d3__namespace,
                axis: {
                    verticalGrid: true,
                    tickPadding: 6,
                },
                indicator: false,
                label: {
                    text: function (row) { return row.name; },
                },
                drop: {
                    date: function (d) { return new Date(d.date); },
                    color: function (d) { return d.color; },
                    onMouseOver: function (g) {
                        _this.LOG.debug(['onMouseOver'], g);
                        _this.pointHover.emit({
                            x: d3.event.offsetX,
                            y: d3.event.offsetY
                        });
                        var t = d3.select(_this.toolTip.nativeElement);
                        t.transition()
                            .duration(200)
                            .style('opacity', 1)
                            .style('pointer-events', 'auto');
                        t.html("<div class=\"tooltip-body\">\n<b class=\"tooltip-date\">" + (_this._options.timeMode === 'timestamp'
                            ? g.date
                            : (moment__default['default'](g.date.valueOf()).utc().toISOString() || '')) + "</b>\n<div><i class=\"chip\"  style=\"background-color: " + ColorLib.transparentize(g.color, 0.7) + ";border: 2px solid " + g.color + ";\"></i>\n" + GTSLib.formatLabel(g.name) + ": <span class=\"value\">" + g.value + "</span>\n</div></div>")
                            .style('left', d3.event.offsetX - 30 + "px")
                            .style('top', d3.event.offsetY + 20 + "px");
                    },
                    onMouseOut: function () {
                        d3Selection.select(_this.toolTip.nativeElement)
                            .transition()
                            .duration(500)
                            .style('opacity', 0)
                            .style('pointer-events', 'none');
                    },
                },
            };
            _this.LOG = new Logger(WarpViewEventDropComponent, _this._debug);
            return _this;
        }
        Object.defineProperty(WarpViewEventDropComponent.prototype, "type", {
            set: function (type) {
                this._type = type;
                this.drawChart();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WarpViewEventDropComponent.prototype, "hiddenData", {
            set: function (hiddenData) {
                var _this = this;
                var previousVisibility = JSON.stringify(this.visibility);
                this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
                this._hiddenData = hiddenData;
                this.visibility = [];
                this.visibleGtsId.forEach(function (id) { return _this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1)); });
                this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
                var newVisibility = JSON.stringify(this.visibility);
                this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility);
                if (previousVisibility !== newVisibility) {
                    this.drawChart();
                    this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
                }
            },
            enumerable: false,
            configurable: true
        });
        WarpViewEventDropComponent.prototype.ngOnInit = function () {
            this._options = this._options || this.defOptions;
        };
        WarpViewEventDropComponent.prototype.ngOnDestroy = function () {
            if (!!this.elemChart) {
                d3Selection.select(this.elemChart.nativeElement).remove();
            }
        };
        WarpViewEventDropComponent.prototype.update = function (options, refresh) {
            this.LOG.debug(['onOptions', 'before'], this._options, options);
            if (!deepEqual__default['default'](options, this._options)) {
                this.LOG.debug(['options', 'changed'], options);
                this._options = ChartLib.mergeDeep(this._options, options);
            }
            this.drawChart();
        };
        WarpViewEventDropComponent.prototype.updateBounds = function (min, max) {
            this.LOG.debug(['updateBounds'], min, max, this._options);
            this._options.bounds.minDate = min;
            this._options.bounds.maxDate = max;
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                this.eventConf['range'] = { start: min, end: max };
            }
            else {
                this.eventConf['range'] = {
                    start: moment__default['default'].tz(moment__default['default'].utc(this.minTick / this.divider), this._options.timeZone).toDate(),
                    end: moment__default['default'].tz(moment__default['default'].utc(this.maxTick / this.divider), this._options.timeZone).toDate(),
                };
            }
            this.eventConf = Object.assign({}, this.eventConf);
            this.LOG.debug(['updateBounds'], this.eventConf);
        };
        WarpViewEventDropComponent.prototype.drawChart = function () {
            var _this = this;
            if (!this.initChart(this.el)) {
                return;
            }
            this.loading = false;
            this.LOG.debug(['drawChart', 'plotlyData'], this.plotlyData, this._type);
            if (this.elemChart.nativeElement) {
                setTimeout(function () { return d3Selection.select(_this.elemChart.nativeElement).data([_this.plotlyData]).call(eventDrops__default['default'](_this.eventConf)); });
                this.loading = false;
                this.chartDraw.emit();
            }
        };
        WarpViewEventDropComponent.prototype.convert = function (data) {
            var _this = this;
            this.LOG.debug(['convert'], data);
            var labelsSize = 0;
            var gtsList = GTSLib.flatDeep(data.data);
            var dataList = [];
            this.LOG.debug(['convert', 'gtsList'], gtsList);
            if (!gtsList || gtsList.length === 0 || gtsList[0].length < 2) {
                return;
            }
            gtsList.forEach(function (gts, i) {
                var c = ColorLib.getColor(gts.id || i, _this._options.scheme);
                var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                var gtsName = GTSLib.serializeGtsMetadata(gts);
                labelsSize = Math.max(gtsName.length * 8);
                var dataSet = { name: gtsName, color: color, data: [] };
                var size = (gts.v || []).length;
                for (var v = 0; v < size; v++) {
                    var point = (gts.v || [])[v];
                    var ts = point[0];
                    _this.minTick = Math.min(_this.minTick, ts);
                    _this.maxTick = Math.max(_this.maxTick, ts);
                    var value = point[point.length - 1];
                    if (isNaN(value)) {
                        value = 1;
                    }
                    dataSet.data.push({
                        date: moment__default['default'].tz(moment__default['default'].utc(ts / _this.divider), _this._options.timeZone).toDate(),
                        color: color,
                        value: value,
                        name: dataSet.name
                    });
                }
                dataList.push(dataSet);
            });
            this.LOG.debug(['convert', 'dataList'], dataList);
            this.eventConf.label['width'] = labelsSize;
            this.eventConf['range'] = {
                start: moment__default['default'].tz(moment__default['default'].utc(this.minTick / this.divider), this._options.timeZone).toDate(),
                end: moment__default['default'].tz(moment__default['default'].utc(this.maxTick / this.divider), this._options.timeZone).toDate(),
            };
            return dataList;
        };
        return WarpViewEventDropComponent;
    }(WarpViewComponent));
    WarpViewEventDropComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-event-drop',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <div #toolTip class=\"wv-tooltip trimmed\"></div>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div #elemChart style=\"width: 100%;height: 100%\"></div>\n  <div *ngIf=\"!loading && !noData\">\n  </div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.None,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */@import url(/home/xavier/workspace/warp-view/node_modules/event-drops/dist/style.css);:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host,warp-view-event-drop,warpview-event-drop{display:block;height:100%;width:100%}:host g.bound text,:host text.line-label,warp-view-event-drop g.bound text,warp-view-event-drop text.line-label,warpview-event-drop g.bound text,warpview-event-drop text.line-label{fill:var(--warp-view-font-color)!important}:host #chartContainer,warp-view-event-drop #chartContainer,warpview-event-drop #chartContainer{height:100%;position:relative;width:100%}:host div.chart,warp-view-event-drop div.chart,warpview-event-drop div.chart{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}:host .wv-tooltip,warp-view-event-drop .wv-tooltip,warpview-event-drop .wv-tooltip{background-color:var(--warp-view-chart-legend-bg)!important;border:1px solid grey;border-radius:5px;box-shadow:none;color:var(--warp-view-chart-legend-color)!important;font-size:10px;height:auto!important;line-height:1.4rem;min-width:100px;opacity:0;padding:10px;pointer-events:none;position:absolute;width:auto;z-index:999}:host .wv-tooltip .chip,warp-view-event-drop .wv-tooltip .chip,warpview-event-drop .wv-tooltip .chip{background-color:#bbb;border:2px solid #454545;border-radius:50%;cursor:pointer;display:inline-block;height:5px;margin-bottom:auto;margin-top:auto;vertical-align:middle;width:5px}"]
                },] }
    ];
    WarpViewEventDropComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewEventDropComponent.propDecorators = {
        elemChart: [{ type: i0.ViewChild, args: ['elemChart', { static: true },] }],
        type: [{ type: i0.Input, args: ['type',] }],
        hiddenData: [{ type: i0.Input, args: ['hiddenData',] }],
        pointHover: [{ type: i0.Output, args: ['pointHover',] }],
        warpViewChartResize: [{ type: i0.Output, args: ['warpViewChartResize',] }],
        chartDraw: [{ type: i0.Output, args: ['chartDraw',] }],
        boundsDidChange: [{ type: i0.Output, args: ['boundsDidChange',] }]
    };

    var WarpViewResultTileComponent = /** @class */ (function (_super) {
        __extends(WarpViewResultTileComponent, _super);
        function WarpViewResultTileComponent(el, renderer, sizeService, ngZone) {
            var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
            _this.el = el;
            _this.renderer = renderer;
            _this.sizeService = sizeService;
            _this.ngZone = ngZone;
            _this.standalone = true;
            _this.pointHover = new i0.EventEmitter();
            _this.warpViewChartResize = new i0.EventEmitter();
            _this.chartDraw = new i0.EventEmitter();
            _this.boundsDidChange = new i0.EventEmitter();
            _this.warpViewNewOptions = new i0.EventEmitter();
            _this.loading = true;
            _this.graphs = {
                spectrum: ['histogram2dcontour', 'histogram2d'],
                chart: ['line', 'spline', 'step', 'step-after', 'step-before', 'area', 'scatter'],
                pie: ['pie', 'donut'],
                polar: ['polar'],
                radar: ['radar'],
                bar: ['bar'],
                bubble: ['bubble'],
                annotation: ['annotation'],
                'gts-tree': ['gts-tree'],
                datagrid: ['datagrid'],
                display: ['display'],
                drilldown: ['drilldown'],
                image: ['image'],
                map: ['map'],
                gauge: ['gauge', 'bullet'],
                plot: ['plot'],
                box: ['box', 'box-date'],
                line3d: ['line3d'],
                globe: ['globe'],
                drops: ['drops']
            };
            _this.isRefresh = false;
            _this.LOG = new Logger(WarpViewResultTileComponent, _this._debug);
            return _this;
        }
        Object.defineProperty(WarpViewResultTileComponent.prototype, "type", {
            get: function () {
                if (this.dataModel && this.dataModel.globalParams) {
                    return this.dataModel.globalParams.type || this._options.type || this._type || 'plot';
                }
                else {
                    return this._type || 'plot';
                }
            },
            set: function (type) {
                this._type = type;
            },
            enumerable: false,
            configurable: true
        });
        WarpViewResultTileComponent.prototype.update = function (options, refresh) {
            var _this = this;
            setTimeout(function () { return _this.loading = !refresh; });
            this.LOG.debug(['parseGTS', 'data'], this._data);
            this.dataModel = this._data;
            if (!!this.dataModel) {
                this._options = ChartLib.mergeDeep(this._options, options);
                this._options = ChartLib.mergeDeep(ChartLib.mergeDeep(this.defOptions, options), this._data ? this._data.globalParams || {} : {});
                this.LOG.debug(['parseGTS', 'data'], this._data);
                this.dataModel = this._data;
                if (this._options) {
                    this._unit = this._options.unit || this._unit;
                    this._type = this._options.type || this._type || 'plot';
                }
                this.LOG.debug(['parseGTS', '_type'], this._type);
                setTimeout(function () { return _this.loading = false; });
            }
        };
        WarpViewResultTileComponent.prototype.convert = function (data) {
            var _this = this;
            setTimeout(function () { return _this.loading = !_this.isRefresh; });
            this.LOG.debug(['convert', 'data'], this._data, data);
            this.dataModel = data;
            if (this.dataModel.globalParams) {
                this._unit = this.dataModel.globalParams.unit || this._unit;
                this._type = this.dataModel.globalParams.type || this._type || 'plot';
            }
            this.LOG.debug(['convert', '_type'], this._type);
            return [];
        };
        WarpViewResultTileComponent.prototype.onResized = function (event) {
            this.width = event.newWidth;
            this.height = event.newHeight;
            this.LOG.debug(['onResized'], event.newWidth, event.newHeight);
            this.sizeService.change(new Size(this.width, this.height));
        };
        WarpViewResultTileComponent.prototype.chartDrawn = function () {
            var _this = this;
            this.LOG.debug(['chartDrawn']);
            setTimeout(function () { return _this.loading = false; });
            this.chartDraw.emit();
        };
        WarpViewResultTileComponent.prototype.setResult = function (data, isRefresh) {
            this.isRefresh = isRefresh;
            if (data) {
                this._data = GTSLib.getData(data);
                this._options.isRefresh = isRefresh;
                this.update(this._options, isRefresh);
                this.LOG.debug(['onData'], this._data);
            }
        };
        WarpViewResultTileComponent.prototype.onWarpViewNewOptions = function (opts) {
            this.warpViewNewOptions.emit(opts);
        };
        return WarpViewResultTileComponent;
    }(WarpViewComponent));
    WarpViewResultTileComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'warpview-result-tile',
                    template: "<div class=\"wrapper\" [ngClass]=\"{'full':  responsive}\" (resized)=\"onResized($event)\">\n    <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n    <div style=\"height: 100%; width: 100%\" [hidden]=\"loading\">\n      <warpview-spectrum [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                         [showLegend]=\"showLegend\" [data]=\"dataModel\" (chartDraw)=\"chartDrawn()\"\n                         *ngIf=\"graphs['spectrum'].indexOf(type) > -1 && !!dataModel\"\n                         [responsive]=\"true\"></warpview-spectrum>\n\n      <warpview-chart [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['chart'].indexOf(type) > -1 && !!dataModel\"\n                      [responsive]=\"true\"></warpview-chart>\n\n      <warpview-plot [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                     (chartDraw)=\"chartDrawn()\"\n                     [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                     (warpViewNewOptions)=\"onWarpViewNewOptions($event)\"\n                     *ngIf=\"graphs['plot'].indexOf(type) > -1 && !!dataModel\"\n                     [responsive]=\"true\"></warpview-plot>\n\n      <warpview-bar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                    *ngIf=\"graphs['bar'].indexOf(type) > -1 && !!dataModel\"\n                    [responsive]=\"true\"></warpview-bar>\n\n      <warpview-bubble [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                       (chartDraw)=\"chartDrawn()\"\n                       [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                       *ngIf=\"graphs['bubble'].indexOf(type) > -1 && !!dataModel\"\n                       [responsive]=\"true\"></warpview-bubble>\n\n      <warpview-datagrid [debug]=\"debug\" [options]=\"_options\"\n                         (chartDraw)=\"chartDrawn()\"\n                         [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                         *ngIf=\"graphs['datagrid'].indexOf(type) > -1 && !!dataModel\"\n                         [responsive]=\"true\"></warpview-datagrid>\n\n      <warpview-display [debug]=\"debug\" [options]=\"_options\"\n                        (chartDraw)=\"chartDrawn()\"\n                        [showLegend]=\"showLegend\" [data]=\"dataModel\" [unit]=\"unit\"\n                        *ngIf=\"graphs['display'].indexOf(type) > -1 && !!dataModel\"\n                        [responsive]=\"true\"></warpview-display>\n\n      <warpview-drill-down [debug]=\"debug\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\" [unit]=\"unit\"\n                           *ngIf=\"graphs['drilldown'].indexOf(type) > -1 && !!dataModel\"\n                           [responsive]=\"true\"></warpview-drill-down>\n\n      <warpview-gts-tree *ngIf=\"graphs['gts-tree'].indexOf(type) > -1 && !!dataModel\"\n                         (chartDraw)=\"chartDrawn()\"\n                         [responsive]=\"true\" [debug]=\"debug\" [data]=\"dataModel\"\n                         [options]=\"_options\"></warpview-gts-tree>\n\n      <warpview-image *ngIf=\"graphs['image'].indexOf(type) > -1 && !!dataModel\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [responsive]=\"true\" [debug]=\"debug\" [data]=\"dataModel\" [options]=\"_options\"></warpview-image>\n\n      <warpview-map *ngIf=\"graphs['map'].indexOf(type) > -1 && !!dataModel\" [responsive]=\"true\" [debug]=\"debug\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [data]=\"dataModel\" [options]=\"_options\"></warpview-map>\n\n      <warpview-pie [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                    *ngIf=\"graphs['pie'].indexOf(type) > -1 && !!dataModel\"\n                    [responsive]=\"true\"></warpview-pie>\n\n      <warpview-gauge [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['gauge'].indexOf(type) > -1 && !!dataModel\"\n                      [responsive]=\"true\"></warpview-gauge>\n\n      <warpview-annotation [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                           [standalone]=\"true\" [type]=\"type\"\n                           *ngIf=\"graphs['annotation'].indexOf(type) > -1 && !!dataModel\"\n                           [responsive]=\"true\"></warpview-annotation>\n\n      <warpview-event-drop [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                           *ngIf=\"graphs['drops'].indexOf(type) > -1 && !!dataModel\"\n                           [responsive]=\"true\"></warpview-event-drop>\n\n      <warpview-polar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['polar'].indexOf(type) > -1 && !!dataModel\"\n                      [responsive]=\"true\"></warpview-polar>\n\n      <warpview-radar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['radar'].indexOf(type) > -1 && !!dataModel\"\n                      [responsive]=\"true\"></warpview-radar>\n\n      <warpview-box [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                    *ngIf=\"graphs['box'].indexOf(type) > -1 && !!dataModel\"\n                    [responsive]=\"true\"></warpview-box>\n\n      <warpview-3d-line [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                        (chartDraw)=\"chartDrawn()\"\n                        [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                        *ngIf=\"graphs['line3d'].indexOf(type) > -1 && !!dataModel\"\n                        [responsive]=\"true\"></warpview-3d-line>\n      <warpview-globe [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                      *ngIf=\"graphs['globe'].indexOf(type) > -1 && !!dataModel\"\n                      [responsive]=\"true\"></warpview-globe>\n    </div>\n</div>\n",
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host,warp-view-result-tile,warpview-result-tile{max-height:var(--warp-view-tile-height,100%);min-height:var(--warp-view-tile-height,100%);min-width:var(--warp-view-tile-width,100%);overflow:auto;width:var(--warp-view-tile-width,100%)}:host .error,warp-view-result-tile .error,warpview-result-tile .error{color:#dc3545;font-weight:700;text-align:center;width:100%}:host .wrapper,warp-view-result-tile .wrapper,warpview-result-tile .wrapper{height:var(--warp-view-tile-height,100%);min-height:50px;opacity:1;width:var(--warp-view-tile-width,100%)}:host .wrapper.full,:host .wrapper .tilewrapper,warp-view-result-tile .wrapper.full,warp-view-result-tile .wrapper .tilewrapper,warpview-result-tile .wrapper.full,warpview-result-tile .wrapper .tilewrapper{height:100%;width:100%}:host .wrapper .tilewrapper .tile,warp-view-result-tile .wrapper .tilewrapper .tile,warpview-result-tile .wrapper .tilewrapper .tile{height:calc(var(--warp-view-tile-height, 100%) - 40px);overflow-x:hidden;overflow-y:auto;width:100%}:host .wrapper .tilewrapper .notitle,warp-view-result-tile .wrapper .tilewrapper .notitle,warpview-result-tile .wrapper .tilewrapper .notitle{height:100%;overflow:hidden}:host .wrapper .tilewrapper h1,warp-view-result-tile .wrapper .tilewrapper h1,warpview-result-tile .wrapper .tilewrapper h1{color:var(--warp-view-font-color);font-size:20px;margin:0;padding:5px}:host .wrapper .tilewrapper h1 small,warp-view-result-tile .wrapper .tilewrapper h1 small,warpview-result-tile .wrapper .tilewrapper h1 small{font-size:10px;margin-left:10px}"]
                },] }
    ];
    WarpViewResultTileComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: SizeService },
        { type: i0.NgZone }
    ]; };
    WarpViewResultTileComponent.propDecorators = {
        type: [{ type: i0.Input, args: ['type',] }],
        standalone: [{ type: i0.Input, args: ['standalone',] }],
        pointHover: [{ type: i0.Output, args: ['pointHover',] }],
        warpViewChartResize: [{ type: i0.Output, args: ['warpViewChartResize',] }],
        chartDraw: [{ type: i0.Output, args: ['chartDraw',] }],
        boundsDidChange: [{ type: i0.Output, args: ['boundsDidChange',] }],
        warpViewNewOptions: [{ type: i0.Output, args: ['warpViewNewOptions',] }]
    };

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
    var WarpViewAngularModule = /** @class */ (function () {
        function WarpViewAngularModule() {
        }
        return WarpViewAngularModule;
    }());
    WarpViewAngularModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [
                        WarpViewTileComponent,
                        WarpViewChartComponent,
                        WarpViewSpinnerComponent,
                        WarpViewToggleComponent,
                        WarpViewBarComponent,
                        WarpViewBubbleComponent,
                        WarpViewDatagridComponent,
                        WarpViewPaginableComponent,
                        WarpViewDisplayComponent,
                        WarpViewDrillDownComponent,
                        CalendarHeatmapComponent,
                        WarpViewGtsPopupComponent,
                        WarpViewModalComponent,
                        WarpViewGtsTreeComponent,
                        WarpViewTreeViewComponent,
                        WarpViewChipComponent,
                        WarpViewImageComponent,
                        WarpViewMapComponent,
                        WarpViewHeatmapSlidersComponent,
                        WarpViewPieComponent,
                        WarpViewGaugeComponent,
                        WarpViewAnnotationComponent,
                        WarpViewPolarComponent,
                        WarpViewRadarComponent,
                        WarpViewPlotComponent,
                        WarpViewResizeComponent,
                        WarpViewSliderComponent,
                        WarpViewRangeSliderComponent,
                        WarpViewSpectrumComponent,
                        PlotlyComponent,
                        WarpViewBoxComponent,
                        WarpView3dLineComponent,
                        WarpViewGlobeComponent,
                        WarpViewEventDropComponent,
                        WarpViewResultTileComponent
                    ],
                    imports: [
                        common.CommonModule,
                        i1.HttpClientModule,
                        angularResizeEvent.AngularResizedEventModule,
                        forms.FormsModule
                    ],
                    exports: [
                        WarpViewTileComponent,
                        WarpViewChartComponent,
                        WarpViewSpinnerComponent,
                        WarpViewToggleComponent,
                        WarpViewBarComponent,
                        WarpViewBubbleComponent,
                        WarpViewDatagridComponent,
                        WarpViewPaginableComponent,
                        WarpViewDisplayComponent,
                        WarpViewDrillDownComponent,
                        CalendarHeatmapComponent,
                        WarpViewGtsPopupComponent,
                        WarpViewModalComponent,
                        WarpViewGtsTreeComponent,
                        WarpViewTreeViewComponent,
                        WarpViewChipComponent,
                        WarpViewImageComponent,
                        WarpViewMapComponent,
                        WarpViewHeatmapSlidersComponent,
                        WarpViewPieComponent,
                        WarpViewGaugeComponent,
                        WarpViewAnnotationComponent,
                        WarpViewPolarComponent,
                        WarpViewRadarComponent,
                        WarpViewPlotComponent,
                        WarpViewResizeComponent,
                        WarpViewSliderComponent,
                        WarpViewRangeSliderComponent,
                        WarpViewSpectrumComponent,
                        WarpViewBoxComponent,
                        WarpView3dLineComponent,
                        WarpViewGlobeComponent,
                        WarpViewEventDropComponent,
                        WarpViewResultTileComponent
                    ],
                    providers: [HttpErrorHandler, SizeService],
                    entryComponents: [
                        WarpViewTileComponent,
                        WarpViewChartComponent,
                        WarpViewSpinnerComponent,
                        WarpViewToggleComponent,
                        WarpViewBarComponent,
                        WarpViewBubbleComponent,
                        WarpViewDatagridComponent,
                        WarpViewPaginableComponent,
                        WarpViewDisplayComponent,
                        WarpViewDrillDownComponent,
                        CalendarHeatmapComponent,
                        WarpViewGtsPopupComponent,
                        WarpViewModalComponent,
                        WarpViewGtsTreeComponent,
                        WarpViewTreeViewComponent,
                        WarpViewChipComponent,
                        WarpViewImageComponent,
                        WarpViewMapComponent,
                        WarpViewHeatmapSlidersComponent,
                        WarpViewPieComponent,
                        WarpViewGaugeComponent,
                        WarpViewAnnotationComponent,
                        WarpViewPolarComponent,
                        WarpViewRadarComponent,
                        WarpViewPlotComponent,
                        WarpViewResizeComponent,
                        WarpViewSliderComponent,
                        WarpViewRangeSliderComponent,
                        WarpViewSpectrumComponent,
                        PlotlyComponent,
                        WarpViewBoxComponent,
                        WarpView3dLineComponent,
                        WarpViewGlobeComponent,
                        WarpViewEventDropComponent,
                        WarpViewResultTileComponent
                    ]
                },] }
    ];

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

    /**
     * Generated bundle index. Do not edit.
     */

    exports.CalendarHeatmapComponent = CalendarHeatmapComponent;
    exports.Param = Param;
    exports.PlotlyComponent = PlotlyComponent;
    exports.WarpView3dLineComponent = WarpView3dLineComponent;
    exports.WarpViewAngularModule = WarpViewAngularModule;
    exports.WarpViewAnnotationComponent = WarpViewAnnotationComponent;
    exports.WarpViewBarComponent = WarpViewBarComponent;
    exports.WarpViewBoxComponent = WarpViewBoxComponent;
    exports.WarpViewBubbleComponent = WarpViewBubbleComponent;
    exports.WarpViewChartComponent = WarpViewChartComponent;
    exports.WarpViewChipComponent = WarpViewChipComponent;
    exports.WarpViewDatagridComponent = WarpViewDatagridComponent;
    exports.WarpViewDisplayComponent = WarpViewDisplayComponent;
    exports.WarpViewDrillDownComponent = WarpViewDrillDownComponent;
    exports.WarpViewEventDropComponent = WarpViewEventDropComponent;
    exports.WarpViewGaugeComponent = WarpViewGaugeComponent;
    exports.WarpViewGlobeComponent = WarpViewGlobeComponent;
    exports.WarpViewGtsPopupComponent = WarpViewGtsPopupComponent;
    exports.WarpViewGtsTreeComponent = WarpViewGtsTreeComponent;
    exports.WarpViewHeatmapSlidersComponent = WarpViewHeatmapSlidersComponent;
    exports.WarpViewImageComponent = WarpViewImageComponent;
    exports.WarpViewMapComponent = WarpViewMapComponent;
    exports.WarpViewModalComponent = WarpViewModalComponent;
    exports.WarpViewPaginableComponent = WarpViewPaginableComponent;
    exports.WarpViewPieComponent = WarpViewPieComponent;
    exports.WarpViewPlotComponent = WarpViewPlotComponent;
    exports.WarpViewPolarComponent = WarpViewPolarComponent;
    exports.WarpViewRadarComponent = WarpViewRadarComponent;
    exports.WarpViewRangeSliderComponent = WarpViewRangeSliderComponent;
    exports.WarpViewResizeComponent = WarpViewResizeComponent;
    exports.WarpViewResultTileComponent = WarpViewResultTileComponent;
    exports.WarpViewSliderComponent = WarpViewSliderComponent;
    exports.WarpViewSpectrumComponent = WarpViewSpectrumComponent;
    exports.WarpViewSpinnerComponent = WarpViewSpinnerComponent;
    exports.WarpViewTileComponent = WarpViewTileComponent;
    exports.WarpViewToggleComponent = WarpViewToggleComponent;
    exports.WarpViewTreeViewComponent = WarpViewTreeViewComponent;
    exports.ɵa = WarpViewComponent;
    exports.ɵb = SizeService;
    exports.ɵc = HttpErrorHandler;
    exports.ɵd = Warp10Service;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=warpview.umd.js.map
