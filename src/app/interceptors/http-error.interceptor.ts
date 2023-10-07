import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    private toastService: ToastrService;

    constructor() {
        this.toastService = inject(ToastrService);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMsg = '';
                if (error.error instanceof ErrorEvent) {
                    this.toastService.error(error.message, 'Client Error')
                } else {
                    this.toastService.error('Something went wrong on our site', 'Server Error')
                }
                return throwError(() => new Error(errorMsg))
            })
        );
    }
}