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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { dispose } from '../../../base/common/lifecycle.js';
import { IContextKeyService, RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
var SuggestAlternatives = /** @class */ (function () {
    function SuggestAlternatives(_editor, contextKeyService) {
        this._editor = _editor;
        this._index = 0;
        this._ckOtherSuggestions = SuggestAlternatives.OtherSuggestions.bindTo(contextKeyService);
    }
    SuggestAlternatives.prototype.dispose = function () {
        this.reset();
    };
    SuggestAlternatives.prototype.reset = function () {
        this._ckOtherSuggestions.reset();
        dispose(this._listener);
        this._model = undefined;
        this._acceptNext = undefined;
        this._ignore = false;
    };
    SuggestAlternatives.prototype.set = function (_a, acceptNext) {
        var _this = this;
        var model = _a.model, index = _a.index;
        // no suggestions -> nothing to do
        if (model.items.length === 0) {
            this.reset();
            return;
        }
        // no alternative suggestions -> nothing to do
        var nextIndex = SuggestAlternatives._moveIndex(true, model, index);
        if (nextIndex === index) {
            this.reset();
            return;
        }
        this._acceptNext = acceptNext;
        this._model = model;
        this._index = index;
        this._listener = this._editor.onDidChangeCursorPosition(function () {
            if (!_this._ignore) {
                _this.reset();
            }
        });
        this._ckOtherSuggestions.set(true);
    };
    SuggestAlternatives._moveIndex = function (fwd, model, index) {
        var newIndex = index;
        while (true) {
            newIndex = (newIndex + model.items.length + (fwd ? +1 : -1)) % model.items.length;
            if (newIndex === index) {
                break;
            }
            if (!model.items[newIndex].completion.additionalTextEdits) {
                break;
            }
        }
        return newIndex;
    };
    SuggestAlternatives.prototype.next = function () {
        this._move(true);
    };
    SuggestAlternatives.prototype.prev = function () {
        this._move(false);
    };
    SuggestAlternatives.prototype._move = function (fwd) {
        if (!this._model) {
            // nothing to reason about
            return;
        }
        try {
            this._ignore = true;
            this._index = SuggestAlternatives._moveIndex(fwd, this._model, this._index);
            this._acceptNext({ index: this._index, item: this._model.items[this._index], model: this._model });
        }
        finally {
            this._ignore = false;
        }
    };
    SuggestAlternatives.OtherSuggestions = new RawContextKey('hasOtherSuggestions', false);
    SuggestAlternatives = __decorate([
        __param(1, IContextKeyService)
    ], SuggestAlternatives);
    return SuggestAlternatives;
}());
export { SuggestAlternatives };
