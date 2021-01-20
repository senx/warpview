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
import { Range, TextEdit, Position } from '../vscode-languageserver-types/main.js';
export { Range, TextEdit, Position };
// #region Proposed types, remove once added to vscode-languageserver-types
/**
 * Enum of known selection range kinds
 */
export var SelectionRangeKind;
(function (SelectionRangeKind) {
    /**
     * Empty Kind.
     */
    SelectionRangeKind["Empty"] = "";
    /**
     * The statment kind, its value is `statement`, possible extensions can be
     * `statement.if` etc
     */
    SelectionRangeKind["Statement"] = "statement";
    /**
     * The declaration kind, its value is `declaration`, possible extensions can be
     * `declaration.function`, `declaration.class` etc.
     */
    SelectionRangeKind["Declaration"] = "declaration";
})(SelectionRangeKind || (SelectionRangeKind = {}));
