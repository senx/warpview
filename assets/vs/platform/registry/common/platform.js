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
import * as Types from '../../../base/common/types.js';
import * as Assert from '../../../base/common/assert.js';
var RegistryImpl = /** @class */ (function () {
    function RegistryImpl() {
        this.data = new Map();
    }
    RegistryImpl.prototype.add = function (id, data) {
        Assert.ok(Types.isString(id));
        Assert.ok(Types.isObject(data));
        Assert.ok(!this.data.has(id), 'There is already an extension with this id');
        this.data.set(id, data);
    };
    RegistryImpl.prototype.as = function (id) {
        return this.data.get(id) || null;
    };
    return RegistryImpl;
}());
export var Registry = new RegistryImpl();
