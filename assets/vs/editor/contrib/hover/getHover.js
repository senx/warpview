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
import { coalesce } from '../../../base/common/arrays.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../base/common/errors.js';
import { registerDefaultLanguageCommand } from '../../browser/editorExtensions.js';
import { HoverProviderRegistry } from '../../common/modes.js';
export function getHover(model, position, token) {
    var supports = HoverProviderRegistry.ordered(model);
    var promises = supports.map(function (support) {
        return Promise.resolve(support.provideHover(model, position, token)).then(function (hover) {
            return hover && isValid(hover) ? hover : undefined;
        }, function (err) {
            onUnexpectedExternalError(err);
            return undefined;
        });
    });
    return Promise.all(promises).then(coalesce);
}
registerDefaultLanguageCommand('_executeHoverProvider', function (model, position) { return getHover(model, position, CancellationToken.None); });
function isValid(result) {
    var hasRange = (typeof result.range !== 'undefined');
    var hasHtmlContent = typeof result.contents !== 'undefined' && result.contents && result.contents.length > 0;
    return hasRange && hasHtmlContent;
}
