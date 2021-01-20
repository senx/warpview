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
var IndentRulesSupport = /** @class */ (function () {
    function IndentRulesSupport(indentationRules) {
        this._indentationRules = indentationRules;
    }
    IndentRulesSupport.prototype.shouldIncrease = function (text) {
        if (this._indentationRules) {
            if (this._indentationRules.increaseIndentPattern && this._indentationRules.increaseIndentPattern.test(text)) {
                return true;
            }
            // if (this._indentationRules.indentNextLinePattern && this._indentationRules.indentNextLinePattern.test(text)) {
            // 	return true;
            // }
        }
        return false;
    };
    IndentRulesSupport.prototype.shouldDecrease = function (text) {
        if (this._indentationRules && this._indentationRules.decreaseIndentPattern && this._indentationRules.decreaseIndentPattern.test(text)) {
            return true;
        }
        return false;
    };
    IndentRulesSupport.prototype.shouldIndentNextLine = function (text) {
        if (this._indentationRules && this._indentationRules.indentNextLinePattern && this._indentationRules.indentNextLinePattern.test(text)) {
            return true;
        }
        return false;
    };
    IndentRulesSupport.prototype.shouldIgnore = function (text) {
        // the text matches `unIndentedLinePattern`
        if (this._indentationRules && this._indentationRules.unIndentedLinePattern && this._indentationRules.unIndentedLinePattern.test(text)) {
            return true;
        }
        return false;
    };
    IndentRulesSupport.prototype.getIndentMetadata = function (text) {
        var ret = 0;
        if (this.shouldIncrease(text)) {
            ret += 1 /* INCREASE_MASK */;
        }
        if (this.shouldDecrease(text)) {
            ret += 2 /* DECREASE_MASK */;
        }
        if (this.shouldIndentNextLine(text)) {
            ret += 4 /* INDENT_NEXTLINE_MASK */;
        }
        if (this.shouldIgnore(text)) {
            ret += 8 /* UNINDENT_MASK */;
        }
        return ret;
    };
    return IndentRulesSupport;
}());
export { IndentRulesSupport };
