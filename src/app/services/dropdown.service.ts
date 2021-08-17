import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Circle } from '../models/circle.model';
import { Division } from '../models/division.model';
import { Section } from '../models/section.model';
import { SubDivision } from '../models/subDivision.model';
import { Roles } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})

export class DropdownService {

  serverUrl = environment.baseURL;

  circles: Circle = null;
  circleSubject = new Subject<Circle>();

  divns: Division = null;
  divnSubject = new Subject<Division>();

  subDivns: SubDivision = null;
  subDivnSubject = new Subject<SubDivision>();

  sections: Section = null;
  sectionSubject = new Subject<Section>();

  constructor(private http: HttpClient) { }

  getCastes() {
    return this.http.get(`${this.serverUrl}/castes`).pipe(
      catchError(this.handleError)
    );
  }
  getDepartments() {
    return this.http.get(`${this.serverUrl}/departments`).pipe(
      catchError(this.handleError)
    );
  }

  getDesignations() {
    return this.http.get(`${this.serverUrl}/designations`).pipe(
      catchError(this.handleError)
    );
  }
  getSecurityReleasedByDesignations() {
    return this.http.get(`${this.serverUrl}/srDesigns`).pipe(
      catchError(this.handleError)
    );
  }
  getSecurityReleasedPercent() {
    return this.http.get(`${this.serverUrl}/securityRelease`).pipe(
      catchError(this.handleError)
    );
  }
  getAeDesignations() {
    return this.http.get(`${this.serverUrl}/aePost`).pipe(
      catchError(this.handleError)
    );
  }
  getTenderAuthority() {
    return this.http.get(`${this.serverUrl}/tenderAuthority`).pipe(
      catchError(this.handleError)
    );
  }

  getDlp() {
    return this.http.get(`${this.serverUrl}/tenderDlp`).pipe(
      catchError(this.handleError)
    );
  }
  getEeDesignations() {
    return this.http.get(`${this.serverUrl}/eePost`).pipe(
      catchError(this.handleError)
    );
  }
  getSeDesignations() {
    return this.http.get(`${this.serverUrl}/sePost`).pipe(
      catchError(this.handleError)
    );
  }

  getProfessions() {
    return this.http.get(`${this.serverUrl}/nonEngineerRoles`).pipe(
      catchError(this.handleError)
    );
  }
  getNonAdminRole() {
    return this.http.get(`${this.serverUrl}/rolesExceptAdmin`).pipe(
      catchError(this.handleError)
    );
  }
  getAllUserPermission() {
    return this.http.get(`${this.serverUrl}/permissions`).pipe(
      catchError(this.handleError)
    );
  }

  getDistricts() {
    return this.http.get(`${this.serverUrl}/districts`).pipe(
      catchError(this.handleError)
    );
  }

  getRailwayYards() {
    return this.http.get(`${this.serverUrl}/rlys`).pipe(
      catchError(this.handleError)
    );
  }

  getAllCirclesByDeprtId(deprtId: number) {
    return this.http.get(`${this.serverUrl}/circles/${deprtId}`).pipe(
      catchError(this.handleError)
    );
  }

  getAllDivisionsByCircleId(circleId: number) {
    return this.http.get(`${this.serverUrl}/divn/${circleId}`).pipe(
      catchError(this.handleError)
    );
  }
  getAllSubDivisionsByDivisionId(DivnId: number) {
    return this.http.get(`${this.serverUrl}/subDivn/${DivnId}`).pipe(
      catchError(this.handleError)
    );
  }
  getAllSectionsBySubDivisionId(SubDivnId: number) {
    return this.http.get(`${this.serverUrl}/section/${SubDivnId}`).pipe(
      catchError(this.handleError)
    );
  }
  getAllDepartmentalStackyardByDivnId(DivnId: number) {
    return this.http.get(`${this.serverUrl}/stackyard/${DivnId}`).pipe(
      catchError(this.handleError)
    );
  }
  getAllDepartmentalStackyard() {
    return this.http.get(`${this.serverUrl}/allStackyard`).pipe(
      catchError(this.handleError)
    );
  }
  //------------------------------------------------------------------------------------------------------
  getSectionUnderWorkExecuted() {
    return this.http.get(`${this.serverUrl}/workingSection`).pipe(
      catchError(this.handleError)
    );
  }

//---------------------------------------------------------------------------------------------------
  // getCircleUpdateListener() {
  //   return this.circleSubject.asObservable();
  // }

  // getDivisionUpdateListener() {
  //   return this.divnSubject.asObservable();
  // }

  getLastCircleID() {
    return this.http.get<any>(`${this.serverUrl}/lastCircleID`).pipe(
      catchError(this.handleError), tap((res: any) => {
        this.circles = res;
        this.circleSubject.next({...this.circles});
      })
    );
  }

  getNewCircleUnderDeprt(newData) {
    return this.http.post<any>(`${this.serverUrl}/addCircle`, newData).pipe(
      catchError(this.handleError), tap((res: any) => {
        this.circles = res;
        this.circleSubject.next({...this.circles});
      })
    );
  }

//----------------------------------------------------------------------------------------------------------
  getLastDivisionID() {
    return this.http.get<any>(`${this.serverUrl}/lastDivID`).pipe(
      catchError(this.handleError), tap((res: any) => {
        this.divns = res;
        this.divnSubject.next({...this.divns});
      })
    );
  }

  getNewDivisionUnderCircle(newData) {
    return this.http.post<any>(`${this.serverUrl}/addDivision`, newData).pipe(
      catchError(this.handleError), tap((res: any) => {
        this.divns = res;
        this.divnSubject.next({...this.divns});
      })
    );
  }

//----------------------------------------------------------------------------------------------------------
  getLastSubDivisionID() {
    return this.http.get<any>(`${this.serverUrl}/lastSubDivID`).pipe(
      catchError(this.handleError), tap((res: any) => {
        this.subDivns = res;
        this.subDivnSubject.next({...this.subDivns});
      })
    );
  }

  getNewSubDivisionUnderDivision(newData) {
    return this.http.post<any>(`${this.serverUrl}/addSubDivision`, newData).pipe(
      catchError(this.handleError), tap((res: any) => {
        this.subDivns = res;
        this.subDivnSubject.next({...this.subDivns});
      })
    );
  }

//----------------------------------------------------------------------------------------------------------
  getLastSectionID() {
    return this.http.get<any>(`${this.serverUrl}/lastSecID`).pipe(
      catchError(this.handleError), tap((res: any) => {
        this.sections = res;
        this.sectionSubject.next({...this.sections});
      })
    );
  }
  getNewSectionUnderSubDivision(newData) {
    return this.http.post<any>(`${this.serverUrl}/addSection`, newData).pipe(
      catchError(this.handleError), tap((res: any) => {
        this.sections = res;
        this.sectionSubject.next({...this.sections});
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened. Please try again later.');
  }


}
