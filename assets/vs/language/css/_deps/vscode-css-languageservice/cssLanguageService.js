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
import { Parser } from './parser/cssParser.js';
import { CSSCompletion } from './services/cssCompletion.js';
import { CSSHover } from './services/cssHover.js';
import { CSSNavigation } from './services/cssNavigation.js';
import { CSSCodeActions } from './services/cssCodeActions.js';
import { CSSValidation } from './services/cssValidation.js';
import { SCSSParser } from './parser/scssParser.js';
import { SCSSCompletion } from './services/scssCompletion.js';
import { LESSParser } from './parser/lessParser.js';
import { LESSCompletion } from './services/lessCompletion.js';
import { getFoldingRanges } from './services/cssFolding.js';
import { cssDataManager } from './languageFacts/facts.js';
import { getSelectionRanges } from './services/cssSelectionRange.js';
export * from './cssLanguageTypes.js';
export * from '../vscode-languageserver-types/main.js';
function createFacade(parser, completion, hover, navigation, codeActions, validation) {
    return {
        configure: validation.configure.bind(validation),
        doValidation: validation.doValidation.bind(validation),
        parseStylesheet: parser.parseStylesheet.bind(parser),
        doComplete: completion.doComplete.bind(completion),
        setCompletionParticipants: completion.setCompletionParticipants.bind(completion),
        doHover: hover.doHover.bind(hover),
        findDefinition: navigation.findDefinition.bind(navigation),
        findReferences: navigation.findReferences.bind(navigation),
        findDocumentHighlights: navigation.findDocumentHighlights.bind(navigation),
        findDocumentLinks: navigation.findDocumentLinks.bind(navigation),
        findDocumentSymbols: navigation.findDocumentSymbols.bind(navigation),
        doCodeActions: codeActions.doCodeActions.bind(codeActions),
        doCodeActions2: codeActions.doCodeActions2.bind(codeActions),
        findColorSymbols: function (d, s) { return navigation.findDocumentColors(d, s).map(function (s) { return s.range; }); },
        findDocumentColors: navigation.findDocumentColors.bind(navigation),
        getColorPresentations: navigation.getColorPresentations.bind(navigation),
        doRename: navigation.doRename.bind(navigation),
        getFoldingRanges: getFoldingRanges,
        getSelectionRanges: getSelectionRanges
    };
}
function handleCustomData(options) {
    if (options && options.customDataProviders) {
        cssDataManager.addDataProviders(options.customDataProviders);
    }
}
export function getCSSLanguageService(options) {
    handleCustomData(options);
    return createFacade(new Parser(), new CSSCompletion(), new CSSHover(), new CSSNavigation(), new CSSCodeActions(), new CSSValidation());
}
export function getSCSSLanguageService(options) {
    handleCustomData(options);
    return createFacade(new SCSSParser(), new SCSSCompletion(), new CSSHover(), new CSSNavigation(), new CSSCodeActions(), new CSSValidation());
}
export function getLESSLanguageService(options) {
    handleCustomData(options);
    return createFacade(new LESSParser(), new LESSCompletion(), new CSSHover(), new CSSNavigation(), new CSSCodeActions(), new CSSValidation());
}
