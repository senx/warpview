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

/* tslint:disable:no-console */

export class Logger {

  className: string;
  isDebug = false;

  constructor(className: any, isDebug: boolean = false) {
    this.className = className.name;
    this.isDebug = isDebug;
  }

  setDebug(debug: boolean) {
    this.isDebug = debug;
  }

  log(level: LEVEL, methods: any[], args: any[]) {
    let logChain = [];
    logChain.push(`[${new Date().toISOString()} - [${this.className}] ${methods.join(' - ')}`);
    logChain = logChain.concat(args);
    switch (level) {
      case LEVEL.DEBUG: {
        if (this.isDebug) {
          console.debug(...logChain);
        }
        break;
      }
      case LEVEL.ERROR: {
        console.error(...logChain);
        break;
      }
      case LEVEL.INFO: {
        console.log(...logChain);
        break;
      }
      case LEVEL.WARN: {
        console.warn(...logChain);
        break;
      }
      default: {
        if (this.isDebug) {
          console.log(...logChain);
        }
      }
    }
  }

  debug(methods: any[], ...args: any[]) {
    this.log(LEVEL.DEBUG, methods, args);
  }

  error(methods: any[], ...args: any[]) {
    this.log(LEVEL.ERROR, methods, args);
  }

  warn(methods: any[], ...args: any[]) {
    this.log(LEVEL.WARN, methods, args);
  }

  info(methods: any[], ...args: any[]) {
    this.log(LEVEL.INFO, methods, args);
  }
}

export enum LEVEL {
  DEBUG, ERROR, WARN, INFO
}
