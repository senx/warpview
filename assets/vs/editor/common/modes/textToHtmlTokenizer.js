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
import * as strings from '../../../base/common/strings.js';
import { LineTokens } from '../core/lineTokens.js';
import { NULL_STATE, nullTokenize2 } from './nullMode.js';
var fallback = {
    getInitialState: function () { return NULL_STATE; },
    tokenize2: function (buffer, state, deltaOffset) { return nullTokenize2(0 /* Null */, buffer, state, deltaOffset); }
};
export function tokenizeToString(text, tokenizationSupport) {
    if (tokenizationSupport === void 0) { tokenizationSupport = fallback; }
    return _tokenizeToString(text, tokenizationSupport || fallback);
}
export function tokenizeLineToHTML(text, viewLineTokens, colorMap, startOffset, endOffset, tabSize) {
    var result = "<div>";
    var charIndex = startOffset;
    var tabsCharDelta = 0;
    for (var tokenIndex = 0, tokenCount = viewLineTokens.getCount(); tokenIndex < tokenCount; tokenIndex++) {
        var tokenEndIndex = viewLineTokens.getEndOffset(tokenIndex);
        if (tokenEndIndex <= startOffset) {
            continue;
        }
        var partContent = '';
        for (; charIndex < tokenEndIndex && charIndex < endOffset; charIndex++) {
            var charCode = text.charCodeAt(charIndex);
            switch (charCode) {
                case 9 /* Tab */:
                    var insertSpacesCount = tabSize - (charIndex + tabsCharDelta) % tabSize;
                    tabsCharDelta += insertSpacesCount - 1;
                    while (insertSpacesCount > 0) {
                        partContent += '&nbsp;';
                        insertSpacesCount--;
                    }
                    break;
                case 60 /* LessThan */:
                    partContent += '&lt;';
                    break;
                case 62 /* GreaterThan */:
                    partContent += '&gt;';
                    break;
                case 38 /* Ampersand */:
                    partContent += '&amp;';
                    break;
                case 0 /* Null */:
                    partContent += '&#00;';
                    break;
                case 65279 /* UTF8_BOM */:
                case 8232 /* LINE_SEPARATOR_2028 */:
                    partContent += '\ufffd';
                    break;
                case 13 /* CarriageReturn */:
                    // zero width space, because carriage return would introduce a line break
                    partContent += '&#8203';
                    break;
                case 32 /* Space */:
                    partContent += '&nbsp;';
                    break;
                default:
                    partContent += String.fromCharCode(charCode);
            }
        }
        result += "<span style=\"" + viewLineTokens.getInlineStyle(tokenIndex, colorMap) + "\">" + partContent + "</span>";
        if (tokenEndIndex > endOffset || charIndex >= endOffset) {
            break;
        }
    }
    result += "</div>";
    return result;
}
function _tokenizeToString(text, tokenizationSupport) {
    var result = "<div class=\"monaco-tokenized-source\">";
    var lines = text.split(/\r\n|\r|\n/);
    var currentState = tokenizationSupport.getInitialState();
    for (var i = 0, len = lines.length; i < len; i++) {
        var line = lines[i];
        if (i > 0) {
            result += "<br/>";
        }
        var tokenizationResult = tokenizationSupport.tokenize2(line, currentState, 0);
        LineTokens.convertToEndOffset(tokenizationResult.tokens, line.length);
        var lineTokens = new LineTokens(tokenizationResult.tokens, line);
        var viewLineTokens = lineTokens.inflate();
        var startOffset = 0;
        for (var j = 0, lenJ = viewLineTokens.getCount(); j < lenJ; j++) {
            var type = viewLineTokens.getClassName(j);
            var endIndex = viewLineTokens.getEndOffset(j);
            result += "<span class=\"" + type + "\">" + strings.escape(line.substring(startOffset, endIndex)) + "</span>";
            startOffset = endIndex;
        }
        currentState = tokenizationResult.endState;
    }
    result += "</div>";
    return result;
}
