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
import * as nls from '../../../nls.js';
import { Emitter } from '../../../base/common/event.js';
import { LanguageIdentifier } from '../modes.js';
import { LanguageConfigurationRegistry } from './languageConfigurationRegistry.js';
import { Registry } from '../../../platform/registry/common/platform.js';
// Define extension point ids
export var Extensions = {
    ModesRegistry: 'editor.modesRegistry'
};
var EditorModesRegistry = /** @class */ (function () {
    function EditorModesRegistry() {
        this._onDidChangeLanguages = new Emitter();
        this.onDidChangeLanguages = this._onDidChangeLanguages.event;
        this._languages = [];
        this._dynamicLanguages = [];
    }
    // --- languages
    EditorModesRegistry.prototype.registerLanguage = function (def) {
        this._languages.push(def);
        this._onDidChangeLanguages.fire(undefined);
    };
    EditorModesRegistry.prototype.getLanguages = function () {
        return [].concat(this._languages).concat(this._dynamicLanguages);
    };
    return EditorModesRegistry;
}());
export { EditorModesRegistry };
export var ModesRegistry = new EditorModesRegistry();
Registry.add(Extensions.ModesRegistry, ModesRegistry);
export var PLAINTEXT_MODE_ID = 'plaintext';
export var PLAINTEXT_LANGUAGE_IDENTIFIER = new LanguageIdentifier(PLAINTEXT_MODE_ID, 1 /* PlainText */);
ModesRegistry.registerLanguage({
    id: PLAINTEXT_MODE_ID,
    extensions: ['.txt', '.gitignore'],
    aliases: [nls.localize('plainText.alias', "Plain Text"), 'text'],
    mimetypes: ['text/plain']
});
LanguageConfigurationRegistry.register(PLAINTEXT_LANGUAGE_IDENTIFIER, {
    brackets: [
        ['(', ')'],
        ['[', ']'],
        ['{', '}'],
    ]
});
