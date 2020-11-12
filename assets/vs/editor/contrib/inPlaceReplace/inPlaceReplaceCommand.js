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
var InPlaceReplaceCommand = /** @class */ (function () {
    function InPlaceReplaceCommand(editRange, originalSelection, text) {
        this._editRange = editRange;
        this._originalSelection = originalSelection;
        this._text = text;
    }
    InPlaceReplaceCommand.prototype.getEditOperations = function (model, builder) {
        builder.addTrackedEditOperation(this._editRange, this._text);
    };
    InPlaceReplaceCommand.prototype.computeCursorState = function (model, helper) {
        var inverseEditOperations = helper.getInverseEditOperations();
        var srcRange = inverseEditOperations[0].range;
        if (!this._originalSelection.isEmpty()) {
            // Preserve selection and extends to typed text
            return new Selection(srcRange.endLineNumber, srcRange.endColumn - this._text.length, srcRange.endLineNumber, srcRange.endColumn);
        }
        return new Selection(srcRange.endLineNumber, Math.min(this._originalSelection.positionColumn, srcRange.endColumn), srcRange.endLineNumber, Math.min(this._originalSelection.positionColumn, srcRange.endColumn));
    };
    return InPlaceReplaceCommand;
}());
export { InPlaceReplaceCommand };
