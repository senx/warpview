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
import { Range } from './range.js';
var EditOperation = /** @class */ (function () {
    function EditOperation() {
    }
    EditOperation.insert = function (position, text) {
        return {
            range: new Range(position.lineNumber, position.column, position.lineNumber, position.column),
            text: text,
            forceMoveMarkers: true
        };
    };
    EditOperation.delete = function (range) {
        return {
            range: range,
            text: null
        };
    };
    EditOperation.replace = function (range, text) {
        return {
            range: range,
            text: text
        };
    };
    EditOperation.replaceMove = function (range, text) {
        return {
            range: range,
            text: text,
            forceMoveMarkers: true
        };
    };
    return EditOperation;
}());
export { EditOperation };
