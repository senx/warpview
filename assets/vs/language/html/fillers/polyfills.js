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
export function polyfill() {
    // Object.assign, for IE11
    if (typeof Object['assign'] != 'function') {
        Object.defineProperty(Object, "assign", {
            value: function assign(destination, sources) {
                'use strict';
                if (destination !== null) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i];
                        if (source) {
                            for (var key in source) {
                                if (Object.prototype.hasOwnProperty.call(source, key)) {
                                    destination[key] = source[key];
                                }
                            }
                        }
                    }
                    ;
                }
                return destination;
            },
            writable: true,
            configurable: true
        });
    }
}
