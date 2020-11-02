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
import { Injectable } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { Logger } from '../utils/logger';
// noinspection UnterminatedStatementJS
/** Handles HttpClient errors */
export class HttpErrorHandler {
    /**
     */
    constructor() {
        this.createHandleError = (serviceName = '') => 
        // tslint:disable-next-line:semicolon
        (operation = 'operation') => this.handleError(serviceName, operation);
        this.LOG = new Logger(HttpErrorHandler, true);
    }
    handleError(serviceName = '', operation = 'operation') {
        return (error) => {
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
HttpErrorHandler.decorators = [
    { type: Injectable }
];
HttpErrorHandler.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1lcnJvci1oYW5kbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwLXZpZXcvcHJvamVjdHMvd2FycHZpZXctbmcvIiwic291cmNlcyI6WyJzcmMvbGliL3NlcnZpY2VzL2h0dHAtZXJyb3ItaGFuZGxlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFJekMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQU12Qyx1Q0FBdUM7QUFDdkMsZ0NBQWdDO0FBRWhDLE1BQU0sT0FBTyxnQkFBZ0I7SUFHM0I7T0FDRztJQUNIO1FBSUEsc0JBQWlCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsRUFBRSxFQUFFLEVBQUU7UUFDdkMscUNBQXFDO1FBQ3JDLENBQUMsU0FBUyxHQUFHLFdBQVcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFMdEUsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBTUQsV0FBVyxDQUFDLFdBQVcsR0FBRyxFQUFFLEVBQUUsU0FBUyxHQUFHLFdBQVc7UUFDbkQsT0FBTyxDQUFDLEtBQXdCLEVBQXNCLEVBQUU7WUFDdEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsU0FBUyxZQUFZLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1lBQzFFLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDM0MsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTztnQkFDckIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztZQUNyRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQztJQUNKLENBQUM7OztZQXhCRixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIdHRwRXJyb3JSZXNwb25zZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMvaW50ZXJuYWwvT2JzZXJ2YWJsZSc7XG5pbXBvcnQge29mfSBmcm9tICdyeGpzL2ludGVybmFsL29ic2VydmFibGUvb2YnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uL3V0aWxzL2xvZ2dlcic7XG5cblxuLyoqIFR5cGUgb2YgdGhlIGhhbmRsZUVycm9yIGZ1bmN0aW9uIHJldHVybmVkIGJ5IEh0dHBFcnJvckhhbmRsZXIuY3JlYXRlSGFuZGxlRXJyb3IgKi9cbmV4cG9ydCB0eXBlIEhhbmRsZUVycm9yID0gKG9wZXJhdGlvbj86IHN0cmluZykgPT4gKGVycm9yOiBIdHRwRXJyb3JSZXNwb25zZSkgPT4gT2JzZXJ2YWJsZTxzdHJpbmc+O1xuXG4vLyBub2luc3BlY3Rpb24gVW50ZXJtaW5hdGVkU3RhdGVtZW50SlNcbi8qKiBIYW5kbGVzIEh0dHBDbGllbnQgZXJyb3JzICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSHR0cEVycm9ySGFuZGxlciB7XG4gIHByaXZhdGUgTE9HOiBMb2dnZXI7XG5cbiAgLyoqXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoSHR0cEVycm9ySGFuZGxlciwgdHJ1ZSk7XG4gIH1cblxuICBjcmVhdGVIYW5kbGVFcnJvciA9IChzZXJ2aWNlTmFtZSA9ICcnKSA9PlxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpzZW1pY29sb25cbiAgICAob3BlcmF0aW9uID0gJ29wZXJhdGlvbicpID0+IHRoaXMuaGFuZGxlRXJyb3Ioc2VydmljZU5hbWUsIG9wZXJhdGlvbik7XG5cbiAgaGFuZGxlRXJyb3Ioc2VydmljZU5hbWUgPSAnJywgb3BlcmF0aW9uID0gJ29wZXJhdGlvbicpIHtcbiAgICByZXR1cm4gKGVycm9yOiBIdHRwRXJyb3JSZXNwb25zZSk6IE9ic2VydmFibGU8c3RyaW5nPiA9PiB7XG4gICAgICB0aGlzLkxPRy5lcnJvcihbc2VydmljZU5hbWVdLCBlcnJvcik7XG4gICAgICB0aGlzLkxPRy5lcnJvcihbc2VydmljZU5hbWVdLCBgJHtvcGVyYXRpb259IGZhaWxlZDogJHtlcnJvci5zdGF0dXNUZXh0fWApO1xuICAgICAgY29uc3QgbWVzc2FnZSA9ICgoZXJyb3IuZXJyb3IgfHwge30pLm1lc3NhZ2UpXG4gICAgICAgID8gZXJyb3IuZXJyb3IubWVzc2FnZVxuICAgICAgICA6IGVycm9yLnN0YXR1cyA/IGVycm9yLnN0YXR1c1RleHQgOiAnU2VydmVyIGVycm9yJztcbiAgICAgIHRoaXMuTE9HLmVycm9yKFtzZXJ2aWNlTmFtZV0sIG1lc3NhZ2UpO1xuICAgICAgcmV0dXJuIG9mKG1lc3NhZ2UpO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==