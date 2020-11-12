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
import * as nls from '../../nls.js';
import * as strings from './strings.js';
var Severity;
(function (Severity) {
    Severity[Severity["Ignore"] = 0] = "Ignore";
    Severity[Severity["Info"] = 1] = "Info";
    Severity[Severity["Warning"] = 2] = "Warning";
    Severity[Severity["Error"] = 3] = "Error";
})(Severity || (Severity = {}));
(function (Severity) {
    var _error = 'error';
    var _warning = 'warning';
    var _warn = 'warn';
    var _info = 'info';
    var _displayStrings = Object.create(null);
    _displayStrings[Severity.Error] = nls.localize('sev.error', "Error");
    _displayStrings[Severity.Warning] = nls.localize('sev.warning', "Warning");
    _displayStrings[Severity.Info] = nls.localize('sev.info', "Info");
    /**
     * Parses 'error', 'warning', 'warn', 'info' in call casings
     * and falls back to ignore.
     */
    function fromValue(value) {
        if (!value) {
            return Severity.Ignore;
        }
        if (strings.equalsIgnoreCase(_error, value)) {
            return Severity.Error;
        }
        if (strings.equalsIgnoreCase(_warning, value) || strings.equalsIgnoreCase(_warn, value)) {
            return Severity.Warning;
        }
        if (strings.equalsIgnoreCase(_info, value)) {
            return Severity.Info;
        }
        return Severity.Ignore;
    }
    Severity.fromValue = fromValue;
})(Severity || (Severity = {}));
export default Severity;
