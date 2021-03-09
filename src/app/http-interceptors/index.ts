import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';

export const httpInterceptorProviders = [
    {   provide: HTTP_INTERCEPTORS, 
        useClass: AuthInterceptor, ErrorInterceptor, 
        multi: true 
    }
];