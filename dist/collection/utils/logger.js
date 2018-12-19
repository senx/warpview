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
export class Logger {
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
export var LEVEL;
(function (LEVEL) {
    LEVEL[LEVEL["DEBUG"] = 0] = "DEBUG";
    LEVEL[LEVEL["ERROR"] = 1] = "ERROR";
    LEVEL[LEVEL["WARN"] = 2] = "WARN";
    LEVEL[LEVEL["INFO"] = 3] = "INFO";
})(LEVEL || (LEVEL = {}));
