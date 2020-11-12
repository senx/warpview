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
import { Event as BaseEvent, Emitter } from '../common/event.js';
export var domEvent = function (element, type, useCapture) {
    var fn = function (e) { return emitter.fire(e); };
    var emitter = new Emitter({
        onFirstListenerAdd: function () {
            element.addEventListener(type, fn, useCapture);
        },
        onLastListenerRemove: function () {
            element.removeEventListener(type, fn, useCapture);
        }
    });
    return emitter.event;
};
export function stop(event) {
    return BaseEvent.map(event, function (e) {
        e.preventDefault();
        e.stopPropagation();
        return e;
    });
}
