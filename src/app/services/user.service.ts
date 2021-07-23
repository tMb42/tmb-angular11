import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Users } from '../models/user.model';

const serverUrl = `${environment.baseURL}/users`;

@Injectable({
  providedIn: 'root'
})

export class UserService {
  users: Users[] = null;

  userSubject = new Subject<Users>();

  constructor(private http: HttpClient) { }

  getUserUpdateListener() {
    return this.userSubject.asObservable();
  }

  getAll(data: any) {
    return this.http.get<Users[]>(`${serverUrl}?page=${data.page}&per_page=${data.per_page}`);
  }

  getById(id: string) {
    return this.http.get<Users>(`${serverUrl}/${id}`);
  }

  create(id: string, params: any) {
    return this.http.post(`${serverUrl}/${id}`, params);
  }

  update(id: string, params: any) {
    return this.http.put(`${serverUrl}/${id}`, params);
  }

  delete(id: string) {
    return this.http.delete(`${serverUrl}/${id}`);
  }


  addUserRoles(params: any) {
    return this.http.put(`${serverUrl}/addRoles/${params.id}`, params).pipe(
      catchError(this.handleError)
    );
  }

  deleteUserRoles(params: any) {
    return this.http.put(`${serverUrl}/deleteRoles/${params.id}`, params).pipe(
      catchError(this.handleError)
    );
  }
  addUserPermissions(data: any) {
    return this.http.put(`${serverUrl}/addAbility/${data.id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteUserPermissions(data: any) {
    return this.http.delete(`${serverUrl}/deleteAbility/${data.id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  blockedUserAc(data: any) {
    return this.http.put(`${environment.baseURL}/suspendUser`, data).pipe(
      catchError(this.handleError), tap((resData: any) => {
        this.userSubject.next({...resData});
      }),

    );
  }

  getAllActiveUserList(data: any) {
    return this.http.get<Users[]>(`${environment.baseURL}/activeUsers?page=${data.page}&per_page=${data.per_page}`);
  }

  getAllBlockedUserList(data: any) {
    return this.http.get<Users[]>(`${environment.baseURL}/blockedUsers?page=${data.page}&per_page=${data.per_page}`);
  }

  activeUserAc(data: any) {
    return this.http.put(`${environment.baseURL}/unlockUser`, data).pipe(
      catchError(this.handleError), tap((resData: any) => {
        this.userSubject.next({...resData});
      }),

    );
  }

  getSearchActiveUser(event: any) {
    return this.http.get<Users[]>(`${environment.baseURL}/serchActiveUser/${event}`);
  }

  getSearchBlockedUser(event: any) {
    return this.http.get<Users[]>(`${environment.baseURL}/serchBlockedUser/${event}`);
  }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong.
  //     console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
  //   }
  //   // Return an observable with a user-facing error message.
  //   return throwError('Something bad happened; please try again later.');
  // }


  private serverError(err: any) {
    // console.log('sever error:', err);  // debug
    if (err instanceof Response) {
      return throwError('backend server error');
      // if you're using lite-server, use the following line
      // instead of the line above:
      // return Observable.throw(err.text() || 'backend server error');
    }
    if (err.status === 0){
      return throwError ({status: err.status, message: 'Backend Server is not Working', statusText: err.statusText});
    }
    if (err.status === 401){
      return throwError ({status: err.status, message: 'Your are not authorised', statusText: err.statusText});
    }
    return throwError(err);
  }

  private handleError(errorResponse: HttpErrorResponse){
    if (errorResponse.error.message.includes('1062')){
      return throwError('Record already exists');
    }else {
      return throwError(errorResponse.error.message);
    }
  }



}
