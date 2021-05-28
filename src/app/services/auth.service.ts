import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthUser } from '../models/auth-user.model';


export interface AuthResponseData {
  success: number,
  message: string,
  userData: {
    token: string,
    // user: {
      first_name: string,
      middle_name: string,
      last_name: string,
      name: string,
      email: string,
      password: string,
      password_confirmation: string,
      device_name: string,
      roles: string,
      roleId: string,
      id: number,
      dob: Date,
      designation_id: number,
      department_id: number,
    // };
  };

}


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  serverUrl = environment.baseURL;

  url: string;
  authUser: AuthUser = null;
  authUserSubject = new Subject<AuthUser>();

  private userSubject: BehaviorSubject<AuthResponseData>;
  public user: Observable<AuthResponseData>;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<AuthResponseData>(JSON.parse(localStorage.getItem('authToken')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): AuthResponseData {
    return this.userSubject.value;
  }

  isAuthenticated(){
    if (this.user){
      return true;
    }else{
      return false;
    }
  }

  getAuthUserUpdateListener() {
    return this.authUserSubject.asObservable();
  }

  login(loginData) {
    return this.http.post<AuthResponseData>(`${this.serverUrl}/login`, loginData)
      .pipe(map((resData: any) => {
        // store user details and token in local storage to keep user logged in between page refreshes
        localStorage.setItem('authToken', JSON.stringify(resData));
        this.userSubject.next({...resData});
      }),
      catchError(this.handleError)

    );
  }

  isLoggedIn() {
    if (localStorage.getItem('authToken')) {
      return true;
    }
      return false;
  }

  getAuthorizationToken() {
    const token_key = JSON.parse(localStorage.getItem('authToken'));
    return token_key.token;
  }

  logout() {
    return this.http.post<any>(`${this.serverUrl}/logout`, {})
      .pipe(catchError(this.handleError), tap(() => {
        this.userSubject.next(null);
        // remove authToken from local storage and set current user to null
        localStorage.removeItem('authToken');
        this.router.navigate(['/auth']);
      })
    );

  }

  register(registerData) {
    return this.http.post<any>(`${this.serverUrl}/register`, registerData);
  }

  getAuthUser() {
    return this.http.get<AuthUser>(`${this.serverUrl}/userDetails`)
      .pipe(catchError(this.handleError), tap((res: any) => {
        this.authUser = res.data;
      })
    );
  }

  getEmailVarification(model: any) {
    return this.http.get(`${this.serverUrl}/email/verify/${model.userId}/${model.token}`, { params: { id: model.userId, hash: model.token }});
  }

  checkRegisteredMobile(mobile: number) {
    return this.http.get<any>(`${this.serverUrl}/checkMobile/${mobile}`);
  }

  getCompaireGradationListBirthDate(model) {
    return this.http.get<any>(`${this.serverUrl}/checkBithday/${model.designation}/${model.birthDate}/${model.lastname}`).pipe(
    catchError(this.handleError)
    );
  }

  sendPasswordResetLinkToEmail(payload: any) {
    return this.http.post<any>(`${this.serverUrl}/password/email`, payload).pipe(
    catchError(this.handleError)
    );
  }

  resetPassword(resetData: any) {
    return this.http.post(`${this.serverUrl}/password/reset`, resetData);
  }

  changeLoginPassword(data: any) {
    return this.http.post(`${this.serverUrl}/change-password`, data).pipe(
    catchError(this.handleError)
    );
  }

  getUpdateUserProfile(profileData) {
    return this.http.post<any>(`${this.serverUrl}/user/profile`, profileData).pipe(
      catchError(this.handleError), tap((res: any) => {
        this.authUser = res;
        this.authUserSubject.next({...this.authUser});
      })
    );
  }

  getPwdWorkingUserProfile(pwdWorkingPro) {
    return this.http.post<any>(`${this.serverUrl}/pwd/working-profile`, pwdWorkingPro).pipe(
      catchError(this.handleError), tap((res: any) => {
        this.authUser = res;
        this.authUserSubject.next({...this.authUser});
      })
    );
  }

  uploadUserProfileImage(uploadImageData) {
    return this.http.post<any>(`${this.serverUrl}/user/photo`, uploadImageData).pipe(
      tap((res: any) => {
        this.authUser = res;
        this.authUserSubject.next({...this.authUser});
      })
    );
  }

  loginWithSocialite(data: any) {
    return this.http.get(`${this.serverUrl}/auth/${data.provider}`, data).pipe(map((response: any) => {
      if (response.url) {
        window.location.href = response.url
      }
    }),
    catchError(this.handleError)

    );
  }

  loginFacebookCallback(data) {
    console.log('data', data);
    return this.http.get(`${this.serverUrl}/auth/facebook/callback`, { params: data })
      .pipe(map((res: any) => {
        console.log(res);
        if (res.token) {
          localStorage.setItem('authToken', JSON.stringify(res));
          this.userSubject.next({...res});
        }
      }),
      catchError(this.handleError)
    );
  }

  loginGoogleCallback(data) {
    return this.http.get(`${this.serverUrl}/auth/google/callback`, { params: data })
      .pipe(map((res: any) => {
        if (res.token) {
          localStorage.setItem('authToken', JSON.stringify(res));
          this.userSubject.next({...res});
        }
      }),
      catchError(this.handleError)
    );
  }

  loginGitHubCallback(data) {
    return this.http.get(`${this.serverUrl}/auth/github/callback`, { params: data })
      .pipe(map((res: any) => {
        if (res.token) {
          localStorage.setItem('authToken', JSON.stringify(res));
          this.userSubject.next({...res});
        }
      }),
      catchError(this.handleError)

    );
  }

  deleteAccount(params: any) {
    return this.http.delete(`${this.serverUrl}/users/${params.id}`)
      .pipe(catchError(this.handleError), tap(() => {
        this.userSubject.next(null);
        localStorage.removeItem('authToken');
        this.router.navigate(['/auth']);
      })
    );
  }

  lockMyAccount(data: any) {
    return this.http.put(`${environment.baseURL}/suspendUser`, data).pipe(
      catchError(this.handleError), tap(() => {
        this.userSubject.next(null);
        localStorage.removeItem('authToken');
        this.router.navigate(['/auth']);
      }),

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
    return throwError(error);
  }





}
