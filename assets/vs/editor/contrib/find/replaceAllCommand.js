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
import { Range } from '../../common/core/range.js';
var ReplaceAllCommand = /** @class */ (function () {
    function ReplaceAllCommand(editorSelection, ranges, replaceStrings) {
        this._editorSelection = editorSelection;
        this._ranges = ranges;
        this._replaceStrings = replaceStrings;
        this._trackedEditorSelectionId = null;
    }
    ReplaceAllCommand.prototype.getEditOperations = function (model, builder) {
        if (this._ranges.length > 0) {
            // Collect all edit operations
            var ops = [];
            for (var i = 0; i < this._ranges.length; i++) {
                ops.push({
                    range: this._ranges[i],
                    text: this._replaceStrings[i]
                });
            }
            // Sort them in ascending order by range starts
            ops.sort(function (o1, o2) {
                return Range.compareRangesUsingStarts(o1.range, o2.range);
            });
            // Merge operations that touch each other
            var resultOps = [];
            var previousOp = ops[0];
            for (var i = 1; i < ops.length; i++) {
                if (previousOp.range.endLineNumber === ops[i].range.startLineNumber && previousOp.range.endColumn === ops[i].range.startColumn) {
                    // These operations are one after another and can be merged
                    previousOp.range = previousOp.range.plusRange(ops[i].range);
                    previousOp.text = previousOp.text + ops[i].text;
                }
                else {
                    resultOps.push(previousOp);
                    previousOp = ops[i];
                }
            }
            resultOps.push(previousOp);
            for (var _i = 0, resultOps_1 = resultOps; _i < resultOps_1.length; _i++) {
                var op = resultOps_1[_i];
                builder.addEditOperation(op.range, op.text);
            }
        }
        this._trackedEditorSelectionId = builder.trackSelection(this._editorSelection);
    };
    ReplaceAllCommand.prototype.computeCursorState = function (model, helper) {
        return helper.getTrackedSelection(this._trackedEditorSelectionId);
    };
    return ReplaceAllCommand;
}());
export { ReplaceAllCommand };
