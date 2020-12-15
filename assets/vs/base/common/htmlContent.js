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
import { equals } from './arrays.js';
var MarkdownString = /** @class */ (function () {
    function MarkdownString(value) {
        if (value === void 0) { value = ''; }
        this.value = value;
    }
    MarkdownString.prototype.appendText = function (value) {
        // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
        this.value += value.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&');
        return this;
    };
    MarkdownString.prototype.appendMarkdown = function (value) {
        this.value += value;
        return this;
    };
    MarkdownString.prototype.appendCodeblock = function (langId, code) {
        this.value += '\n```';
        this.value += langId;
        this.value += '\n';
        this.value += code;
        this.value += '\n```\n';
        return this;
    };
    return MarkdownString;
}());
export { MarkdownString };
export function isEmptyMarkdownString(oneOrMany) {
    if (isMarkdownString(oneOrMany)) {
        return !oneOrMany.value;
    }
    else if (Array.isArray(oneOrMany)) {
        return oneOrMany.every(isEmptyMarkdownString);
    }
    else {
        return true;
    }
}
export function isMarkdownString(thing) {
    if (thing instanceof MarkdownString) {
        return true;
    }
    else if (thing && typeof thing === 'object') {
        return typeof thing.value === 'string'
            && (typeof thing.isTrusted === 'boolean' || thing.isTrusted === undefined);
    }
    return false;
}
export function markedStringsEquals(a, b) {
    if (!a && !b) {
        return true;
    }
    else if (!a || !b) {
        return false;
    }
    else if (Array.isArray(a) && Array.isArray(b)) {
        return equals(a, b, markdownStringEqual);
    }
    else if (isMarkdownString(a) && isMarkdownString(b)) {
        return markdownStringEqual(a, b);
    }
    else {
        return false;
    }
}
function markdownStringEqual(a, b) {
    if (a === b) {
        return true;
    }
    else if (!a || !b) {
        return false;
    }
    else {
        return a.value === b.value && a.isTrusted === b.isTrusted;
    }
}
export function removeMarkdownEscapes(text) {
    if (!text) {
        return text;
    }
    return text.replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1');
}
export function parseHrefAndDimensions(href) {
    var dimensions = [];
    var splitted = href.split('|').map(function (s) { return s.trim(); });
    href = splitted[0];
    var parameters = splitted[1];
    if (parameters) {
        var heightFromParams = /height=(\d+)/.exec(parameters);
        var widthFromParams = /width=(\d+)/.exec(parameters);
        var height = heightFromParams ? heightFromParams[1] : '';
        var width = widthFromParams ? widthFromParams[1] : '';
        var widthIsFinite = isFinite(parseInt(width));
        var heightIsFinite = isFinite(parseInt(height));
        if (widthIsFinite) {
            dimensions.push("width=\"" + width + "\"");
        }
        if (heightIsFinite) {
            dimensions.push("height=\"" + height + "\"");
        }
    }
    return { href: href, dimensions: dimensions };
}
