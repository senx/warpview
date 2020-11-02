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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorHandler } from './http-error-handler.service';
import { Logger } from '../utils/logger';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./http-error-handler.service";
export class Warp10Service {
    constructor(http, httpErrorHandler) {
        this.http = http;
        this.httpErrorHandler = httpErrorHandler;
        this.LOG = new Logger(Warp10Service, true);
        this.handleError = httpErrorHandler.createHandleError('Warp10Service');
    }
    exec(warpScript, url) {
        this.LOG.debug(['exec', 'warpScript'], url, warpScript);
        return this.http.post(url, warpScript, {
            // @ts-ignore
            observe: 'response',
            // @ts-ignore
            responseType: 'text'
        })
            .pipe(tap(r => this.LOG.debug(['exec', 'result'], r)), catchError(this.handleError('exec')));
    }
}
Warp10Service.ɵprov = i0.ɵɵdefineInjectable({ factory: function Warp10Service_Factory() { return new Warp10Service(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.HttpErrorHandler)); }, token: Warp10Service, providedIn: "root" });
Warp10Service.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
Warp10Service.ctorParameters = () => [
    { type: HttpClient },
    { type: HttpErrorHandler }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycDEwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwLXZpZXcvcHJvamVjdHMvd2FycHZpZXctbmcvIiwic291cmNlcyI6WyJzcmMvbGliL3NlcnZpY2VzL3dhcnAxMC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQWUsTUFBTSxzQkFBc0IsQ0FBQztBQUM5RCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxVQUFVLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0MsT0FBTyxFQUFjLGdCQUFnQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDM0UsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7O0FBSXZDLE1BQU0sT0FBTyxhQUFhO0lBS3hCLFlBQ1UsSUFBZ0IsRUFDaEIsZ0JBQWtDO1FBRGxDLFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUMxQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsV0FBVyxHQUFHLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxJQUFJLENBQUMsVUFBa0IsRUFBRSxHQUFXO1FBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN4RCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFTLEdBQUcsRUFBRSxVQUFVLEVBQUU7WUFDN0MsYUFBYTtZQUNiLE9BQU8sRUFBRSxVQUFVO1lBQ25CLGFBQWE7WUFDYixZQUFZLEVBQUUsTUFBTTtTQUNyQixDQUFDO2FBQ0MsSUFBSSxDQUNILEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQy9DLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ0QsQ0FBQztJQUMxQyxDQUFDOzs7O1lBekJGLFVBQVUsU0FBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7OztZQVB4QixVQUFVO1lBR0csZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBSZXNwb25zZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Y2F0Y2hFcnJvciwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0hhbmRsZUVycm9yLCBIdHRwRXJyb3JIYW5kbGVyfSBmcm9tICcuL2h0dHAtZXJyb3ItaGFuZGxlci5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgV2FycDEwU2VydmljZSB7XG5cbiAgcHJpdmF0ZSBMT0c6IExvZ2dlcjtcbiAgcHJpdmF0ZSByZWFkb25seSBoYW5kbGVFcnJvcjogSGFuZGxlRXJyb3I7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByaXZhdGUgaHR0cEVycm9ySGFuZGxlcjogSHR0cEVycm9ySGFuZGxlcikge1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwMTBTZXJ2aWNlLCB0cnVlKTtcbiAgICB0aGlzLmhhbmRsZUVycm9yID0gaHR0cEVycm9ySGFuZGxlci5jcmVhdGVIYW5kbGVFcnJvcignV2FycDEwU2VydmljZScpO1xuICB9XG5cbiAgZXhlYyh3YXJwU2NyaXB0OiBzdHJpbmcsIHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8c3RyaW5nPj4ge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZXhlYycsICd3YXJwU2NyaXB0J10sIHVybCwgd2FycFNjcmlwdCk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PHN0cmluZz4odXJsLCB3YXJwU2NyaXB0LCB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBvYnNlcnZlOiAncmVzcG9uc2UnLFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcmVzcG9uc2VUeXBlOiAndGV4dCdcbiAgICB9KVxuICAgICAgLnBpcGUoXG4gICAgICAgIHRhcChyID0+IHRoaXMuTE9HLmRlYnVnKFsnZXhlYycsICdyZXN1bHQnXSwgcikpLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IoJ2V4ZWMnKSlcbiAgICAgICkgYXMgT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8c3RyaW5nPj47XG4gIH1cbn1cbiJdfQ==