import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
/** Type of the handleError function returned by HttpErrorHandler.createHandleError */
export declare type HandleError = (operation?: string) => (error: HttpErrorResponse) => Observable<string>;
/** Handles HttpClient errors */
export declare class HttpErrorHandler {
    private LOG;
    /**
     */
    constructor();
    createHandleError: (serviceName?: string) => (operation?: string) => (error: HttpErrorResponse) => Observable<string>;
    handleError(serviceName?: string, operation?: string): (error: HttpErrorResponse) => Observable<string>;
}
