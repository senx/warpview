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
import './list.css';
import { range } from '../../../common/arrays.js';
import { List } from './listWidget.js';
import { CancellationTokenSource } from '../../../common/cancellation.js';
var PagedRenderer = /** @class */ (function () {
    function PagedRenderer(renderer, modelProvider) {
        this.renderer = renderer;
        this.modelProvider = modelProvider;
    }
    Object.defineProperty(PagedRenderer.prototype, "templateId", {
        get: function () { return this.renderer.templateId; },
        enumerable: true,
        configurable: true
    });
    PagedRenderer.prototype.renderTemplate = function (container) {
        var data = this.renderer.renderTemplate(container);
        return { data: data, disposable: { dispose: function () { } } };
    };
    PagedRenderer.prototype.renderElement = function (index, _, data, height) {
        var _this = this;
        if (data.disposable) {
            data.disposable.dispose();
        }
        if (!data.data) {
            return;
        }
        var model = this.modelProvider();
        if (model.isResolved(index)) {
            return this.renderer.renderElement(model.get(index), index, data.data, height);
        }
        var cts = new CancellationTokenSource();
        var promise = model.resolve(index, cts.token);
        data.disposable = { dispose: function () { return cts.cancel(); } };
        this.renderer.renderPlaceholder(index, data.data);
        promise.then(function (entry) { return _this.renderer.renderElement(entry, index, data.data, height); });
    };
    PagedRenderer.prototype.disposeTemplate = function (data) {
        if (data.disposable) {
            data.disposable.dispose();
            data.disposable = undefined;
        }
        if (data.data) {
            this.renderer.disposeTemplate(data.data);
            data.data = undefined;
        }
    };
    return PagedRenderer;
}());
var PagedList = /** @class */ (function () {
    function PagedList(container, virtualDelegate, renderers, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var pagedRenderers = renderers.map(function (r) { return new PagedRenderer(r, function () { return _this.model; }); });
        this.list = new List(container, virtualDelegate, pagedRenderers, options);
    }
    PagedList.prototype.getHTMLElement = function () {
        return this.list.getHTMLElement();
    };
    Object.defineProperty(PagedList.prototype, "onDidFocus", {
        get: function () {
            return this.list.onDidFocus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagedList.prototype, "onDidDispose", {
        get: function () {
            return this.list.onDidDispose;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagedList.prototype, "model", {
        get: function () {
            return this._model;
        },
        set: function (model) {
            this._model = model;
            this.list.splice(0, this.list.length, range(model.length));
        },
        enumerable: true,
        configurable: true
    });
    PagedList.prototype.getFocus = function () {
        return this.list.getFocus();
    };
    PagedList.prototype.dispose = function () {
        this.list.dispose();
    };
    return PagedList;
}());
export { PagedList };
