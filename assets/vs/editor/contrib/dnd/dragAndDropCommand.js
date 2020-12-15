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
import { Selection } from '../../common/core/selection.js';
import { Range } from '../../common/core/range.js';
var DragAndDropCommand = /** @class */ (function () {
    function DragAndDropCommand(selection, targetPosition, copy) {
        this.selection = selection;
        this.targetPosition = targetPosition;
        this.copy = copy;
        this.targetSelection = null;
    }
    DragAndDropCommand.prototype.getEditOperations = function (model, builder) {
        var text = model.getValueInRange(this.selection);
        if (!this.copy) {
            builder.addEditOperation(this.selection, null);
        }
        builder.addEditOperation(new Range(this.targetPosition.lineNumber, this.targetPosition.column, this.targetPosition.lineNumber, this.targetPosition.column), text);
        if (this.selection.containsPosition(this.targetPosition) && !(this.copy && (this.selection.getEndPosition().equals(this.targetPosition) || this.selection.getStartPosition().equals(this.targetPosition)) // we allow users to paste content beside the selection
        )) {
            this.targetSelection = this.selection;
            return;
        }
        if (this.copy) {
            this.targetSelection = new Selection(this.targetPosition.lineNumber, this.targetPosition.column, this.selection.endLineNumber - this.selection.startLineNumber + this.targetPosition.lineNumber, this.selection.startLineNumber === this.selection.endLineNumber ?
                this.targetPosition.column + this.selection.endColumn - this.selection.startColumn :
                this.selection.endColumn);
            return;
        }
        if (this.targetPosition.lineNumber > this.selection.endLineNumber) {
            // Drag the selection downwards
            this.targetSelection = new Selection(this.targetPosition.lineNumber - this.selection.endLineNumber + this.selection.startLineNumber, this.targetPosition.column, this.targetPosition.lineNumber, this.selection.startLineNumber === this.selection.endLineNumber ?
                this.targetPosition.column + this.selection.endColumn - this.selection.startColumn :
                this.selection.endColumn);
            return;
        }
        if (this.targetPosition.lineNumber < this.selection.endLineNumber) {
            // Drag the selection upwards
            this.targetSelection = new Selection(this.targetPosition.lineNumber, this.targetPosition.column, this.targetPosition.lineNumber + this.selection.endLineNumber - this.selection.startLineNumber, this.selection.startLineNumber === this.selection.endLineNumber ?
                this.targetPosition.column + this.selection.endColumn - this.selection.startColumn :
                this.selection.endColumn);
            return;
        }
        // The target position is at the same line as the selection's end position.
        if (this.selection.endColumn <= this.targetPosition.column) {
            // The target position is after the selection's end position
            this.targetSelection = new Selection(this.targetPosition.lineNumber - this.selection.endLineNumber + this.selection.startLineNumber, this.selection.startLineNumber === this.selection.endLineNumber ?
                this.targetPosition.column - this.selection.endColumn + this.selection.startColumn :
                this.targetPosition.column - this.selection.endColumn + this.selection.startColumn, this.targetPosition.lineNumber, this.selection.startLineNumber === this.selection.endLineNumber ?
                this.targetPosition.column :
                this.selection.endColumn);
        }
        else {
            // The target position is before the selection's end position. Since the selection doesn't contain the target position, the selection is one-line and target position is before this selection.
            this.targetSelection = new Selection(this.targetPosition.lineNumber - this.selection.endLineNumber + this.selection.startLineNumber, this.targetPosition.column, this.targetPosition.lineNumber, this.targetPosition.column + this.selection.endColumn - this.selection.startColumn);
        }
    };
    DragAndDropCommand.prototype.computeCursorState = function (model, helper) {
        return this.targetSelection;
    };
    return DragAndDropCommand;
}());
export { DragAndDropCommand };
