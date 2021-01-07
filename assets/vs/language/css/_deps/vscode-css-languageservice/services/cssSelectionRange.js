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
'use strict';
import { Range } from '../../vscode-languageserver-types/main.js';
import { NodeType } from '../parser/cssNodes.js';
import { SelectionRangeKind } from '../cssLanguageTypes.js';
export function getSelectionRanges(document, positions, stylesheet) {
    function getSelectionRange(position) {
        var applicableRanges = getApplicableRanges(position);
        var ranges = applicableRanges.map(function (pair) {
            return {
                range: Range.create(document.positionAt(pair[0]), document.positionAt(pair[1])),
                kind: SelectionRangeKind.Statement
            };
        });
        return ranges;
    }
    return positions.map(getSelectionRange);
    function getApplicableRanges(position) {
        var currNode = stylesheet.findChildAtOffset(document.offsetAt(position), true);
        if (!currNode) {
            return [];
        }
        var result = [];
        while (currNode) {
            if (currNode.parent &&
                currNode.offset === currNode.parent.offset &&
                currNode.end === currNode.parent.end) {
                currNode = currNode.parent;
                continue;
            }
            if (currNode.type === NodeType.Declarations) {
                result.push([currNode.offset + 1, currNode.end - 1]);
            }
            else {
                result.push([currNode.offset, currNode.end]);
            }
            currNode = currNode.parent;
        }
        return result;
    }
}
