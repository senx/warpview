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
var InternalEditorAction = /** @class */ (function () {
    function InternalEditorAction(id, label, alias, precondition, run, contextKeyService) {
        this.id = id;
        this.label = label;
        this.alias = alias;
        this._precondition = precondition;
        this._run = run;
        this._contextKeyService = contextKeyService;
    }
    InternalEditorAction.prototype.isSupported = function () {
        return this._contextKeyService.contextMatchesRules(this._precondition);
    };
    InternalEditorAction.prototype.run = function () {
        if (!this.isSupported()) {
            return Promise.resolve(undefined);
        }
        var r = this._run();
        return r ? r : Promise.resolve(undefined);
    };
    return InternalEditorAction;
}());
export { InternalEditorAction };
