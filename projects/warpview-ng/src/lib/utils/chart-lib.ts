/*
 *  Copyright 2020  SenX S.A.S.
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
 *
 */

// @dynamic
export class ChartLib {

  static DEFAULT_WIDTH = 640;
  static DEFAULT_HEIGHT = 480;

  static mergeDeep<T>(base: T, extended: any) {
    base = base || {} as T;
    for (const prop in extended || {}) {
      if (extended.hasOwnProperty(prop)) {
        // If property is an object, merge properties
        if (Object.prototype.toString.call(extended[prop]) === '[object Object]') {
          base[prop] = ChartLib.mergeDeep<T>(base[prop], extended[prop]);
        } else {
          base[prop] = extended[prop];
        }
      }
    }
    return base as T;
  }


}
