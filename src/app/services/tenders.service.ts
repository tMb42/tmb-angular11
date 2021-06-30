import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs'
import { environment } from 'src/environments/environment';
import { TenderDetails } from '../models/tenderDetails.model';

const serverUrl = `${environment.baseURL}/recordSection`;

export interface TenderDetailsResponseData {
  success: number;
  td: TenderDetails;
}

@Injectable({
  providedIn: 'root'
})

export class TendersService {

  tenderDetails: TenderDetails[] = [];
  tenderDetailsSubject = new Subject<TenderDetails[]>();

  constructor(private http: HttpClient) {
    this.http.get<TenderDetails[]>(`${serverUrl}/tenderUpdate`)
      .subscribe((response: any) => {
      this.tenderDetails = response.authTenderDetails.data;
      this.tenderDetailsSubject.next([...this.tenderDetails]);
    });
  }

  getTenderDetailsUpdateListener() {
    return this.tenderDetailsSubject.asObservable();
  }

  getAllTenderDetailsAsPerAuthUser(data: any) {
    return this.http.get<TenderDetails[]>(`${serverUrl}/tenderDetails?page=${data.page}`, { params: { per_page: data.itemsPerPage, designation_id: data.designationId, posting_office_id: data.selectedOffice } });
  }

  getValidCirclesByDeprtId(deprtId: number) {
    return this.http.get(`${serverUrl}/circles/${deprtId}`).pipe(
      catchError(this.handleError)
    );
  }

  getValidDivisionsByCircleId(circleId: number) {
    return this.http.get(`${serverUrl}/divn/${circleId}`).pipe(
      catchError(this.handleError)
    );
  }

  getValidSubDivisionsByDivisionId(DivnId: number) {
    return this.http.get(`${serverUrl}/subDivn/${DivnId}`).pipe(
      catchError(this.handleError)
    );
  }

  getValidSectionsBySubDivisionId(SubDivnId: number) {
    return this.http.get(`${serverUrl}/section/${SubDivnId}`).pipe(
      catchError(this.handleError)
    );
  }

  getTenderDetailsByOfficeId(data: any) {
    return this.http.get<TenderDetails[]>(`${serverUrl}/officeTender?page=${data.page}`, { params: { per_page: data.itemsPerPage, designation_id: data.designationId, posting_office_id: data.selectedOffice }});
  }

  getTenderDetailsById(id: number) {
    return this.http.get<TenderDetails[]>(`${serverUrl}/tenderDetails/${id}`);
  }

  saveTenderDetails(newTenderData: any) {
    return this.http.post(`${serverUrl}/tenderDetails`, newTenderData)
    .pipe(catchError(this.handleError), tap((res: any) => {
        this.tenderDetails.unshift(res.td);
        this.tenderDetailsSubject.next([...this.tenderDetails]);
      })
    );
  }

  updateTenderDetails(tenderData: any) {
    return this.http.put(`${serverUrl}/tenderUpdate/${tenderData.id}`, tenderData)
    .pipe(catchError(this.handleError), tap((response: TenderDetailsResponseData) => {
      if (response.success === 1){
        console.log('tenderDetails', this.tenderDetails);
        const index = this.tenderDetails.findIndex(x => x.id === tenderData.id);
          this.tenderDetails[index] = response.td;
          this.tenderDetailsSubject.next([...this.tenderDetails]);
          // console.log('index', this.tenderDetails);
        }
    }));
  }


  getSearchTenderDetailsData(event: any) {
    return this.http.get<TenderDetails[]>(`${serverUrl}/search/${event}`);
  }

  getAllSectionAsPerAuthUserForTenderDetails() {
    return this.http.get(`${serverUrl}/workingSections`).pipe(
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
    return throwError(error);
  }


}
