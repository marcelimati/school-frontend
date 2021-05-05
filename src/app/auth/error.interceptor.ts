import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router
        ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401(unauthorized) response returned from api
                this.authService.logout();
                //location.reload(true);
            }
            if (err.status === 403) {
                this.router.navigate(['/']);
            }
            if (err.status === 404) {
                this.router.navigate(['/404']);
            }
            if (err.status === 500) {
                this.router.navigate(['/404']);
            }
            
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}