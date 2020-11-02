import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpErrorHandler } from './http-error-handler.service';
import { Observable } from 'rxjs';
export declare class Warp10Service {
    private http;
    private httpErrorHandler;
    private LOG;
    private readonly handleError;
    constructor(http: HttpClient, httpErrorHandler: HttpErrorHandler);
    exec(warpScript: string, url: string): Observable<HttpResponse<string>>;
}
