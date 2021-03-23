/*
 *  Copyright 2020 SenX S.A.S.
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
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Returns an array which contains all values that reside
 * in the given set.
 */
export function values(from) {
    var result = [];
    for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
            result.push(from[key]);
        }
    }
    return result;
}
export function first(from) {
    for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
            return from[key];
        }
    }
    return undefined;
}
/**
 * Iterates over each entry in the provided set. The iterator allows
 * to remove elements and will stop when the callback returns {{false}}.
 */
export function forEach(from, callback) {
    var _loop_1 = function (key) {
        if (hasOwnProperty.call(from, key)) {
            var result = callback({ key: key, value: from[key] }, function () {
                delete from[key];
            });
            if (result === false) {
                return { value: void 0 };
            }
        }
    };
    for (var key in from) {
        var state_1 = _loop_1(key);
        if (typeof state_1 === "object")
            return state_1.value;
    }
}
var SetMap = /** @class */ (function () {
    function SetMap() {
        this.map = new Map();
    }
    SetMap.prototype.add = function (key, value) {
        var values = this.map.get(key);
        if (!values) {
            values = new Set();
            this.map.set(key, values);
        }
        values.add(value);
    };
    SetMap.prototype.delete = function (key, value) {
        var values = this.map.get(key);
        if (!values) {
            return;
        }
        values.delete(value);
        if (values.size === 0) {
            this.map.delete(key);
        }
    };
    SetMap.prototype.forEach = function (key, fn) {
        var values = this.map.get(key);
        if (!values) {
            return;
        }
        values.forEach(fn);
    };
    return SetMap;
}());
export { SetMap };
