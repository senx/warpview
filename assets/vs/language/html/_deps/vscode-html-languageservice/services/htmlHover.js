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
import { createScanner } from '../parser/htmlScanner.js';
import { MarkedString } from '../../vscode-languageserver-types/main.js';
import { TokenType } from '../htmlLanguageTypes.js';
import { getAllDataProviders } from '../languageFacts/builtinDataProviders.js';
export function doHover(document, position, htmlDocument) {
    var offset = document.offsetAt(position);
    var node = htmlDocument.findNodeAt(offset);
    if (!node || !node.tag) {
        return null;
    }
    var dataProviders = getAllDataProviders().filter(function (p) { return p.isApplicable(document.languageId); });
    function getTagHover(currTag, range, open) {
        currTag = currTag.toLowerCase();
        var _loop_1 = function (provider) {
            var hover = null;
            provider.provideTags().forEach(function (tag) {
                if (tag.name.toLowerCase() === currTag.toLowerCase()) {
                    var tagLabel = open ? '<' + currTag + '>' : '</' + currTag + '>';
                    var tagDescription = tag.description || '';
                    hover = { contents: [{ language: 'html', value: tagLabel }, MarkedString.fromPlainText(tagDescription)], range: range };
                }
            });
            if (hover) {
                return { value: hover };
            }
        };
        for (var _i = 0, dataProviders_1 = dataProviders; _i < dataProviders_1.length; _i++) {
            var provider = dataProviders_1[_i];
            var state_1 = _loop_1(provider);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return null;
    }
    function getTagNameRange(tokenType, startOffset) {
        var scanner = createScanner(document.getText(), startOffset);
        var token = scanner.scan();
        while (token !== TokenType.EOS && (scanner.getTokenEnd() < offset || scanner.getTokenEnd() === offset && token !== tokenType)) {
            token = scanner.scan();
        }
        if (token === tokenType && offset <= scanner.getTokenEnd()) {
            return { start: document.positionAt(scanner.getTokenOffset()), end: document.positionAt(scanner.getTokenEnd()) };
        }
        return null;
    }
    if (node.endTagStart && offset >= node.endTagStart) {
        var tagRange_1 = getTagNameRange(TokenType.EndTag, node.endTagStart);
        if (tagRange_1) {
            return getTagHover(node.tag, tagRange_1, false);
        }
        return null;
    }
    var tagRange = getTagNameRange(TokenType.StartTag, node.start);
    if (tagRange) {
        return getTagHover(node.tag, tagRange, true);
    }
    return null;
}
