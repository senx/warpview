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
import { Range, SelectionRange } from '../_deps/vscode-languageserver-types/main.js';
import { createScanner } from '../../jsonc-parser/main.js';
export function getSelectionRanges(document, positions, doc) {
    function getSelectionRange(position) {
        var offset = document.offsetAt(position);
        var node = doc.getNodeFromOffset(offset, true);
        var result = [];
        while (node) {
            switch (node.type) {
                case 'string':
                case 'object':
                case 'array':
                    // range without ", [ or {
                    var cStart = node.offset + 1, cEnd = node.offset + node.length - 1;
                    if (cStart < cEnd && offset >= cStart && offset <= cEnd) {
                        result.push(newRange(cStart, cEnd));
                    }
                    result.push(newRange(node.offset, node.offset + node.length));
                    break;
                case 'number':
                case 'boolean':
                case 'null':
                case 'property':
                    result.push(newRange(node.offset, node.offset + node.length));
                    break;
            }
            if (node.type === 'property' || node.parent && node.parent.type === 'array') {
                var afterCommaOffset = getOffsetAfterNextToken(node.offset + node.length, 5 /* CommaToken */);
                if (afterCommaOffset !== -1) {
                    result.push(newRange(node.offset, afterCommaOffset));
                }
            }
            node = node.parent;
        }
        var current = undefined;
        for (var index = result.length - 1; index >= 0; index--) {
            current = SelectionRange.create(result[index], current);
        }
        if (!current) {
            current = SelectionRange.create(Range.create(position, position));
        }
        return current;
    }
    function newRange(start, end) {
        return Range.create(document.positionAt(start), document.positionAt(end));
    }
    var scanner = createScanner(document.getText(), true);
    function getOffsetAfterNextToken(offset, expectedToken) {
        scanner.setPosition(offset);
        var token = scanner.scan();
        if (token === expectedToken) {
            return scanner.getTokenOffset() + scanner.getTokenLength();
        }
        return -1;
    }
    return positions.map(getSelectionRange);
}
