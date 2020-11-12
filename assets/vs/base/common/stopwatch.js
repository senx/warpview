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
import { globals } from './platform.js';
var hasPerformanceNow = (globals.performance && typeof globals.performance.now === 'function');
var StopWatch = /** @class */ (function () {
    function StopWatch(highResolution) {
        this._highResolution = hasPerformanceNow && highResolution;
        this._startTime = this._now();
        this._stopTime = -1;
    }
    StopWatch.create = function (highResolution) {
        if (highResolution === void 0) { highResolution = true; }
        return new StopWatch(highResolution);
    };
    StopWatch.prototype.stop = function () {
        this._stopTime = this._now();
    };
    StopWatch.prototype.elapsed = function () {
        if (this._stopTime !== -1) {
            return this._stopTime - this._startTime;
        }
        return this._now() - this._startTime;
    };
    StopWatch.prototype._now = function () {
        return this._highResolution ? globals.performance.now() : new Date().getTime();
    };
    return StopWatch;
}());
export { StopWatch };
