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
export function stringifyObject(obj, indent, stringifyLiteral) {
    if (obj !== null && typeof obj === 'object') {
        var newIndent = indent + '\t';
        if (Array.isArray(obj)) {
            if (obj.length === 0) {
                return '[]';
            }
            var result = '[\n';
            for (var i = 0; i < obj.length; i++) {
                result += newIndent + stringifyObject(obj[i], newIndent, stringifyLiteral);
                if (i < obj.length - 1) {
                    result += ',';
                }
                result += '\n';
            }
            result += indent + ']';
            return result;
        }
        else {
            var keys = Object.keys(obj);
            if (keys.length === 0) {
                return '{}';
            }
            var result = '{\n';
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                result += newIndent + JSON.stringify(key) + ': ' + stringifyObject(obj[key], newIndent, stringifyLiteral);
                if (i < keys.length - 1) {
                    result += ',';
                }
                result += '\n';
            }
            result += indent + '}';
            return result;
        }
    }
    return stringifyLiteral(obj);
}
