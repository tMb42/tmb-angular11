import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with token if user is logged in and request is to the api url
        // const user = this.auth.userValue;
        const isLoggedIn = this.auth.isLoggedIn();
        const isApiUrl = request.url.startsWith(environment.baseURL);
        if (isLoggedIn && isApiUrl) {
          const authKey = this.auth.getAuthorizationToken();
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${authKey}`
            }
          });
        }
        return next.handle(request);

    }
}
