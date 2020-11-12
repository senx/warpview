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
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { localize } from '../../../nls.js';
import Severity from '../../../base/common/severity.js';
export var MarkerSeverity;
(function (MarkerSeverity) {
    MarkerSeverity[MarkerSeverity["Hint"] = 1] = "Hint";
    MarkerSeverity[MarkerSeverity["Info"] = 2] = "Info";
    MarkerSeverity[MarkerSeverity["Warning"] = 4] = "Warning";
    MarkerSeverity[MarkerSeverity["Error"] = 8] = "Error";
})(MarkerSeverity || (MarkerSeverity = {}));
(function (MarkerSeverity) {
    function compare(a, b) {
        return b - a;
    }
    MarkerSeverity.compare = compare;
    var _displayStrings = Object.create(null);
    _displayStrings[MarkerSeverity.Error] = localize('sev.error', "Error");
    _displayStrings[MarkerSeverity.Warning] = localize('sev.warning', "Warning");
    _displayStrings[MarkerSeverity.Info] = localize('sev.info', "Info");
    function toString(a) {
        return _displayStrings[a] || '';
    }
    MarkerSeverity.toString = toString;
    function fromSeverity(severity) {
        switch (severity) {
            case Severity.Error: return MarkerSeverity.Error;
            case Severity.Warning: return MarkerSeverity.Warning;
            case Severity.Info: return MarkerSeverity.Info;
            case Severity.Ignore: return MarkerSeverity.Hint;
        }
    }
    MarkerSeverity.fromSeverity = fromSeverity;
    function toSeverity(severity) {
        switch (severity) {
            case MarkerSeverity.Error: return Severity.Error;
            case MarkerSeverity.Warning: return Severity.Warning;
            case MarkerSeverity.Info: return Severity.Info;
            case MarkerSeverity.Hint: return Severity.Ignore;
        }
    }
    MarkerSeverity.toSeverity = toSeverity;
})(MarkerSeverity || (MarkerSeverity = {}));
export var IMarkerData;
(function (IMarkerData) {
    var emptyString = '';
    function makeKey(markerData) {
        return makeKeyOptionalMessage(markerData, true);
    }
    IMarkerData.makeKey = makeKey;
    function makeKeyOptionalMessage(markerData, useMessage) {
        var result = [emptyString];
        if (markerData.source) {
            result.push(markerData.source.replace('¦', '\¦'));
        }
        else {
            result.push(emptyString);
        }
        if (markerData.code) {
            result.push(markerData.code.replace('¦', '\¦'));
        }
        else {
            result.push(emptyString);
        }
        if (markerData.severity !== undefined && markerData.severity !== null) {
            result.push(MarkerSeverity.toString(markerData.severity));
        }
        else {
            result.push(emptyString);
        }
        // Modifed to not include the message as part of the marker key to work around
        // https://github.com/microsoft/vscode/issues/77475
        if (markerData.message && useMessage) {
            result.push(markerData.message.replace('¦', '\¦'));
        }
        else {
            result.push(emptyString);
        }
        if (markerData.startLineNumber !== undefined && markerData.startLineNumber !== null) {
            result.push(markerData.startLineNumber.toString());
        }
        else {
            result.push(emptyString);
        }
        if (markerData.startColumn !== undefined && markerData.startColumn !== null) {
            result.push(markerData.startColumn.toString());
        }
        else {
            result.push(emptyString);
        }
        if (markerData.endLineNumber !== undefined && markerData.endLineNumber !== null) {
            result.push(markerData.endLineNumber.toString());
        }
        else {
            result.push(emptyString);
        }
        if (markerData.endColumn !== undefined && markerData.endColumn !== null) {
            result.push(markerData.endColumn.toString());
        }
        else {
            result.push(emptyString);
        }
        result.push(emptyString);
        return result.join('¦');
    }
    IMarkerData.makeKeyOptionalMessage = makeKeyOptionalMessage;
})(IMarkerData || (IMarkerData = {}));
export var IMarkerService = createDecorator('markerService');
