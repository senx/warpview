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
import { ignoreBracketsInToken } from '../supports.js';
import { BracketsUtils } from './richEditBrackets.js';
var BracketElectricCharacterSupport = /** @class */ (function () {
    function BracketElectricCharacterSupport(richEditBrackets) {
        this._richEditBrackets = richEditBrackets;
    }
    BracketElectricCharacterSupport.prototype.getElectricCharacters = function () {
        var result = [];
        if (this._richEditBrackets) {
            for (var i = 0, len = this._richEditBrackets.brackets.length; i < len; i++) {
                var bracketPair = this._richEditBrackets.brackets[i];
                var lastChar = bracketPair.close.charAt(bracketPair.close.length - 1);
                result.push(lastChar);
            }
        }
        // Filter duplicate entries
        result = result.filter(function (item, pos, array) {
            return array.indexOf(item) === pos;
        });
        return result;
    };
    BracketElectricCharacterSupport.prototype.onElectricCharacter = function (character, context, column) {
        if (!this._richEditBrackets || this._richEditBrackets.brackets.length === 0) {
            return null;
        }
        var tokenIndex = context.findTokenIndexAtOffset(column - 1);
        if (ignoreBracketsInToken(context.getStandardTokenType(tokenIndex))) {
            return null;
        }
        var reversedBracketRegex = this._richEditBrackets.reversedRegex;
        var text = context.getLineContent().substring(0, column - 1) + character;
        var r = BracketsUtils.findPrevBracketInToken(reversedBracketRegex, 1, text, 0, text.length);
        if (!r) {
            return null;
        }
        var bracketText = text.substring(r.startColumn - 1, r.endColumn - 1);
        bracketText = bracketText.toLowerCase();
        var isOpen = this._richEditBrackets.textIsOpenBracket[bracketText];
        if (isOpen) {
            return null;
        }
        var textBeforeBracket = text.substring(0, r.startColumn - 1);
        if (!/^\s*$/.test(textBeforeBracket)) {
            // There is other text on the line before the bracket
            return null;
        }
        return {
            matchOpenBracket: bracketText
        };
    };
    return BracketElectricCharacterSupport;
}());
export { BracketElectricCharacterSupport };
