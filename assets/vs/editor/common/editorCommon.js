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

/**
 * @internal
 */
export function isThemeColor(o) {
    return o && typeof o.id === 'string';
}
/**
 * The type of the `IEditor`.
 */
export var EditorType = {
    ICodeEditor: 'vs.editor.ICodeEditor',
    IDiffEditor: 'vs.editor.IDiffEditor'
};
/**
 * Built-in commands.
 * @internal
 */
export var Handler = {
    ExecuteCommand: 'executeCommand',
    ExecuteCommands: 'executeCommands',
    Type: 'type',
    ReplacePreviousChar: 'replacePreviousChar',
    CompositionStart: 'compositionStart',
    CompositionEnd: 'compositionEnd',
    Paste: 'paste',
    Cut: 'cut',
    Undo: 'undo',
    Redo: 'redo',
};
