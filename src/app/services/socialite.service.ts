import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Provider } from '../models/socialite.model';



@Injectable({
  providedIn: 'root'
})
export class SocialiteService {

  serverUrl = `${environment.baseURL}/auth`;

  constructor(private http: HttpClient) { }

  loginWithSocialite(provider: any) {
    console.log(provider);
    return this.http.get(`${this.serverUrl}/${provider}`).pipe(
      catchError(this.handleError)
    );
  }

  loginFacebookCallback(providerData: any) {
    return this.http.get(`${this.serverUrl}/facebook/callback`, providerData)
      .pipe(map((res: any) => {  
        if (res.token) {
        localStorage.setItem('accessToken ', JSON.stringify(res.token));
        // this.userSubject.next(res);
        return res;
        }
      }),
      catchError(this.handleError)

    );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }

  // private providerSubject: BehaviorSubject<Provider>;
  // public provider: Observable<Provider>;

  // constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
  //   this.providerSubject = new BehaviorSubject<Provider>(null);
  //   this.provider = this.providerSubject.asObservable();
  // }

  // public get providerValue(): Provider {
  //   return this.providerSubject.value;
  // }

  // loginWithFacebook() {
  //   // login with facebook then authenticate with the API to get a JWT auth token
  //   this.facebookLogin().pipe(concatMap(accessToken => this.apiAuthenticate(accessToken))).subscribe(() => {
  //     // get return url from query parameters or default to home page
  //     const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  //     this.router.navigateByUrl(returnUrl);
  //   });
  // }

  // facebookLogin() {
  //   // login with facebook and return observable with fb access token on success
  //   return from(new Promise<fb.StatusResponse>(resolve => FB.login(resolve))).pipe(concatMap(({ authResponse }) => {
  //     if (!authResponse) return EMPTY;
  //     return of(authResponse.accessToken);
  //   }));
  // }

  // apiAuthenticate(accessToken: string) {
  //   // authenticate with the api using a facebook access token,
  //   // on success the api returns an provider object with a JWT auth token
  //   return this.http.post<any>(`${serverUrl}/authenticate`, { accessToken }).pipe(map(provider => {
  //     this.providerSubject.next(provider);
  //     this.startAuthenticateTimer();
  //     return provider;
  //   }));
  // }

  // logout() {
  //   // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
  //   FB.api('/me/permissions', 'delete', null, () => FB.logout());
  //   this.stopAuthenticateTimer();
  //   this.providerSubject.next(null);
  //   this.router.navigate(['/login']);
  // }

  // getAll() {
  //   return this.http.get<Provider[]>(serverUrl);
  // }

  // getById(id) {
  //   return this.http.get<Provider>(`${serverUrl}/${id}`);
  // }
    
  // update(id, params) {
  //   return this.http.put(`${serverUrl}/${id}`, params).pipe(map((provider: any) => {
  //     // update the current provider if it was updated
  //     if (provider.id === this.providerValue.id) {
  //       // publish updated provider to subscribers
  //       provider = { ...this.providerValue, ...provider };
  //       this.providerSubject.next(provider);
  //     }
  //     return provider;
  //   }));
  // }

  // delete(id: string) {
  //   return this.http.delete(`${serverUrl}/${id}`).pipe(finalize(() => {
  //     // auto logout if the logged in provider was deleted
  //     if (id === this.providerValue.id)
  //       this.logout();
  //   }));
  // }

  // // helper methods

  // private authenticateTimeout;

  // private startAuthenticateTimer() {
  //   // parse json object from base64 encoded jwt token
  //   const jwtToken = JSON.parse(atob(this.providerValue.token.split('.')[1]));

  //   // set a timeout to re-authenticate with the api one minute before the token expires
  //   const expires = new Date(jwtToken.exp * 1000);
  //   const timeout = expires.getTime() - Date.now() - (60 * 1000);
  //   const { accessToken } = FB.getAuthResponse();
  //   this.authenticateTimeout = setTimeout(() => {
  //     this.apiAuthenticate(accessToken).subscribe();
  //   }, timeout);
  // }

  // private stopAuthenticateTimer() {
  //   // cancel timer for re-authenticating with the api
  //   clearTimeout(this.authenticateTimeout);
  // }


}

