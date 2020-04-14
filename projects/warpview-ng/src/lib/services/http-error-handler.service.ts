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

import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs/internal/Observable';
import {of} from 'rxjs/internal/observable/of';
import {Logger} from '../utils/logger';


/** Type of the handleError function returned by HttpErrorHandler.createHandleError */
export type HandleError = (operation?: string) => (error: HttpErrorResponse) => Observable<string>;

// noinspection UnterminatedStatementJS
/** Handles HttpClient errors */
@Injectable()
export class HttpErrorHandler {
  private LOG: Logger;

  /**
   */
  constructor() {
    this.LOG = new Logger(HttpErrorHandler, true);
  }

  createHandleError = (serviceName = '') =>
    // tslint:disable-next-line:semicolon
    (operation = 'operation') => this.handleError(serviceName, operation);

  handleError(serviceName = '', operation = 'operation') {
    return (error: HttpErrorResponse): Observable<string> => {
      this.LOG.error([serviceName], error);
      this.LOG.error([serviceName], `${operation} failed: ${error.statusText}`);
      const message = ((error.error || {}).message)
        ? error.error.message
        : error.status ? error.statusText : 'Server error';
      this.LOG.error([serviceName], message);
      return of(message);
    };
  }
}
