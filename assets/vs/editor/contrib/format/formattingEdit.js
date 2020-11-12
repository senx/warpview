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
var FormattingEdit = /** @class */ (function () {
    function FormattingEdit() {
    }
    FormattingEdit._handleEolEdits = function (editor, edits) {
        var newEol = undefined;
        var singleEdits = [];
        for (var _i = 0, edits_1 = edits; _i < edits_1.length; _i++) {
            var edit = edits_1[_i];
            if (typeof edit.eol === 'number') {
                newEol = edit.eol;
            }
            if (edit.range && typeof edit.text === 'string') {
                singleEdits.push(edit);
            }
        }
        if (typeof newEol === 'number') {
            if (editor.hasModel()) {
                editor.getModel().pushEOL(newEol);
            }
        }
        return singleEdits;
    };
    FormattingEdit._isFullModelReplaceEdit = function (editor, edit) {
        if (!editor.hasModel()) {
            return false;
        }
        var model = editor.getModel();
        var editRange = model.validateRange(edit.range);
        var fullModelRange = model.getFullModelRange();
        return fullModelRange.equalsRange(editRange);
    };
    FormattingEdit.execute = function (editor, _edits) {
        editor.pushUndoStop();
        var edits = FormattingEdit._handleEolEdits(editor, _edits);
        if (edits.length === 1 && FormattingEdit._isFullModelReplaceEdit(editor, edits[0])) {
            // We use replace semantics and hope that markers stay put...
            editor.executeEdits('formatEditsCommand', edits.map(function (edit) { return EditOperation.replace(Range.lift(edit.range), edit.text); }));
        }
        else {
            editor.executeEdits('formatEditsCommand', edits.map(function (edit) { return EditOperation.replaceMove(Range.lift(edit.range), edit.text); }));
        }
        editor.pushUndoStop();
    };
    return FormattingEdit;
}());
export { FormattingEdit };
