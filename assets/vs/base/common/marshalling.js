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
import { URI } from './uri.js';
export function parse(text) {
    var data = JSON.parse(text);
    data = revive(data, 0);
    return data;
}
export function revive(obj, depth) {
    if (!obj || depth > 200) {
        return obj;
    }
    if (typeof obj === 'object') {
        switch (obj.$mid) {
            case 1: return URI.revive(obj);
            case 2: return new RegExp(obj.source, obj.flags);
        }
        // walk object (or array)
        for (var key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                obj[key] = revive(obj[key], depth + 1);
            }
        }
    }
    return obj;
}
