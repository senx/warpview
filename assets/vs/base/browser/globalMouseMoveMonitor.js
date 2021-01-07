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
import * as dom from './dom.js';
import { IframeUtils } from './iframe.js';
import { StandardMouseEvent } from './mouseEvent.js';
import { DisposableStore } from '../common/lifecycle.js';
export function standardMouseMoveMerger(lastEvent, currentEvent) {
    var ev = new StandardMouseEvent(currentEvent);
    ev.preventDefault();
    return {
        leftButton: ev.leftButton,
        posx: ev.posx,
        posy: ev.posy
    };
}
var GlobalMouseMoveMonitor = /** @class */ (function () {
    function GlobalMouseMoveMonitor() {
        this.hooks = new DisposableStore();
        this.mouseMoveEventMerger = null;
        this.mouseMoveCallback = null;
        this.onStopCallback = null;
    }
    GlobalMouseMoveMonitor.prototype.dispose = function () {
        this.stopMonitoring(false);
        this.hooks.dispose();
    };
    GlobalMouseMoveMonitor.prototype.stopMonitoring = function (invokeStopCallback) {
        if (!this.isMonitoring()) {
            // Not monitoring
            return;
        }
        // Unhook
        this.hooks.clear();
        this.mouseMoveEventMerger = null;
        this.mouseMoveCallback = null;
        var onStopCallback = this.onStopCallback;
        this.onStopCallback = null;
        if (invokeStopCallback && onStopCallback) {
            onStopCallback();
        }
    };
    GlobalMouseMoveMonitor.prototype.isMonitoring = function () {
        return !!this.mouseMoveEventMerger;
    };
    GlobalMouseMoveMonitor.prototype.startMonitoring = function (mouseMoveEventMerger, mouseMoveCallback, onStopCallback) {
        var _this = this;
        if (this.isMonitoring()) {
            // I am already hooked
            return;
        }
        this.mouseMoveEventMerger = mouseMoveEventMerger;
        this.mouseMoveCallback = mouseMoveCallback;
        this.onStopCallback = onStopCallback;
        var windowChain = IframeUtils.getSameOriginWindowChain();
        for (var _i = 0, windowChain_1 = windowChain; _i < windowChain_1.length; _i++) {
            var element = windowChain_1[_i];
            this.hooks.add(dom.addDisposableThrottledListener(element.window.document, 'mousemove', function (data) { return _this.mouseMoveCallback(data); }, function (lastEvent, currentEvent) { return _this.mouseMoveEventMerger(lastEvent, currentEvent); }));
            this.hooks.add(dom.addDisposableListener(element.window.document, 'mouseup', function (e) { return _this.stopMonitoring(true); }));
        }
        if (IframeUtils.hasDifferentOriginAncestor()) {
            var lastSameOriginAncestor = windowChain[windowChain.length - 1];
            // We might miss a mouse up if it happens outside the iframe
            // This one is for Chrome
            this.hooks.add(dom.addDisposableListener(lastSameOriginAncestor.window.document, 'mouseout', function (browserEvent) {
                var e = new StandardMouseEvent(browserEvent);
                if (e.target.tagName.toLowerCase() === 'html') {
                    _this.stopMonitoring(true);
                }
            }));
            // This one is for FF
            this.hooks.add(dom.addDisposableListener(lastSameOriginAncestor.window.document, 'mouseover', function (browserEvent) {
                var e = new StandardMouseEvent(browserEvent);
                if (e.target.tagName.toLowerCase() === 'html') {
                    _this.stopMonitoring(true);
                }
            }));
            // This one is for IE
            this.hooks.add(dom.addDisposableListener(lastSameOriginAncestor.window.document.body, 'mouseleave', function (browserEvent) {
                _this.stopMonitoring(true);
            }));
        }
    };
    return GlobalMouseMoveMonitor;
}());
export { GlobalMouseMoveMonitor };
