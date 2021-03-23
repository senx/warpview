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
import { DocumentHighlightKind } from '../../vscode-languageserver-types/main.js';
import { TokenType } from '../htmlLanguageTypes.js';
export function findDocumentHighlights(document, position, htmlDocument) {
    var offset = document.offsetAt(position);
    var node = htmlDocument.findNodeAt(offset);
    if (!node.tag) {
        return [];
    }
    var result = [];
    var startTagRange = getTagNameRange(TokenType.StartTag, document, node.start);
    var endTagRange = typeof node.endTagStart === 'number' && getTagNameRange(TokenType.EndTag, document, node.endTagStart);
    if (startTagRange && covers(startTagRange, position) || endTagRange && covers(endTagRange, position)) {
        if (startTagRange) {
            result.push({ kind: DocumentHighlightKind.Read, range: startTagRange });
        }
        if (endTagRange) {
            result.push({ kind: DocumentHighlightKind.Read, range: endTagRange });
        }
    }
    return result;
}
function isBeforeOrEqual(pos1, pos2) {
    return pos1.line < pos2.line || (pos1.line === pos2.line && pos1.character <= pos2.character);
}
function covers(range, position) {
    return isBeforeOrEqual(range.start, position) && isBeforeOrEqual(position, range.end);
}
function getTagNameRange(tokenType, document, startOffset) {
    var scanner = createScanner(document.getText(), startOffset);
    var token = scanner.scan();
    while (token !== TokenType.EOS && token !== tokenType) {
        token = scanner.scan();
    }
    if (token !== TokenType.EOS) {
        return { start: document.positionAt(scanner.getTokenOffset()), end: document.positionAt(scanner.getTokenEnd()) };
    }
    return null;
}
