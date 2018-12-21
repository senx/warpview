/*! Built with http://stenciljs.com */
const { h } = window.warpview;

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
class Logger {
    /**
     *
     * @param className
     */
    constructor(className) {
        this.className = className.name;
    }
    static isArray(value) {
        return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number'
            && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
    }
    /**
     *
     * @param {LEVEL} level
     * @param {any[]} methods
     * @param {any[]} args
     */
    log(level, methods, args) {
        let logChain = [];
        logChain.push(`[${this.className}] ${methods.join(' - ')}`);
        logChain = logChain.concat(args);
        switch (level) {
            case LEVEL.DEBUG: {
                console.debug(...logChain);
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
                console.log(...logChain);
            }
        }
    }
    /**
     *
     * @param {any[]} methods
     * @param args
     */
    debug(methods, ...args) {
        this.log(LEVEL.DEBUG, methods, args);
    }
    /**
     *
     * @param {any[]} methods
     * @param args
     */
    error(methods, ...args) {
        this.log(LEVEL.ERROR, methods, args);
    }
    /**
     *
     * @param {any[]} methods
     * @param args
     */
    warn(methods, ...args) {
        this.log(LEVEL.WARN, methods, args);
    }
    /**
     *
     * @param {any[]} methods
     * @param args
     */
    info(methods, ...args) {
        this.log(LEVEL.INFO, methods, args);
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
class Param {
    constructor() {
        this.showDots = true;
        this.timeUnit = 'us';
    }
}

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
class ChartLib {
    /**
     * Generate a guid
     * @returns {string}
     */
    static guid() {
        let uuid = '', i, random;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i == 8 || i == 12 || i == 16 || i == 20) {
                uuid += "-";
            }
            uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    }
    /**
     *
     * @param sources
     * @returns {{}}
     */
    static mergeDeep(...sources) {
        // Variables
        let extended = {};
        let deep = true;
        let i = 0;
        // Merge the object into the extended object
        // Loop through each object and conduct a merge
        for (; i < arguments.length; i++) {
            const obj = arguments[i];
            ChartLib.merge(obj, extended, deep);
        }
        return extended;
    }
    /**
     *
     * @param obj
     * @param extended
     * @param deep
     */
    static merge(obj, extended, deep) {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                // If property is an object, merge properties
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                    extended[prop] = ChartLib.mergeDeep(extended[prop], obj[prop]);
                }
                else {
                    extended[prop] = obj[prop];
                }
            }
        }
    }
    ;
    /**
     *
     * @param item
     */
    static isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }
    /**
     *
     * @returns {{title: (tooltipItem) => any; label: (tooltipItem, data) => string}}
     */
    static getTooltipCallbacks() {
        return {
            title: (tooltipItem) => {
                return tooltipItem[0].xLabel;
            },
            label: (tooltipItem, data) => {
                let label = data.datasets[tooltipItem.datasetIndex].label || '';
                if (label) {
                    label += ': ';
                }
                label += tooltipItem.yLabel;
                return label;
            }
        };
    }
    /**
     *
     * @param {number} w
     * @param {number} h
     * @param {string} color
     * @returns {HTMLImageElement}
     */
    static buildImage(w, h, color) {
        const img = new Image(w, h);
        const svg = `<svg width="${w}px" height="${h}px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid">
<rect width="${w}" height="${h}" style="fill:${color};" ></rect>
</svg>`;
        // 	myImage.src = "ripple.svg"
        img.src = "data:image/svg+xml;base64," + btoa(svg);
        return img;
    }
}

export { Logger as a, Param as b, ChartLib as c };
