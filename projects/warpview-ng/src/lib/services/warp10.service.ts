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

import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {HandleError, HttpErrorHandler} from './http-error-handler.service';
import {Logger} from '../utils/logger';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class Warp10Service {

  private LOG: Logger;
  private readonly handleError: HandleError;

  constructor(
    private http: HttpClient,
    private httpErrorHandler: HttpErrorHandler) {
    this.LOG = new Logger(Warp10Service, true);
    this.handleError = httpErrorHandler.createHandleError('Warp10Service');
  }

  exec(warpScript: string, url: string): Observable<HttpResponse<string>> {
    this.LOG.debug(['exec', 'warpScript'], url, warpScript);
    return this.http.post<string>(url, warpScript, {
      // @ts-ignore
      observe: 'response',
      // @ts-ignore
      responseType: 'text'
    })
      .pipe(
        tap(r => this.LOG.debug(['exec', 'result'], r)),
        catchError(this.handleError('exec'))
      );
  }
}
