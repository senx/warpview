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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { CharacterClassifier } from '../core/characterClassifier.js';
var WordCharacterClassifier = /** @class */ (function (_super) {
    __extends(WordCharacterClassifier, _super);
    function WordCharacterClassifier(wordSeparators) {
        var _this = _super.call(this, 0 /* Regular */) || this;
        for (var i = 0, len = wordSeparators.length; i < len; i++) {
            _this.set(wordSeparators.charCodeAt(i), 2 /* WordSeparator */);
        }
        _this.set(32 /* Space */, 1 /* Whitespace */);
        _this.set(9 /* Tab */, 1 /* Whitespace */);
        return _this;
    }
    return WordCharacterClassifier;
}(CharacterClassifier));
export { WordCharacterClassifier };
function once(computeFn) {
    var cache = {}; // TODO@Alex unbounded cache
    return function (input) {
        if (!cache.hasOwnProperty(input)) {
            cache[input] = computeFn(input);
        }
        return cache[input];
    };
}
export var getMapForWordSeparators = once(function (input) { return new WordCharacterClassifier(input); });
