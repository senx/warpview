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
export var browserNames = {
    E: 'Edge',
    FF: 'Firefox',
    S: 'Safari',
    C: 'Chrome',
    IE: 'IE',
    O: 'Opera'
};
function getEntryStatus(status) {
    switch (status) {
        case 'experimental':
            return '⚠️ Property is experimental. Be cautious when using it.️\n\n';
        case 'nonstandard':
            return '🚨️ Property is nonstandard. Avoid using it.\n\n';
        case 'obsolete':
            return '🚨️️️ Property is obsolete. Avoid using it.\n\n';
        default:
            return '';
    }
}
export function getEntryDescription(entry) {
    if (!entry.description || entry.description === '') {
        return null;
    }
    var result = '';
    if (entry.status) {
        result += getEntryStatus(entry.status);
    }
    result += entry.description;
    var browserLabel = getBrowserLabel(entry.browsers);
    if (browserLabel) {
        result += '\n(' + browserLabel + ')';
    }
    if ('syntax' in entry) {
        result += "\n\nSyntax: " + entry.syntax;
    }
    return result;
}
/**
 * Input is like `["E12","FF49","C47","IE","O"]`
 * Output is like `Edge 12, Firefox 49, Chrome 47, IE, Opera`
 */
export function getBrowserLabel(browsers) {
    if (!browsers || browsers.length === 0) {
        return null;
    }
    return browsers
        .map(function (b) {
        var result = '';
        var matches = b.match(/([A-Z]+)(\d+)?/);
        var name = matches[1];
        var version = matches[2];
        if (name in browserNames) {
            result += browserNames[name];
        }
        if (version) {
            result += ' ' + version;
        }
        return result;
    })
        .join(', ');
}
