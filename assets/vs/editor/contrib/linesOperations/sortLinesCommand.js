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
import { EditOperation } from '../../common/core/editOperation.js';
import { Range } from '../../common/core/range.js';
var SortLinesCommand = /** @class */ (function () {
    function SortLinesCommand(selection, descending) {
        this.selection = selection;
        this.descending = descending;
        this.selectionId = null;
    }
    SortLinesCommand.prototype.getEditOperations = function (model, builder) {
        var op = sortLines(model, this.selection, this.descending);
        if (op) {
            builder.addEditOperation(op.range, op.text);
        }
        this.selectionId = builder.trackSelection(this.selection);
    };
    SortLinesCommand.prototype.computeCursorState = function (model, helper) {
        return helper.getTrackedSelection(this.selectionId);
    };
    SortLinesCommand.canRun = function (model, selection, descending) {
        if (model === null) {
            return false;
        }
        var data = getSortData(model, selection, descending);
        if (!data) {
            return false;
        }
        for (var i = 0, len = data.before.length; i < len; i++) {
            if (data.before[i] !== data.after[i]) {
                return true;
            }
        }
        return false;
    };
    return SortLinesCommand;
}());
export { SortLinesCommand };
function getSortData(model, selection, descending) {
    var startLineNumber = selection.startLineNumber;
    var endLineNumber = selection.endLineNumber;
    if (selection.endColumn === 1) {
        endLineNumber--;
    }
    // Nothing to sort if user didn't select anything.
    if (startLineNumber >= endLineNumber) {
        return null;
    }
    var linesToSort = [];
    // Get the contents of the selection to be sorted.
    for (var lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
        linesToSort.push(model.getLineContent(lineNumber));
    }
    var sorted = linesToSort.slice(0);
    sorted.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    // If descending, reverse the order.
    if (descending === true) {
        sorted = sorted.reverse();
    }
    return {
        startLineNumber: startLineNumber,
        endLineNumber: endLineNumber,
        before: linesToSort,
        after: sorted
    };
}
/**
 * Generate commands for sorting lines on a model.
 */
function sortLines(model, selection, descending) {
    var data = getSortData(model, selection, descending);
    if (!data) {
        return null;
    }
    return EditOperation.replace(new Range(data.startLineNumber, 1, data.endLineNumber, model.getLineMaxColumn(data.endLineNumber)), data.after.join('\n'));
}
