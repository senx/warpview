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
import { URI } from '../../../base/common/uri.js';
import * as resources from '../../../base/common/resources.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { TernarySearchTree } from '../../../base/common/map.js';
export var IWorkspaceContextService = createDecorator('contextService');
export var IWorkspace;
(function (IWorkspace) {
    function isIWorkspace(thing) {
        return thing && typeof thing === 'object'
            && typeof thing.id === 'string'
            && Array.isArray(thing.folders);
    }
    IWorkspace.isIWorkspace = isIWorkspace;
})(IWorkspace || (IWorkspace = {}));
export var IWorkspaceFolder;
(function (IWorkspaceFolder) {
    function isIWorkspaceFolder(thing) {
        return thing && typeof thing === 'object'
            && URI.isUri(thing.uri)
            && typeof thing.name === 'string'
            && typeof thing.toResource === 'function';
    }
    IWorkspaceFolder.isIWorkspaceFolder = isIWorkspaceFolder;
})(IWorkspaceFolder || (IWorkspaceFolder = {}));
var Workspace = /** @class */ (function () {
    function Workspace(_id, folders, _configuration) {
        if (folders === void 0) { folders = []; }
        if (_configuration === void 0) { _configuration = null; }
        this._id = _id;
        this._configuration = _configuration;
        this._foldersMap = TernarySearchTree.forPaths();
        this.folders = folders;
    }
    Object.defineProperty(Workspace.prototype, "folders", {
        get: function () {
            return this._folders;
        },
        set: function (folders) {
            this._folders = folders;
            this.updateFoldersMap();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workspace.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Workspace.prototype, "configuration", {
        get: function () {
            return this._configuration;
        },
        set: function (configuration) {
            this._configuration = configuration;
        },
        enumerable: true,
        configurable: true
    });
    Workspace.prototype.getFolder = function (resource) {
        if (!resource) {
            return null;
        }
        return this._foldersMap.findSubstr(resource.with({
            scheme: resource.scheme,
            authority: resource.authority,
            path: resource.path
        }).toString()) || null;
    };
    Workspace.prototype.updateFoldersMap = function () {
        this._foldersMap = TernarySearchTree.forPaths();
        for (var _i = 0, _a = this.folders; _i < _a.length; _i++) {
            var folder = _a[_i];
            this._foldersMap.set(folder.uri.toString(), folder);
        }
    };
    Workspace.prototype.toJSON = function () {
        return { id: this.id, folders: this.folders, configuration: this.configuration };
    };
    return Workspace;
}());
export { Workspace };
var WorkspaceFolder = /** @class */ (function () {
    function WorkspaceFolder(data, raw) {
        this.raw = raw;
        this.uri = data.uri;
        this.index = data.index;
        this.name = data.name;
    }
    WorkspaceFolder.prototype.toResource = function (relativePath) {
        return resources.joinPath(this.uri, relativePath);
    };
    WorkspaceFolder.prototype.toJSON = function () {
        return { uri: this.uri, name: this.name, index: this.index };
    };
    return WorkspaceFolder;
}());
export { WorkspaceFolder };
