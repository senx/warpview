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
import { RawContextKey } from '../../platform/contextkey/common/contextkey.js';
export var EditorContextKeys;
(function (EditorContextKeys) {
    /**
     * A context key that is set when the editor's text has focus (cursor is blinking).
     */
    EditorContextKeys.editorTextFocus = new RawContextKey('editorTextFocus', false);
    /**
     * A context key that is set when the editor's text or an editor's widget has focus.
     */
    EditorContextKeys.focus = new RawContextKey('editorFocus', false);
    /**
     * A context key that is set when any editor input has focus (regular editor, repl input...).
     */
    EditorContextKeys.textInputFocus = new RawContextKey('textInputFocus', false);
    EditorContextKeys.readOnly = new RawContextKey('editorReadonly', false);
    EditorContextKeys.writable = EditorContextKeys.readOnly.toNegated();
    EditorContextKeys.hasNonEmptySelection = new RawContextKey('editorHasSelection', false);
    EditorContextKeys.hasOnlyEmptySelection = EditorContextKeys.hasNonEmptySelection.toNegated();
    EditorContextKeys.hasMultipleSelections = new RawContextKey('editorHasMultipleSelections', false);
    EditorContextKeys.hasSingleSelection = EditorContextKeys.hasMultipleSelections.toNegated();
    EditorContextKeys.tabMovesFocus = new RawContextKey('editorTabMovesFocus', false);
    EditorContextKeys.tabDoesNotMoveFocus = EditorContextKeys.tabMovesFocus.toNegated();
    EditorContextKeys.isInEmbeddedEditor = new RawContextKey('isInEmbeddedEditor', false);
    EditorContextKeys.canUndo = new RawContextKey('canUndo', false);
    EditorContextKeys.canRedo = new RawContextKey('canRedo', false);
    // -- mode context keys
    EditorContextKeys.languageId = new RawContextKey('editorLangId', '');
    EditorContextKeys.hasCompletionItemProvider = new RawContextKey('editorHasCompletionItemProvider', false);
    EditorContextKeys.hasCodeActionsProvider = new RawContextKey('editorHasCodeActionsProvider', false);
    EditorContextKeys.hasCodeLensProvider = new RawContextKey('editorHasCodeLensProvider', false);
    EditorContextKeys.hasDefinitionProvider = new RawContextKey('editorHasDefinitionProvider', false);
    EditorContextKeys.hasDeclarationProvider = new RawContextKey('editorHasDeclarationProvider', false);
    EditorContextKeys.hasImplementationProvider = new RawContextKey('editorHasImplementationProvider', false);
    EditorContextKeys.hasTypeDefinitionProvider = new RawContextKey('editorHasTypeDefinitionProvider', false);
    EditorContextKeys.hasHoverProvider = new RawContextKey('editorHasHoverProvider', false);
    EditorContextKeys.hasDocumentHighlightProvider = new RawContextKey('editorHasDocumentHighlightProvider', false);
    EditorContextKeys.hasDocumentSymbolProvider = new RawContextKey('editorHasDocumentSymbolProvider', false);
    EditorContextKeys.hasReferenceProvider = new RawContextKey('editorHasReferenceProvider', false);
    EditorContextKeys.hasRenameProvider = new RawContextKey('editorHasRenameProvider', false);
    EditorContextKeys.hasSignatureHelpProvider = new RawContextKey('editorHasSignatureHelpProvider', false);
    // -- mode context keys: formatting
    EditorContextKeys.hasDocumentFormattingProvider = new RawContextKey('editorHasDocumentFormattingProvider', false);
    EditorContextKeys.hasDocumentSelectionFormattingProvider = new RawContextKey('editorHasDocumentSelectionFormattingProvider', false);
    EditorContextKeys.hasMultipleDocumentFormattingProvider = new RawContextKey('editorHasMultipleDocumentFormattingProvider', false);
    EditorContextKeys.hasMultipleDocumentSelectionFormattingProvider = new RawContextKey('editorHasMultipleDocumentSelectionFormattingProvider', false);
})(EditorContextKeys || (EditorContextKeys = {}));
