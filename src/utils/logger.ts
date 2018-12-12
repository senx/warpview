/*
 *  Copyright 2018  SenX S.A.S.
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

export class Logger {

  className: string;

  /**
   *
   * @param className
   */
  constructor(className: any) {
    this.className = className.name;
  }

  /**
   *
   * @param {string[]} message message
   * @param {LEVEL} level level
   * @param {string[]} methods methods
   */
  log(level: LEVEL, methods: string[], message: any) {
    const display = `[${this.className}] ${methods.join(' - ')}`;
    switch (level) {
      case LEVEL.DEBUG: {
        console.debug(display, message);
        break;
      }
      case LEVEL.ERROR: {
        console.error(display, message);
        break;
      }
      case LEVEL.INFO: {
        console.log(display, message);
        break;
      }
      case LEVEL.WARN: {
        console.warn(display, message);
        break;
      }
      default: {
        console.log(display, message);
      }
    }
  }

  /**
   *
   * @param {string[]} methods
   * @param message
   */
  debug(methods: string[], message: any) {
    this.log(LEVEL.DEBUG, methods, message);
  }

  /**
   *
   * @param {string[]} methods
   * @param message
   */
  error(methods: string[], message: any) {
    this.log(LEVEL.ERROR, methods, message);
  }

  /**
   *
   * @param {string[]} methods
   * @param message
   */
  warn(methods: string[], message: any) {
    this.log(LEVEL.WARN, methods, message);
  }

  /**
   *
   * @param {string[]} methods
   * @param message
   */
  info(methods: string[], message: any) {
    this.log(LEVEL.INFO, methods, message);
  }
}

/**
 *
 */
export enum LEVEL {
  DEBUG, ERROR, WARN, INFO
}
