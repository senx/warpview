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
import { CursorColumns, SingleCursorState } from './cursorCommon.js';
import { Position } from '../core/position.js';
import { Range } from '../core/range.js';
var ColumnSelection = /** @class */ (function () {
    function ColumnSelection() {
    }
    ColumnSelection.columnSelect = function (config, model, fromLineNumber, fromVisibleColumn, toLineNumber, toVisibleColumn) {
        var lineCount = Math.abs(toLineNumber - fromLineNumber) + 1;
        var reversed = (fromLineNumber > toLineNumber);
        var isRTL = (fromVisibleColumn > toVisibleColumn);
        var isLTR = (fromVisibleColumn < toVisibleColumn);
        var result = [];
        // console.log(`fromVisibleColumn: ${fromVisibleColumn}, toVisibleColumn: ${toVisibleColumn}`);
        for (var i = 0; i < lineCount; i++) {
            var lineNumber = fromLineNumber + (reversed ? -i : i);
            var startColumn = CursorColumns.columnFromVisibleColumn2(config, model, lineNumber, fromVisibleColumn);
            var endColumn = CursorColumns.columnFromVisibleColumn2(config, model, lineNumber, toVisibleColumn);
            var visibleStartColumn = CursorColumns.visibleColumnFromColumn2(config, model, new Position(lineNumber, startColumn));
            var visibleEndColumn = CursorColumns.visibleColumnFromColumn2(config, model, new Position(lineNumber, endColumn));
            // console.log(`lineNumber: ${lineNumber}: visibleStartColumn: ${visibleStartColumn}, visibleEndColumn: ${visibleEndColumn}`);
            if (isLTR) {
                if (visibleStartColumn > toVisibleColumn) {
                    continue;
                }
                if (visibleEndColumn < fromVisibleColumn) {
                    continue;
                }
            }
            if (isRTL) {
                if (visibleEndColumn > fromVisibleColumn) {
                    continue;
                }
                if (visibleStartColumn < toVisibleColumn) {
                    continue;
                }
            }
            result.push(new SingleCursorState(new Range(lineNumber, startColumn, lineNumber, startColumn), 0, new Position(lineNumber, endColumn), 0));
        }
        if (result.length === 0) {
            // We are after all the lines, so add cursor at the end of each line
            for (var i = 0; i < lineCount; i++) {
                var lineNumber = fromLineNumber + (reversed ? -i : i);
                var maxColumn = model.getLineMaxColumn(lineNumber);
                result.push(new SingleCursorState(new Range(lineNumber, maxColumn, lineNumber, maxColumn), 0, new Position(lineNumber, maxColumn), 0));
            }
        }
        return {
            viewStates: result,
            reversed: reversed,
            fromLineNumber: fromLineNumber,
            fromVisualColumn: fromVisibleColumn,
            toLineNumber: toLineNumber,
            toVisualColumn: toVisibleColumn
        };
    };
    ColumnSelection.columnSelectLeft = function (config, model, prevColumnSelectData) {
        var toViewVisualColumn = prevColumnSelectData.toViewVisualColumn;
        if (toViewVisualColumn > 1) {
            toViewVisualColumn--;
        }
        return ColumnSelection.columnSelect(config, model, prevColumnSelectData.fromViewLineNumber, prevColumnSelectData.fromViewVisualColumn, prevColumnSelectData.toViewLineNumber, toViewVisualColumn);
    };
    ColumnSelection.columnSelectRight = function (config, model, prevColumnSelectData) {
        var maxVisualViewColumn = 0;
        var minViewLineNumber = Math.min(prevColumnSelectData.fromViewLineNumber, prevColumnSelectData.toViewLineNumber);
        var maxViewLineNumber = Math.max(prevColumnSelectData.fromViewLineNumber, prevColumnSelectData.toViewLineNumber);
        for (var lineNumber = minViewLineNumber; lineNumber <= maxViewLineNumber; lineNumber++) {
            var lineMaxViewColumn = model.getLineMaxColumn(lineNumber);
            var lineMaxVisualViewColumn = CursorColumns.visibleColumnFromColumn2(config, model, new Position(lineNumber, lineMaxViewColumn));
            maxVisualViewColumn = Math.max(maxVisualViewColumn, lineMaxVisualViewColumn);
        }
        var toViewVisualColumn = prevColumnSelectData.toViewVisualColumn;
        if (toViewVisualColumn < maxVisualViewColumn) {
            toViewVisualColumn++;
        }
        return this.columnSelect(config, model, prevColumnSelectData.fromViewLineNumber, prevColumnSelectData.fromViewVisualColumn, prevColumnSelectData.toViewLineNumber, toViewVisualColumn);
    };
    ColumnSelection.columnSelectUp = function (config, model, prevColumnSelectData, isPaged) {
        var linesCount = isPaged ? config.pageSize : 1;
        var toViewLineNumber = Math.max(1, prevColumnSelectData.toViewLineNumber - linesCount);
        return this.columnSelect(config, model, prevColumnSelectData.fromViewLineNumber, prevColumnSelectData.fromViewVisualColumn, toViewLineNumber, prevColumnSelectData.toViewVisualColumn);
    };
    ColumnSelection.columnSelectDown = function (config, model, prevColumnSelectData, isPaged) {
        var linesCount = isPaged ? config.pageSize : 1;
        var toViewLineNumber = Math.min(model.getLineCount(), prevColumnSelectData.toViewLineNumber + linesCount);
        return this.columnSelect(config, model, prevColumnSelectData.fromViewLineNumber, prevColumnSelectData.fromViewVisualColumn, toViewLineNumber, prevColumnSelectData.toViewVisualColumn);
    };
    return ColumnSelection;
}());
export { ColumnSelection };
