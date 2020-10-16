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
import * as nls from '../../../fillers/vscode-nls.js';
var localize = nls.loadMessageBundle();
var SCSSIssueType = /** @class */ (function () {
    function SCSSIssueType(id, message) {
        this.id = id;
        this.message = message;
    }
    return SCSSIssueType;
}());
export { SCSSIssueType };
export var SCSSParseError = {
    FromExpected: new SCSSIssueType('scss-fromexpected', localize('expected.from', "'from' expected")),
    ThroughOrToExpected: new SCSSIssueType('scss-throughexpected', localize('expected.through', "'through' or 'to' expected")),
    InExpected: new SCSSIssueType('scss-fromexpected', localize('expected.in', "'in' expected")),
};
