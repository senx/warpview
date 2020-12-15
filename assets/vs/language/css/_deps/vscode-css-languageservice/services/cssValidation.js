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
import { Range, DiagnosticSeverity } from '../../vscode-languageserver-types/main.js';
import { LintConfigurationSettings, Rules } from './lintRules.js';
import { LintVisitor } from './lint.js';
var CSSValidation = /** @class */ (function () {
    function CSSValidation() {
    }
    CSSValidation.prototype.configure = function (settings) {
        this.settings = settings;
    };
    CSSValidation.prototype.doValidation = function (document, stylesheet, settings) {
        if (settings === void 0) { settings = this.settings; }
        if (settings && settings.validate === false) {
            return [];
        }
        var entries = [];
        entries.push.apply(entries, nodes.ParseErrorCollector.entries(stylesheet));
        entries.push.apply(entries, LintVisitor.entries(stylesheet, document, new LintConfigurationSettings(settings && settings.lint)));
        var ruleIds = [];
        for (var r in Rules) {
            ruleIds.push(Rules[r].id);
        }
        function toDiagnostic(marker) {
            var range = Range.create(document.positionAt(marker.getOffset()), document.positionAt(marker.getOffset() + marker.getLength()));
            var source = document.languageId;
            return {
                code: marker.getRule().id,
                source: source,
                message: marker.getMessage(),
                severity: marker.getLevel() === nodes.Level.Warning ? DiagnosticSeverity.Warning : DiagnosticSeverity.Error,
                range: range
            };
        }
        return entries.filter(function (entry) { return entry.getLevel() !== nodes.Level.Ignore; }).map(toDiagnostic);
    };
    return CSSValidation;
}());
export { CSSValidation };
