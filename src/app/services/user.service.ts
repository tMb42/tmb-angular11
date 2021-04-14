import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
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
    console.log('ff', data);
    return this.http.delete(`${serverUrl}/deleteAbility/${data.id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  blockedUserAc(data: any) {
    console.log('ff', data);
    return this.http.put(`${serverUrl}/suspendUser/${data.id}`, data).pipe(
      catchError(this.handleError)
    );
  }
  activeUserAc(data: any) {
    console.log('dd', data);
    return this.http.put(`${serverUrl}/unlockUser/${data.id}`, data).pipe(
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


}