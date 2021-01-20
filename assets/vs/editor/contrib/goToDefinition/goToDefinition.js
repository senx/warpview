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
import { flatten, coalesce } from '../../../base/common/arrays.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../base/common/errors.js';
import { registerDefaultLanguageCommand } from '../../browser/editorExtensions.js';
import { DefinitionProviderRegistry, ImplementationProviderRegistry, TypeDefinitionProviderRegistry, DeclarationProviderRegistry } from '../../common/modes.js';
function getDefinitions(model, position, registry, provide) {
    var provider = registry.ordered(model);
    // get results
    var promises = provider.map(function (provider) {
        return Promise.resolve(provide(provider, model, position)).then(undefined, function (err) {
            onUnexpectedExternalError(err);
            return undefined;
        });
    });
    return Promise.all(promises)
        .then(flatten)
        .then(coalesce);
}
export function getDefinitionsAtPosition(model, position, token) {
    return getDefinitions(model, position, DefinitionProviderRegistry, function (provider, model, position) {
        return provider.provideDefinition(model, position, token);
    });
}
export function getDeclarationsAtPosition(model, position, token) {
    return getDefinitions(model, position, DeclarationProviderRegistry, function (provider, model, position) {
        return provider.provideDeclaration(model, position, token);
    });
}
export function getImplementationsAtPosition(model, position, token) {
    return getDefinitions(model, position, ImplementationProviderRegistry, function (provider, model, position) {
        return provider.provideImplementation(model, position, token);
    });
}
export function getTypeDefinitionsAtPosition(model, position, token) {
    return getDefinitions(model, position, TypeDefinitionProviderRegistry, function (provider, model, position) {
        return provider.provideTypeDefinition(model, position, token);
    });
}
registerDefaultLanguageCommand('_executeDefinitionProvider', function (model, position) { return getDefinitionsAtPosition(model, position, CancellationToken.None); });
registerDefaultLanguageCommand('_executeDeclarationProvider', function (model, position) { return getDeclarationsAtPosition(model, position, CancellationToken.None); });
registerDefaultLanguageCommand('_executeImplementationProvider', function (model, position) { return getImplementationsAtPosition(model, position, CancellationToken.None); });
registerDefaultLanguageCommand('_executeTypeDefinitionProvider', function (model, position) { return getTypeDefinitionsAtPosition(model, position, CancellationToken.None); });
