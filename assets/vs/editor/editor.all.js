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
import './browser/controller/coreCommands.js';
import './browser/widget/codeEditorWidget.js';
import './browser/widget/diffEditorWidget.js';
import './browser/widget/diffNavigator.js';
import './contrib/bracketMatching/bracketMatching.js';
import './contrib/caretOperations/caretOperations.js';
import './contrib/caretOperations/transpose.js';
import './contrib/clipboard/clipboard.js';
import './contrib/codeAction/codeActionContributions.js';
import './contrib/codelens/codelensController.js';
import './contrib/colorPicker/colorDetector.js';
import './contrib/comment/comment.js';
import './contrib/contextmenu/contextmenu.js';
import './contrib/cursorUndo/cursorUndo.js';
import './contrib/dnd/dnd.js';
import './contrib/find/findController.js';
import './contrib/folding/folding.js';
import './contrib/fontZoom/fontZoom.js';
import './contrib/format/formatActions.js';
import './contrib/goToDefinition/goToDefinitionCommands.js';
import './contrib/goToDefinition/goToDefinitionMouse.js';
import './contrib/gotoError/gotoError.js';
import './contrib/hover/hover.js';
import './contrib/inPlaceReplace/inPlaceReplace.js';
import './contrib/linesOperations/linesOperations.js';
import './contrib/links/links.js';
import './contrib/multicursor/multicursor.js';
import './contrib/parameterHints/parameterHints.js';
import './contrib/referenceSearch/referenceSearch.js';
import './contrib/rename/rename.js';
import './contrib/smartSelect/smartSelect.js';
import './contrib/snippet/snippetController2.js';
import './contrib/suggest/suggestController.js';
import './contrib/tokenization/tokenization.js';
import './contrib/toggleTabFocusMode/toggleTabFocusMode.js';
import './contrib/wordHighlighter/wordHighlighter.js';
import './contrib/wordOperations/wordOperations.js';
import './contrib/wordPartOperations/wordPartOperations.js';
// Load up these strings even in VSCode, even if they are not used
// in order to get them translated
import './common/standaloneStrings.js';
