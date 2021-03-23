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
import { Emitter } from '../common/event.js';
var WindowManager = /** @class */ (function () {
    function WindowManager() {
        // --- Zoom Level
        this._zoomLevel = 0;
        this._lastZoomLevelChangeTime = 0;
        this._onDidChangeZoomLevel = new Emitter();
        this.onDidChangeZoomLevel = this._onDidChangeZoomLevel.event;
    }
    WindowManager.prototype.getZoomLevel = function () {
        return this._zoomLevel;
    };
    WindowManager.prototype.getTimeSinceLastZoomLevelChanged = function () {
        return Date.now() - this._lastZoomLevelChangeTime;
    };
    // --- Pixel Ratio
    WindowManager.prototype.getPixelRatio = function () {
        var ctx = document.createElement('canvas').getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        var bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;
        return dpr / bsr;
    };
    WindowManager.INSTANCE = new WindowManager();
    return WindowManager;
}());
export function getZoomLevel() {
    return WindowManager.INSTANCE.getZoomLevel();
}
/** Returns the time (in ms) since the zoom level was changed */
export function getTimeSinceLastZoomLevelChanged() {
    return WindowManager.INSTANCE.getTimeSinceLastZoomLevelChanged();
}
export function onDidChangeZoomLevel(callback) {
    return WindowManager.INSTANCE.onDidChangeZoomLevel(callback);
}
export function getPixelRatio() {
    return WindowManager.INSTANCE.getPixelRatio();
}
var userAgent = navigator.userAgent;
export var isIE = (userAgent.indexOf('Trident') >= 0);
export var isEdge = (userAgent.indexOf('Edge/') >= 0);
export var isEdgeOrIE = isIE || isEdge;
export var isFirefox = (userAgent.indexOf('Firefox') >= 0);
export var isWebKit = (userAgent.indexOf('AppleWebKit') >= 0);
export var isChrome = (userAgent.indexOf('Chrome') >= 0);
export var isSafari = (!isChrome && (userAgent.indexOf('Safari') >= 0));
export var isWebkitWebView = (!isChrome && !isSafari && isWebKit);
export var isIPad = (userAgent.indexOf('iPad') >= 0);
export var isEdgeWebView = isEdge && (userAgent.indexOf('WebView/') >= 0);
export function hasClipboardSupport() {
    if (isIE) {
        return false;
    }
    if (isEdge) {
        var index = userAgent.indexOf('Edge/');
        var version = parseInt(userAgent.substring(index + 5, userAgent.indexOf('.', index)), 10);
        if (!version || (version >= 12 && version <= 16)) {
            return false;
        }
    }
    return true;
}
