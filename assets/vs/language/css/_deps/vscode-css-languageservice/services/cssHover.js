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
import * as nodes from '../parser/cssNodes.js';
import * as languageFacts from '../languageFacts/facts.js';
import { Range, MarkedString } from '../../vscode-languageserver-types/main.js';
import { selectorToMarkedString, simpleSelectorToMarkedString } from './selectorPrinting.js';
var CSSHover = /** @class */ (function () {
    function CSSHover() {
    }
    CSSHover.prototype.doHover = function (document, position, stylesheet) {
        function getRange(node) {
            return Range.create(document.positionAt(node.offset), document.positionAt(node.end));
        }
        var offset = document.offsetAt(position);
        var nodepath = nodes.getNodePath(stylesheet, offset);
        for (var i = 0; i < nodepath.length; i++) {
            var node = nodepath[i];
            if (node instanceof nodes.Selector) {
                return {
                    contents: selectorToMarkedString(node),
                    range: getRange(node)
                };
            }
            if (node instanceof nodes.SimpleSelector) {
                return {
                    contents: simpleSelectorToMarkedString(node),
                    range: getRange(node)
                };
            }
            if (node instanceof nodes.Declaration) {
                var propertyName = node.getFullPropertyName();
                var entry = languageFacts.cssDataManager.getProperty(propertyName);
                if (entry) {
                    var contents = [];
                    if (entry.description) {
                        contents.push(MarkedString.fromPlainText(entry.description));
                    }
                    var browserLabel = languageFacts.getBrowserLabel(entry.browsers);
                    if (browserLabel) {
                        contents.push(MarkedString.fromPlainText(browserLabel));
                    }
                    if (contents.length) {
                        return {
                            contents: contents,
                            range: getRange(node)
                        };
                    }
                }
            }
        }
        return null;
    };
    return CSSHover;
}());
export { CSSHover };
