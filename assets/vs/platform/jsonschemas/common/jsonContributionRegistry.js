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
import * as platform from '../../registry/common/platform.js';
import { Emitter } from '../../../base/common/event.js';
export var Extensions = {
    JSONContribution: 'base.contributions.json'
};
function normalizeId(id) {
    if (id.length > 0 && id.charAt(id.length - 1) === '#') {
        return id.substring(0, id.length - 1);
    }
    return id;
}
var JSONContributionRegistry = /** @class */ (function () {
    function JSONContributionRegistry() {
        this._onDidChangeSchema = new Emitter();
        this.schemasById = {};
    }
    JSONContributionRegistry.prototype.registerSchema = function (uri, unresolvedSchemaContent) {
        this.schemasById[normalizeId(uri)] = unresolvedSchemaContent;
        this._onDidChangeSchema.fire(uri);
    };
    JSONContributionRegistry.prototype.notifySchemaChanged = function (uri) {
        this._onDidChangeSchema.fire(uri);
    };
    return JSONContributionRegistry;
}());
var jsonContributionRegistry = new JSONContributionRegistry();
platform.Registry.add(Extensions.JSONContribution, jsonContributionRegistry);
