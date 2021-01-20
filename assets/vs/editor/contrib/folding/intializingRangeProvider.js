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
import { sanitizeRanges } from './syntaxRangeProvider.js';
export var ID_INIT_PROVIDER = 'init';
var InitializingRangeProvider = /** @class */ (function () {
    function InitializingRangeProvider(editorModel, initialRanges, onTimeout, timeoutTime) {
        this.editorModel = editorModel;
        this.id = ID_INIT_PROVIDER;
        if (initialRanges.length) {
            var toDecorationRange = function (range) {
                return {
                    range: {
                        startLineNumber: range.startLineNumber,
                        startColumn: 0,
                        endLineNumber: range.endLineNumber,
                        endColumn: editorModel.getLineLength(range.endLineNumber)
                    },
                    options: {
                        stickiness: 1 /* NeverGrowsWhenTypingAtEdges */
                    }
                };
            };
            this.decorationIds = editorModel.deltaDecorations([], initialRanges.map(toDecorationRange));
            this.timeout = setTimeout(onTimeout, timeoutTime);
        }
    }
    InitializingRangeProvider.prototype.dispose = function () {
        if (this.decorationIds) {
            this.editorModel.deltaDecorations(this.decorationIds, []);
            this.decorationIds = undefined;
        }
        if (typeof this.timeout === 'number') {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
    };
    InitializingRangeProvider.prototype.compute = function (cancelationToken) {
        var foldingRangeData = [];
        if (this.decorationIds) {
            for (var _i = 0, _a = this.decorationIds; _i < _a.length; _i++) {
                var id = _a[_i];
                var range = this.editorModel.getDecorationRange(id);
                if (range) {
                    foldingRangeData.push({ start: range.startLineNumber, end: range.endLineNumber, rank: 1 });
                }
            }
        }
        return Promise.resolve(sanitizeRanges(foldingRangeData, Number.MAX_VALUE));
    };
    return InitializingRangeProvider;
}());
export { InitializingRangeProvider };
