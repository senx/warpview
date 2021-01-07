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
import { isWindows, isMacintosh, setImmediate } from './platform.js';
var safeProcess = (typeof process === 'undefined') ? {
    cwd: function () { return '/'; },
    env: Object.create(null),
    get platform() { return isWindows ? 'win32' : isMacintosh ? 'darwin' : 'linux'; },
    nextTick: function (callback) { return setImmediate(callback); }
} : process;
export var cwd = safeProcess.cwd;
export var env = safeProcess.env;
export var platform = safeProcess.platform;
