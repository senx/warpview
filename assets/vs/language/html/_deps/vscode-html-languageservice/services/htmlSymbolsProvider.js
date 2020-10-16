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
import { Location, Range, SymbolKind } from '../../vscode-languageserver-types/main.js';
export function findDocumentSymbols(document, htmlDocument) {
    var symbols = [];
    htmlDocument.roots.forEach(function (node) {
        provideFileSymbolsInternal(document, node, '', symbols);
    });
    return symbols;
}
function provideFileSymbolsInternal(document, node, container, symbols) {
    var name = nodeToName(node);
    var location = Location.create(document.uri, Range.create(document.positionAt(node.start), document.positionAt(node.end)));
    var symbol = {
        name: name,
        location: location,
        containerName: container,
        kind: SymbolKind.Field
    };
    symbols.push(symbol);
    node.children.forEach(function (child) {
        provideFileSymbolsInternal(document, child, name, symbols);
    });
}
function nodeToName(node) {
    var name = node.tag;
    if (node.attributes) {
        var id = node.attributes['id'];
        var classes = node.attributes['class'];
        if (id) {
            name += "#" + id.replace(/[\"\']/g, '');
        }
        if (classes) {
            name += classes.replace(/[\"\']/g, '').split(/\s+/).map(function (className) { return "." + className; }).join('');
        }
    }
    return name || '?';
}
