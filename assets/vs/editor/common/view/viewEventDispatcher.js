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
var ViewEventDispatcher = /** @class */ (function () {
    function ViewEventDispatcher(eventHandlerGateKeeper) {
        this._eventHandlerGateKeeper = eventHandlerGateKeeper;
        this._eventHandlers = [];
        this._eventQueue = null;
        this._isConsumingQueue = false;
    }
    ViewEventDispatcher.prototype.addEventHandler = function (eventHandler) {
        for (var i = 0, len = this._eventHandlers.length; i < len; i++) {
            if (this._eventHandlers[i] === eventHandler) {
                console.warn('Detected duplicate listener in ViewEventDispatcher', eventHandler);
            }
        }
        this._eventHandlers.push(eventHandler);
    };
    ViewEventDispatcher.prototype.removeEventHandler = function (eventHandler) {
        for (var i = 0; i < this._eventHandlers.length; i++) {
            if (this._eventHandlers[i] === eventHandler) {
                this._eventHandlers.splice(i, 1);
                break;
            }
        }
    };
    ViewEventDispatcher.prototype.emit = function (event) {
        if (this._eventQueue) {
            this._eventQueue.push(event);
        }
        else {
            this._eventQueue = [event];
        }
        if (!this._isConsumingQueue) {
            this.consumeQueue();
        }
    };
    ViewEventDispatcher.prototype.emitMany = function (events) {
        if (this._eventQueue) {
            this._eventQueue = this._eventQueue.concat(events);
        }
        else {
            this._eventQueue = events;
        }
        if (!this._isConsumingQueue) {
            this.consumeQueue();
        }
    };
    ViewEventDispatcher.prototype.consumeQueue = function () {
        var _this = this;
        this._eventHandlerGateKeeper(function () {
            try {
                _this._isConsumingQueue = true;
                _this._doConsumeQueue();
            }
            finally {
                _this._isConsumingQueue = false;
            }
        });
    };
    ViewEventDispatcher.prototype._doConsumeQueue = function () {
        while (this._eventQueue) {
            // Empty event queue, as events might come in while sending these off
            var events = this._eventQueue;
            this._eventQueue = null;
            // Use a clone of the event handlers list, as they might remove themselves
            var eventHandlers = this._eventHandlers.slice(0);
            for (var i = 0, len = eventHandlers.length; i < len; i++) {
                eventHandlers[i].handleEvents(events);
            }
        }
    };
    return ViewEventDispatcher;
}());
export { ViewEventDispatcher };
