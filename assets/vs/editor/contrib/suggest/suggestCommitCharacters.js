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
import { isNonEmptyArray } from '../../../base/common/arrays.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { CharacterSet } from '../../common/core/characterClassifier.js';
var CommitCharacterController = /** @class */ (function () {
    function CommitCharacterController(editor, widget, accept) {
        var _this = this;
        this._disposables = new DisposableStore();
        this._disposables.add(widget.onDidShow(function () { return _this._onItem(widget.getFocusedItem()); }));
        this._disposables.add(widget.onDidFocus(this._onItem, this));
        this._disposables.add(widget.onDidHide(this.reset, this));
        this._disposables.add(editor.onWillType(function (text) {
            if (_this._active) {
                var ch = text.charCodeAt(text.length - 1);
                if (_this._active.acceptCharacters.has(ch) && editor.getConfiguration().contribInfo.acceptSuggestionOnCommitCharacter) {
                    accept(_this._active.item);
                }
            }
        }));
    }
    CommitCharacterController.prototype._onItem = function (selected) {
        if (!selected || !isNonEmptyArray(selected.item.completion.commitCharacters)) {
            // no item or no commit characters
            this.reset();
            return;
        }
        if (this._active && this._active.item.item === selected.item) {
            // still the same item
            return;
        }
        // keep item and its commit characters
        var acceptCharacters = new CharacterSet();
        for (var _i = 0, _a = selected.item.completion.commitCharacters; _i < _a.length; _i++) {
            var ch = _a[_i];
            if (ch.length > 0) {
                acceptCharacters.add(ch.charCodeAt(0));
            }
        }
        this._active = { acceptCharacters: acceptCharacters, item: selected };
    };
    CommitCharacterController.prototype.reset = function () {
        this._active = undefined;
    };
    CommitCharacterController.prototype.dispose = function () {
        this._disposables.dispose();
    };
    return CommitCharacterController;
}());
export { CommitCharacterController };
